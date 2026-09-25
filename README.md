# QR4Blueprint

Digital menu + QR code product for restaurants and cafes, built so that public menu
pages are cheap to serve and indexable at scale.

Architecture, schema and rationale: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Run it

```bash
npm install
cp .env.example .env.local     # fill in MONGODB_URI and AUTH_SECRET
npm run seed                   # super admin, 10 templates, demo restaurant, 6 SEO pages
npm run dev
```

| Account | Email | Password |
|---|---|---|
| Super admin | `admin@qr4blueprint.local` | `Admin@12345` |
| Demo owner | `owner@demo.local` | `Owner@12345` |

Demo menus: <http://localhost:3000/city/surat> — 24 Surat venues across 10 cuisines.

**The demo dataset uses real Surat venue names, neighbourhoods and cuisines.**
Ratings, review counts, opening hours and prices are generated sample figures,
not sourced from those businesses, and phone numbers are deliberately omitted.
Every record carries `isSampleData: true`, and the site footer says so.

Owner logins follow `owner+<slug>@qr4blueprint.demo` / `Owner@12345`.

If you seeded before the QR4Blueprint rename, `npm run migrate:emails` moves the
seeded accounts off the old `@menuqr.*` domain. Real signups are untouched.

`npm run db:indexes` syncs indexes deliberately (never on boot — an index build can
lock a collection). Run it as part of deploys.

## Routes

**Public** — `/`, `/menu/[slug]`, `/blog`, `/blog/[slug]`, `/digital-menu/[type]`,
`/qr-menu/[type]`, `/city/[city]`, `/sitemap.xml`, `/robots.txt`

**Owner** — `/dashboard` overview, profile, menu, design, qr, analytics, settings

**Admin** — `/admin` dashboard, approvals, restaurants, users, templates, posts,
analytics, settings

## Three decisions worth knowing

**Menu pages cost no database reads.** `getMenu()` wraps the query in a tagged
`unstable_cache`; every owner write calls `revalidateMenu(slug)`. A menu scanned
10,000 times hits the CDN 10,000 times and Mongo zero. This is what keeps hosting
near-free at thousands of restaurants.

**Templates are config plus composed primitives.** A template is one entry in
`src/templates/registry.ts`: a palette, structural options, and the shared
`createTemplate()` factory. The resolved theme becomes CSS custom properties, so an
owner changing a colour repaints without re-rendering. Adding template #51 is one
file and one line — no migration, no schema change, no change to the menu route.

**Thin pages are excluded from the index on purpose.** A menu needs 5+ items and a
city needs 3+ venues to be indexable, and `sitemap.ts` applies the same predicates,
so a `noindex` page never appears in the sitemap.

## Tenant isolation

Every owner-scoped query filters on the `restaurantId` resolved from the session, never
from the request body. A forged id matches no document and returns 404. `requireAdmin`,
`requireOwnRestaurant` and `middleware.ts` enforce this at three layers.

## Before production

- [ ] **Rotate the MongoDB password** and restrict Atlas Network Access to your deploy IPs.
- [ ] Generate a real `AUTH_SECRET` (`openssl rand -base64 32`).
- [ ] Configure the `R2_*` variables. Without them uploads write to local disk, which
      does not survive a serverless deploy.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain — canonicals, sitemap, OG URLs and
      QR targets all derive from it.
- [ ] Set `NEXT_PUBLIC_ADSENSE_CLIENT` once approved. Ad slots render nothing until then,
      and are deliberately absent from `/menu/[slug]`.

## Not built (deliberately out of scope)

Ordering, payments, delivery, POS, inventory, reservations, customer accounts, loyalty.
