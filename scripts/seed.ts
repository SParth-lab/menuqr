/* eslint-disable no-console */
import { config } from 'dotenv';

config({ path: '.env.local' });
config({ path: '.env' });

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db';
import { Category, DailyStat, MenuItem, PageView, Post, Restaurant, Template, User } from '../src/models';
import { listTemplates } from '../src/templates/registry';
import { slugify } from '../src/lib/slug';
import { SURAT_VENUES, SEED_POSTS, type SeedVenue } from './surat-data';

const TEMPLATE_ROTATION = [
  'modern', 'cafe', 'luxury', 'indian', 'minimal',
  'elegant', 'street-food', 'dark', 'fastfood', 'colorful',
];

/* A handful sit outside APPROVED so the admin queue and the owner banners have
   something real to render. */
const NOT_APPROVED: Record<string, 'PENDING' | 'REJECTED' | 'SUSPENDED'> = {
  'saffron-terrace-piplod': 'PENDING',
  'wok-and-roll-althan': 'PENDING',
  'ghari-house-majura-gate': 'PENDING',
  'mango-tree-pal': 'PENDING',
  'kailash-dhaba-udhna': 'SUSPENDED',
};

async function seedTemplates() {
  const entries = listTemplates();
  const res = await Template.bulkWrite(
    entries.map((t, i) => ({
      updateOne: {
        filter: { key: t.key },
        update: {
          $set: {
            name: t.name,
            category: t.category,
            description: t.description,
            defaultConfig: t.defaultConfig,
            isActive: true,
            sortOrder: (i + 1) * 10,
          },
        },
        upsert: true,
      },
    }))
  );
  console.log(`templates: ${res.upsertedCount} added, ${res.modifiedCount} updated`);
}

async function seedAdmin() {
  const email = (process.env.SEED_ADMIN_EMAIL || 'admin@qr4blueprint.local').toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';

  if (await User.findOne({ email }).select('_id').lean()) {
    console.log(`admin: ${email} already exists`);
    return;
  }
  await User.create({
    email,
    name: 'Super Admin',
    passwordHash: await bcrypt.hash(password, 12),
    role: 'SUPER_ADMIN',
  });
  console.log(`admin: created ${email}`);
}

/** Deterministic per-slug pseudo-random, so re-seeding produces the same demo. */
function seeded(slug: string) {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i += 1) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return () => {
    h = (Math.imul(h, 1103515245) + 12345) >>> 0;
    return h / 4294967296;
  };
}

async function seedVenue(venue: SeedVenue, index: number) {
  if (await Restaurant.findOne({ slug: venue.slug }).select('_id').lean()) return false;

  const email = `owner+${venue.slug}@qr4blueprint.demo`;
  const owner =
    (await User.findOne({ email })) ??
    (await User.create({
      email,
      name: `${venue.name} Owner`,
      passwordHash: await bcrypt.hash('Owner@12345', 12),
      role: 'RESTAURANT_OWNER',
    }));

  const restaurant = await Restaurant.create({
    ownerId: owner._id,
    name: venue.name,
    slug: venue.slug,
    tagline: venue.tagline,
    description: venue.description,
    coverUrl: venue.cover,
    address: `${venue.area}, Surat`,
    city: 'Surat',
    citySlug: 'surat',
    state: 'Gujarat',
    country: 'India',
    /* Deliberately no phone number: these are real businesses and a generated
       number could belong to someone. */
    currency: 'INR',
    openingHours: venue.hours,
    cuisine: venue.cuisine,
    cuisineSlug: slugify(venue.cuisine),
    tags: venue.tags,
    rating: venue.rating,
    reviewCount: venue.reviewCount,
    priceRange: venue.priceRange,
    isFeatured: Boolean(venue.featured),
    isSampleData: true,
    status: NOT_APPROVED[venue.slug] ?? 'APPROVED',
    rejectionReason: undefined,
    design: {
      templateKey: TEMPLATE_ROTATION[index % TEMPLATE_ROTATION.length],
      isCustom: false,
      config: {},
    },
  });

  for (const [ci, cat] of venue.categories.entries()) {
    const category = await Category.create({
      restaurantId: restaurant._id,
      name: cat.name,
      sortOrder: (ci + 1) * 10,
    });

    await MenuItem.insertMany(
      cat.items.map((item, ii) => ({
        restaurantId: restaurant._id,
        categoryId: category._id,
        name: item.name,
        description: item.desc,
        price: item.price,
        isVeg: item.veg,
        isSpicy: Boolean(item.spicy),
        isAvailable: true,
        isVisible: true,
        sortOrder: (ii + 1) * 10,
      }))
    );
  }

  /* Thirty days of traffic so the charts and the admin dashboard are not empty.
     Weekend-heavy, which is what the real shape looks like. */
  if (restaurant.status === 'APPROVED') {
    const rand = seeded(venue.slug);
    const base = 12 + Math.round(venue.reviewCount / 90);
    const rows = [];

    for (let d = 29; d >= 0; d -= 1) {
      const day = new Date();
      day.setUTCDate(day.getUTCDate() - d);
      const dow = day.getUTCDay();
      const weekend = dow === 0 || dow === 5 || dow === 6 ? 1.6 : 1;
      const views = Math.max(1, Math.round(base * weekend * (0.6 + rand() * 0.9)));

      rows.push({
        restaurantId: restaurant._id,
        day: day.toISOString().slice(0, 10),
        views,
        qrScans: Math.round(views * (0.55 + rand() * 0.3)),
      });
    }
    await DailyStat.insertMany(rows);
  }

  return true;
}

async function seedPosts() {
  let made = 0;
  for (const post of SEED_POSTS) {
    const words = post.bodyMd.trim().split(/\s+/).length;

    /* Upsert rather than skip: an earlier seed wrote these without covers, tags
       or an author, and a half-populated card is worse than none. */
    const existing = await Post.findOne({ slug: post.slug });
    if (existing) {
      Object.assign(existing, {
        type: post.type,
        title: post.title,
        h1: post.h1,
        excerpt: post.excerpt,
        bodyMd: post.bodyMd,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        coverUrl: post.cover,
        tags: post.tags,
        author: post.author,
        readMinutes: Math.max(1, Math.round(words / 220)),
        status: 'PUBLISHED',
      });
      if (!existing.publishedAt) existing.publishedAt = new Date();
      await existing.save();
      continue;
    }

    await Post.create({
      slug: post.slug,
      type: post.type,
      title: post.title,
      h1: post.h1,
      excerpt: post.excerpt,
      bodyMd: post.bodyMd,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      coverUrl: post.cover,
      tags: post.tags,
      author: post.author,
      readMinutes: Math.max(1, Math.round(words / 220)),
      status: 'PUBLISHED',
      publishedAt: new Date(),
    });
    made += 1;
  }
  console.log(`posts: ${made} created, ${SEED_POSTS.length - made} refreshed`);
}

async function main() {
  await connectDB();
  await seedTemplates();
  await seedAdmin();

  let made = 0;
  for (const [i, venue] of SURAT_VENUES.entries()) {
    if (await seedVenue(venue, i)) made += 1;
  }
  console.log(`venues: ${made} created, ${SURAT_VENUES.length - made} already present`);

  await seedPosts();

  const [approved, pending, items, views] = await Promise.all([
    Restaurant.countDocuments({ status: 'APPROVED' }),
    Restaurant.countDocuments({ status: 'PENDING' }),
    MenuItem.countDocuments({}),
    PageView.countDocuments({}),
  ]);

  console.log(
    `\nseed complete — ${approved} live, ${pending} pending, ${items} dishes, ${views} raw views`
  );
  console.log('Sample data: ratings, hours and prices are generated, not sourced from these businesses.');

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
