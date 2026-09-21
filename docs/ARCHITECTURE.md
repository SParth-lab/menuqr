# MenuQR — Architecture

Digital menu + QR + SEO/AdSense product. Optimised for: organic traffic, page speed, low ops cost.

---

## 1. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | One codebase for public SEO pages, dashboard, and API. Server Components render menus as static HTML — the single biggest SEO + speed lever. |
| Styling | **Tailwind CSS v4** + CSS custom properties | Templates need runtime-variable theming; CSS vars do it with zero JS. |
| DB | **MongoDB** (local dev / Atlas free tier in prod) | Schemaless theme config means adding template #51 needs no migration. Menu reads are keyed by one id. |
| ODM | **Mongoose 8** | Schema validation, subdocuments, `bulkWrite` for reorder. |
| Auth | **Auth.js v5 (NextAuth)** — Credentials + JWT session | No external auth bill. Role claim in the JWT. |
| Images | **Cloudflare R2** + presigned uploads, served via `next/image` | Zero egress fees. S3-compatible so swappable. |
| QR | **`qrcode`** npm, generated server-side | SVG + PNG from one call. No third-party API. |
| Hosting | **Vercel Hobby/Pro**, or Cloudflare Workers via OpenNext | ISR + edge caching included. |
| Analytics | Own `pageviews` collection + daily rollup | AdSense-compatible, no vendor cost, no cookie banner. |

**Rejected:** separate Nest/Express backend (doubles hosting + latency, no benefit at this scale), a headless CMS (the Super Admin post editor is ~200 lines).

**Local constraint:** the dev MongoDB is standalone, so multi-document transactions are unavailable. Registration therefore creates `user` then `restaurant` sequentially and deletes the orphan user if the second write fails. Atlas is a replica set, so this can become a real transaction later without touching callers.

---

## 2. System architecture

```
                    ┌────────────────────────────┐
   Google bot ─────▶│  PUBLIC (RSC, ISR-cached)  │
   QR scanner ─────▶│  /menu/[slug]              │──┐
   Organic ────────▶│  /blog/*  /digital-menu/*  │  │
                    │  /city/*  sitemap  robots  │  │
                    └────────────────────────────┘  │
                                                    │ read
                    ┌────────────────────────────┐  │
   Owner ──────────▶│  /dashboard/*  (SSR, auth) │──┤
                    └────────────────────────────┘  │
                    ┌────────────────────────────┐  │  ┌──────────────┐
   Super Admin ────▶│  /admin/*      (SSR, auth) │──┼─▶│  PostgreSQL  │
                    └────────────────────────────┘  │  └──────────────┘
                    ┌────────────────────────────┐  │  ┌──────────────┐
   Any ────────────▶│  /api/*  (Route Handlers)  │──┘  │ Cloudflare R2│
                    └────────────────────────────┘     └──────────────┘
```

**Caching contract — the load-bearing decision.** `/menu/[slug]` is statically generated and revalidated by tag (`menu:<restaurantId>`). Any menu/design/profile write calls `revalidateTag`. Result: a menu page scanned 10,000 times costs ~10,000 CDN hits and **zero** DB queries. This is what keeps hosting near-free at thousands of restaurants.

Analytics writes are fire-and-forget to a separate uncached route so they never block the render.

Mongoose connections are cached on `globalThis` so Next.js hot-reload and serverless invocations reuse one pool instead of exhausting Atlas connection limits.

---

## 3. Database schema

Collections and their relationships:

```
users ──1:1── restaurants ──1:N── categories ──1:N── menuitems
                   │                                  (categoryId)
                   ├── design        (embedded subdoc, 1:1)
                   ├──1:N── pageviews   (TTL 90d)
                   └──1:N── dailystats  (permanent rollup)

templates  (seeded catalog, no ref — templateKey is a string)
posts      (blog / landing / city / category / guide)
```

**Embedded vs referenced.** `design` is embedded in `restaurants` because it is 1:1 and always read with it. `categories` and `menuitems` are separate collections because they are edited item-by-item all day, and a positional update two arrays deep needs `arrayFilters` for no gain — the public page is ISR-cached, so the extra query runs once per revalidation, not once per scan.

| Collection | Fields | Indexes |
|---|---|---|
| `users` | email, passwordHash, name, role:`SUPER_ADMIN`\|`RESTAURANT_OWNER`, isActive | `email` uniq |
| `restaurants` | ownerId, name, slug, logoUrl, description, address, city, citySlug, phone, email, socials{}, currency, status:`PENDING`\|`APPROVED`\|`REJECTED`\|`SUSPENDED`, rejectionReason, seoTitle, seoDescription, design{templateKey, isCustom, config{}} | `slug` uniq, `ownerId` uniq, `status`, `citySlug+status` |
| `categories` | restaurantId, name, description, sortOrder, isVisible | `restaurantId+sortOrder` |
| `menuitems` | restaurantId, categoryId, name, description, price, imageUrl, isVeg, isSpicy, isAvailable, isVisible, sortOrder | `restaurantId+categoryId+sortOrder` |
| `templates` | key uniq, name, category, description, defaultConfig{}, isActive, sortOrder | `key` uniq |
| `pageviews` | restaurantId, day, source:`QR`\|`DIRECT`\|`SEARCH`\|`SOCIAL`, itemId?, createdAt | `restaurantId+day`, TTL 90d on `createdAt` |
| `dailystats` | restaurantId, day, views, qrScans | uniq `restaurantId+day` |
| `posts` | slug uniq, type:`BLOG`\|`LANDING`\|`CITY`\|`CATEGORY`\|`GUIDE`, title, h1, excerpt, bodyMd, metaTitle, metaDescription, coverUrl, status, publishedAt | `slug` uniq, `type+status` |

`restaurantId` is denormalised onto `menuitems` so every owner query is scoped by one indexed field without a join — this is also what makes tenant isolation enforceable in a single `find` filter.

Ordering uses an integer `sortOrder` gapped by 10. Reorder is one `bulkWrite`.

**Index creation.** Indexes are declared in the Mongoose schemas but `autoIndex` is **off in production** — building an index on boot can lock a large collection at an uncontrolled time. `npm run db:indexes` syncs them deliberately, and that command belongs in the deploy notes.

## 4. Folder structure

```
src/
  app/
    (public)/
      page.tsx                     # home
      menu/[slug]/page.tsx         # THE menu page — ISR, schema.org
      blog/[slug]/page.tsx
      digital-menu/[type]/page.tsx # /digital-menu/restaurant|cafe
      qr-menu/[type]/page.tsx
      city/[city]/page.tsx
      sitemap.ts  robots.ts
    (dashboard)/dashboard/
      page.tsx  profile/  menu/  design/  qr/  analytics/  settings/
    (admin)/admin/
      page.tsx  restaurants/  approvals/  users/  templates/  posts/  analytics/
    api/
      auth/[...nextauth]/  restaurants/  categories/  items/
      design/  qr/[slug]/  upload/  track/  admin/
  components/
    ui/          # buttons, inputs, modal
    dashboard/   # sidebar, stat cards
    menu/        # MenuShell, CategoryNav, ItemCard  ← template primitives
    ads/         # AdSlot, AdSenseScript
    seo/         # JsonLd
  templates/
    registry.ts  # key -> { meta, defaultConfig, Component }
    modern/ minimal/ luxury/ cafe/ street-food/ indian/ dark/ elegant/ colorful/ fastfood/
  models/
    User.ts Restaurant.ts Category.ts MenuItem.ts Template.ts
    PageView.ts DailyStat.ts Post.ts  index.ts
  lib/
    auth.ts  db.ts  slug.ts  qr.ts  storage.ts  analytics.ts  seo.ts  rbac.ts
scripts/seed.ts  scripts/sync-indexes.ts
```

---

## 5. API structure

REST route handlers. Every mutating owner route resolves `restaurantId` **from the session**, never from the body.

```
POST   /api/auth/register            public
       /api/auth/[...nextauth]       public

GET    /api/restaurants/me           owner
PATCH  /api/restaurants/me           owner
GET    /api/qr/[slug]?format=png|svg public (cached 1y)

GET    /api/categories               owner
POST   /api/categories               owner
PATCH  /api/categories/:id           owner
DELETE /api/categories/:id           owner
POST   /api/categories/reorder       owner

POST   /api/items                    owner
PATCH  /api/items/:id                owner   # also toggles availability/visibility
DELETE /api/items/:id                owner
POST   /api/items/reorder            owner

GET    /api/design                   owner
PUT    /api/design                   owner   # templateKey + config
GET    /api/templates                owner

POST   /api/upload                   owner   # presigned R2 PUT
POST   /api/track                    public  # fire-and-forget, no auth
GET    /api/analytics/summary        owner

GET    /api/admin/stats              super admin
GET    /api/admin/restaurants        super admin
PATCH  /api/admin/restaurants/:id    super admin   # approve/reject/suspend/activate
DELETE /api/admin/restaurants/:id    super admin
CRUD   /api/admin/posts              super admin
```

---

## 6. Auth / authorization flow

**Register** → bcrypt hash → create `users` doc (`RESTAURANT_OWNER`), then `restaurants` doc (`status=PENDING`, unique `slug`, `design.templateKey='modern'`). No transaction on standalone Mongo, so a failed second write deletes the orphan user.

**Login** → Credentials provider → JWT session carrying `{ id, role, restaurantId }`.

**Enforcement, three layers:**
1. `middleware.ts` — `/dashboard/*` needs a session; `/admin/*` needs `role=SUPER_ADMIN`.
2. `lib/rbac.ts` — `requireOwner()` / `requireAdmin()` at the top of every handler.
3. Every query is scoped by the session's `restaurantId`. An owner cannot read or write another restaurant's rows even with a forged id in the body.

**Public menu gate:** `/menu/[slug]` returns 404 unless `status === 'APPROVED'`, and emits `noindex` for anything else. Pending restaurants get a preview URL the owner can see while logged in.

Super admin is created by seed, not by signup. There is no admin registration route.

---

## 7. SEO strategy

Per menu page: dynamic `<title>`/description from restaurant data, canonical, OpenGraph + Twitter card, `Restaurant` + `Menu` JSON-LD (Schema.org), one `<h1>`, `h2` per category, `h3` per item, images with alt text and explicit dimensions.

Indexation rules — **thin pages are excluded on purpose**:

| Page | Indexed when |
|---|---|
| `/menu/[slug]` | APPROVED **and** ≥ 5 items **and** ≥ 1 category. Below that → `noindex` until filled. |
| `/city/[city]` | ≥ 3 approved restaurants in that city. |
| `/blog/*`, `/digital-menu/*`, `/qr-menu/*` | Published, hand-written. |

`sitemap.ts` streams from the DB with the same predicates, so a noindex page never appears in the sitemap. Above ~5k URLs it splits into a sitemap index (`/sitemap/[n].xml`).

Internal linking: menu page → its city page → sibling restaurants; guides → relevant city and category pages. That is what gets deep pages crawled.

Core Web Vitals: static HTML, no client JS on the menu route beyond a tiny tracker, fonts self-hosted with `next/font`, images AVIF/WebP with fixed aspect ratio (CLS 0).

---

## 8. Menu template architecture

A template is **config + a component built from shared primitives**, not a standalone page.

```ts
// templates/registry.ts
export type ThemeConfig = {
  primary: string; secondary: string; background: string; surface: string; text: string; muted: string;
  fontHeading: FontKey; fontBody: FontKey;
  radius: 'none'|'sm'|'md'|'lg'|'full';
  cardStyle: 'flat'|'elevated'|'outlined'|'glass';
  buttonStyle: 'solid'|'outline'|'ghost'|'pill';
  layout: 'list'|'grid'|'compact'|'magazine';
  logoPosition: 'left'|'center'|'right';
  showImages: boolean; showDividers: boolean;
};

export const templates = {
  modern:  { meta: {...}, defaultConfig: {...}, Component: ModernTemplate },
  minimal: { ... },
  // adding template #51 = one file + one line here. No migration, no schema change.
}
```

Rendering: the resolved config (`template.defaultConfig` merged with `MenuDesign.config`) is emitted as CSS custom properties on the page root. Templates consume `var(--primary)` etc., so **customisation costs zero extra JS and zero re-render**. "Custom design" is just `isCustom: true` with a fully-overridden config — same code path, no branch.

Shared primitives (`MenuShell`, `CategoryNav`, `ItemCard`, `RestaurantHeader`) mean a new template is a layout arrangement, typically 60–120 lines.

---

## 9. MVP phases

| # | Phase | Contents |
|---|---|---|
| 0 | Scaffold | Next.js, Tailwind, Mongoose, env, lint |
| 1 | Data | Models, indexes, seed (super admin + 10 templates) |
| 2 | Auth | Register, login, middleware, RBAC helpers |
| 3 | Owner shell | Sidebar, dashboard home, restaurant profile + logo upload |
| 4 | Menu CRUD | Categories, items, reorder, visibility, availability |
| 5 | Design | Template picker, live customiser, save |
| 6 | Public menu | ISR route, 10 templates, mobile-first, JSON-LD |
| 7 | QR | Generate, preview, PNG/SVG download, print sheet |
| 8 | Admin | Stats, restaurant list, approve/reject/suspend/delete |
| 9 | SEO | sitemap, robots, metadata, city pages, post CMS |
| 10 | Analytics + ads | Tracker, rollup, dashboard charts, `AdSlot` components |

Explicitly out of scope for V1: ordering, payments, delivery, POS, inventory, reservations, customer accounts, loyalty.
