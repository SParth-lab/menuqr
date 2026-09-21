/* eslint-disable no-console */
import { config } from 'dotenv';

config({ path: '.env.local' });
config({ path: '.env' });
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db';
import { Category, MenuItem, Post, Restaurant, Template, User } from '../src/models';
import { listTemplates } from '../src/templates/registry';
import { slugify } from '../src/lib/slug';

async function seedTemplates() {
  const entries = listTemplates();
  // Same-value guard: only write templates whose definition actually changed.
  const ops = entries.map((t, i) => ({
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
  }));
  const res = await Template.bulkWrite(ops);
  console.log(`templates: ${res.upsertedCount} added, ${res.modifiedCount} updated`);
}

async function seedAdmin() {
  const email = (process.env.SEED_ADMIN_EMAIL || 'admin@menuqr.local').toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';

  const existing = await User.findOne({ email }).select('_id').lean();
  if (existing) {
    console.log(`admin: ${email} already exists, left untouched`);
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

const DEMO_MENU: Array<[string, Array<[string, string, number, boolean, boolean]>]> = [
  ['Starters', [
    ['Paneer Tikka', 'Char-grilled cottage cheese, mint chutney', 280, true, true],
    ['Chicken 65', 'Crisp fried chicken, curry leaf, red chilli', 320, false, true],
    ['Hara Bhara Kebab', 'Spinach, peas and potato patties', 240, true, false],
  ]],
  ['Main Course', [
    ['Butter Chicken', 'Tandoori chicken in a tomato butter gravy', 420, false, false],
    ['Dal Makhani', 'Black lentils simmered overnight', 300, true, false],
    ['Paneer Butter Masala', 'Cottage cheese in a creamy tomato gravy', 360, true, false],
  ]],
  ['Breads', [
    ['Butter Naan', 'Leavened flatbread from the tandoor', 70, true, false],
    ['Laccha Paratha', 'Layered whole wheat flatbread', 80, true, false],
  ]],
  ['Beverages', [
    ['Masala Chai', 'Spiced milk tea', 60, true, false],
    ['Sweet Lassi', 'Chilled sweetened yoghurt', 110, true, false],
  ]],
  ['Desserts', [
    ['Gulab Jamun', 'Warm milk dumplings in cardamom syrup', 130, true, false],
    ['Kulfi Falooda', 'Saffron kulfi, vermicelli, rose', 160, true, false],
  ]],
];

async function seedDemoRestaurant() {
  const email = 'owner@demo.local';
  if (await User.findOne({ email }).select('_id').lean()) {
    console.log('demo: owner@demo.local already exists, skipped');
    return;
  }

  const owner = await User.create({
    email,
    name: 'Demo Owner',
    passwordHash: await bcrypt.hash('Owner@12345', 12),
    role: 'RESTAURANT_OWNER',
  });

  const restaurant = await Restaurant.create({
    ownerId: owner._id,
    name: 'Spice Route Kitchen',
    slug: 'spice-route-kitchen',
    tagline: 'North Indian classics, cooked to order',
    description:
      'Spice Route Kitchen serves North Indian classics in Ahmedabad — tandoori starters, slow-cooked curries and fresh breads, with a full vegetarian menu.',
    address: '12 Ashram Road, Navrangpura',
    city: 'Ahmedabad',
    citySlug: slugify('Ahmedabad'),
    state: 'Gujarat',
    country: 'India',
    phone: '+91 79 4000 1234',
    currency: 'INR',
    openingHours: 'Daily 11:00 – 23:00',
    status: 'APPROVED',
    socials: { instagram: 'https://instagram.com/example', website: 'https://example.com' },
    design: { templateKey: 'indian', isCustom: false, config: {} },
  });

  for (const [ci, [catName, items]] of DEMO_MENU.entries()) {
    const category = await Category.create({
      restaurantId: restaurant._id,
      name: catName,
      sortOrder: (ci + 1) * 10,
    });

    await MenuItem.insertMany(
      items.map(([name, description, price, isVeg, isSpicy], ii) => ({
        restaurantId: restaurant._id,
        categoryId: category._id,
        name,
        description,
        price,
        isVeg,
        isSpicy,
        sortOrder: (ii + 1) * 10,
      }))
    );
  }

  console.log('demo: created /menu/spice-route-kitchen (owner@demo.local / Owner@12345)');
}

const SEED_POSTS = [
  {
    slug: 'how-to-create-a-digital-menu',
    type: 'GUIDE' as const,
    title: 'How to Create a Digital Menu for Your Restaurant (2026 Guide)',
    h1: 'How to create a digital menu for your restaurant',
    excerpt: 'A practical walkthrough: structure your categories, write item descriptions that sell, price clearly, and put a QR code on the table.',
    metaTitle: 'How to Create a Digital Menu for Your Restaurant (2026)',
    metaDescription: 'Step-by-step guide to building a digital restaurant menu: categories, descriptions, pricing, photos and QR codes. Free to follow.',
    status: 'PUBLISHED' as const,
    bodyMd: `A digital menu is simply your menu on a web page, opened by scanning a QR code at the table. It costs nothing to reprint and it can be corrected in seconds.

## Start with the category structure

Most menus need between four and eight categories. Fewer than four and diners scroll past everything; more than eight and the category bar becomes its own navigation problem.

A structure that works for most full-service restaurants:

- Starters
- Main course
- Breads or sides
- Beverages
- Desserts

Put the category people order from most at the top. For a cafe that is usually coffee, not food.

## Write descriptions that do work

A description earns its place by answering a question the name leaves open. "Butter Chicken" needs no explanation in Delhi and a full one in Lisbon.

Three rules:

1. Lead with the ingredient that decides the order.
2. Keep it under fifteen words. Diners scan, they do not read.
3. Say what is unusual, not what is obvious.

## Price where the eye lands

Prices set flush against the item name invite line-by-line comparison shopping. Prices placed after the description, in the same weight as the body text, get read as information rather than as a bill.

## Mark dietary information properly

Vegetarian and spice indicators are the single most-used feature of any menu in India, and increasingly everywhere else. Mark every item, not just the ones you think need it — an unmarked item reads as "nobody checked".

## Photograph selectively

A photograph next to every item makes a menu feel like a delivery app. Photograph the six dishes you want to sell and leave the rest as text.

## Put the QR code where hands already are

Table tents work. Stickers on the table surface work better because they survive being moved. Menus printed with the QR in the corner work for venues that want to keep a physical menu as well.

Test the scan yourself, at the table, in the actual lighting of your dining room, before printing a hundred of them.`,
  },
  {
    slug: 'benefits-of-qr-menu-for-restaurants',
    type: 'BLOG' as const,
    title: 'QR Menus: What They Actually Change for a Restaurant',
    h1: 'QR menus: what they actually change for a restaurant',
    excerpt: 'Beyond the hygiene argument — the real operational reasons restaurants keep QR menus after switching.',
    metaTitle: 'QR Menus: Real Benefits for Restaurants and Cafes',
    metaDescription: 'The practical case for QR menus: instant price changes, no reprinting cost, out-of-stock control and menu analytics.',
    status: 'PUBLISHED' as const,
    bodyMd: `Most restaurants first adopted QR menus for hygiene reasons. Most kept them for reasons that have nothing to do with hygiene.

## Price changes stop being an event

A printed menu makes every price change a batch decision — you wait until enough changes accumulate to justify a reprint. That delay is a real cost when ingredient prices move.

## Out-of-stock is handled at the source

Marking a dish unavailable takes a moment and every diner sees it at once. Servers stop apologising for the same dish forty times a night.

## The menu becomes measurable

A printed menu tells you nothing about what people looked at. A digital one tells you which categories get opened and which items get attention, which is the input you need before redesigning it.

## Reprinting cost goes to zero

For a fifty-seat restaurant reprinting quarterly, laminated menus run into real money each year. The digital version costs nothing to change.

## What QR menus do not fix

They do not replace a server's recommendation, they do not work well for diners without a smartphone, and a slow-loading menu is worse than a printed one. Keep a few printed copies, and make sure your menu page loads in under two seconds on mobile data.`,
  },
  {
    slug: 'digital-menu-restaurant',
    type: 'LANDING' as const,
    title: 'Digital Menu for Restaurants — Free QR Menu Maker',
    h1: 'Digital menu for restaurants',
    excerpt: 'Build a mobile-first digital menu for your restaurant and get a QR code customers scan at the table.',
    metaTitle: 'Digital Menu for Restaurants — Free QR Menu Maker',
    metaDescription: 'Create a digital restaurant menu with categories, photos, prices and dietary markers. Get a unique QR code. No app needed for guests.',
    status: 'PUBLISHED' as const,
    bodyMd: `A restaurant menu has to do more work than a cafe menu. It carries more items, more categories, and more dietary information, and it is read by a table of people passing one phone around.

## What a restaurant menu needs

- **Category navigation that stays reachable.** Sticky category bars matter once you pass thirty items.
- **Vegetarian and spice markers on every item.** Unmarked items get skipped.
- **Availability control.** Marking the fish off for the evening should take one tap.
- **Fast loading on mobile data.** The menu is opened on a phone, often on a weak signal.

## Setting it up

Add your restaurant details, create your categories, add items with prices, choose a design, then download the QR code and put it on the table. There is nothing to install, and your guests never create an account.`,
  },
  {
    slug: 'digital-menu-cafe',
    type: 'LANDING' as const,
    title: 'Digital Menu for Cafes — QR Code Menu Maker',
    h1: 'Digital menu for cafes',
    excerpt: 'A fast, good-looking digital menu for coffee shops, bakeries and dessert bars.',
    metaTitle: 'Digital Menu for Cafes — QR Code Menu Maker',
    metaDescription: 'Create a cafe menu online with a QR code. Coffee, bakery and dessert categories, photos and prices, on a mobile-first page.',
    status: 'PUBLISHED' as const,
    bodyMd: `Cafe menus are shorter than restaurant menus and read far more often per seat. Somebody ordering a flat white does not want to scroll past a starters section.

## What works for a cafe

- **Put drinks first.** It is what most people are there for.
- **Keep descriptions short.** A cortado needs three words, not fifteen.
- **Photograph the bakery counter, not the coffee.** Pastries sell on sight.
- **Use size variants as separate items** where the price differs meaningfully.

## Design

Warm, low-contrast palettes suit cafes better than the high-contrast styles that work for fast food. The Cafe template is built for exactly this, and you can change the colours and fonts afterwards.`,
  },
  {
    slug: 'qr-menu-restaurant',
    type: 'LANDING' as const,
    title: 'QR Menu for Restaurants — Generate Your Code Free',
    h1: 'QR menu for restaurants',
    excerpt: 'Generate a QR code that opens your restaurant menu, download it as PNG or SVG, and print it for the table.',
    metaTitle: 'QR Menu for Restaurants — Free QR Code Generator',
    metaDescription: 'Create a QR code menu for your restaurant. Download as PNG or SVG, print for tables. Guests scan and see your live menu, no app required.',
    status: 'PUBLISHED' as const,
    bodyMd: `Your QR code points at one URL: your menu page. Change the menu and the code keeps working, because the code never changes — only the page behind it does.

## Where to put the code

- **Table stickers** survive being moved and wiped. The most reliable option.
- **Table tents** are easy to replace and give you room for a line of instruction.
- **Printed menus with a QR in the corner** suit venues keeping a physical menu as well.

## Size and contrast

Print at 3 cm across or larger for a table-distance scan. Keep a clear white margin around the code, and never print light-on-dark — many camera apps fail on inverted codes.

## Test before you print

Scan it yourself at the table, in your dining room's actual lighting, with both an iPhone and an Android phone. Print a hundred only after that works.

## Download formats

PNG suits stickers and digital use. SVG is a vector, so use it whenever a printer asks for artwork — it stays sharp at any size.`,
  },
  {
    slug: 'qr-menu-cafe',
    type: 'LANDING' as const,
    title: 'QR Menu for Cafes — Free QR Code Menu Generator',
    h1: 'QR menu for cafes',
    excerpt: 'A QR code that opens your cafe menu on any phone. Download, print, stick it on the counter.',
    metaTitle: 'QR Menu for Cafes — Free QR Code Generator',
    metaDescription: 'Generate a QR code menu for your cafe or coffee shop. Print for counters and tables. Update drinks and prices any time.',
    status: 'PUBLISHED' as const,
    bodyMd: `Cafes have two scan points, and they need different things.

## At the counter

People in a queue are deciding. A counter code needs to be at eye level and scannable from about a metre back, which means printing it larger than a table code.

## At the table

Table codes are scanned from close range, so they can be small. What matters more is that they survive cleaning — a laminated sticker outlasts a paper tent by months.

## Keep the menu short behind it

A cafe menu opened on a phone should show drinks without scrolling. Put coffee first, then the rest.

## Updating

Seasonal drinks come and go. Add the item, mark last season's unavailable, and every code already printed shows the change immediately.`,
  },
];

async function seedPosts() {
  for (const post of SEED_POSTS) {
    const existing = await Post.findOne({ slug: post.slug }).select('_id').lean();
    if (existing) continue;
    await Post.create({ ...post, publishedAt: new Date() });
    const path = post.type === 'LANDING' ? `/${post.slug.replace(/^(digital-menu|qr-menu)-/, '$1/')}` : `/blog/${post.slug}`;
    console.log(`post: created ${path}`);
  }
}

async function main() {
  await connectDB();
  await seedTemplates();
  await seedAdmin();
  await seedDemoRestaurant();
  await seedPosts();
  await mongoose.disconnect();
  console.log('\nseed complete');
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
