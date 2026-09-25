import type { Metadata } from 'next';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { MenuItem, Restaurant } from '@/models';
import { LinkButton } from '@/components/ui';
import { JsonLd } from '@/components/seo/JsonLd';

export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'QR4Blueprint';

export const metadata: Metadata = {
  title: 'Why we built a menu that changes from the pass',
  description:
    'A printed menu goes out of date the day it is printed. We built a digital menu that is set like a printed card and corrected from the kitchen, behind one QR code that never changes.',
  alternates: { canonical: `${siteUrl}/about` },
};

const PRINCIPLES = [
  {
    n: '01',
    title: 'The code is an address, not a menu',
    body: 'Your QR code encodes one URL and nothing else. Change a price, take the fish off, swap the whole design — the printed code is untouched. That is the difference between a card you reprint quarterly and one you print once.',
  },
  {
    n: '02',
    title: 'A menu is a card, not a web page',
    body: 'We set dishes with dot leaders running to the price, the vegetarian mark before the name, and figures in the display face. Those are printed-menu conventions, and they exist because they work. Most digital menus throw them away and end up looking like a delivery app.',
  },
  {
    n: '03',
    title: 'The guest installs nothing',
    body: 'No app, no account, no email capture before someone can read what the kitchen is cooking. A scan opens a page. That page is the whole product.',
  },
  {
    n: '04',
    title: 'Fast on bad signal, or it does not count',
    body: 'A menu is opened on a phone, in a room full of phones, by someone who is hungry. We serve it as static HTML from a cache, so the page is painted before a heavier site has finished negotiating.',
  },
];

export default async function AboutPage() {
  await connectDB();
  const [venues, dishes] = await Promise.all([
    Restaurant.countDocuments({ status: 'APPROVED' }),
    MenuItem.countDocuments({ isVisible: true }),
  ]);

  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: `About ${siteName}`,
          url: `${siteUrl}/about`,
        }}
      />

      <section className="relative">
        <div className="orbfield" aria-hidden="true" />
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-12 sm:px-6 sm:pt-20">
          <p className="eyebrow rise">Our story</p>
          <h1 className="display rise t-hero mt-5">
            Every printed menu is <span className="foil">out of date</span> by the time it
            reaches the table.
          </h1>
          <p className="rise mt-7 text-[17px] leading-[1.8] text-[var(--ink-soft)]" style={{ animationDelay: '0.08s' }}>
            Not badly out of date. Just a little. A price that moved when onion doubled. A
            dish the kitchen stopped making in March. A seasonal section that ran for eight
            weeks and has been sitting there since.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-4 sm:px-6">
        <div className="prose-mq">
          <p>
            Every venue we looked at was working around the same constraint. A printed menu
            costs real money to reprint, so changes get saved up until there are enough of
            them to justify the run. In the meantime the servers carry the corrections in
            their heads, and the guest reads a document that is quietly wrong.
          </p>

          <p>
            The workarounds are familiar. A sticker over the old price. A laminated insert
            that goes missing. &ldquo;Market price&rdquo; written next to something that has
            a perfectly stable price, because nobody wants to commit it to paper. A dish
            left on the menu all year that the kitchen will talk you out of in April.
          </p>

          <h2>Seasonal menus made the problem obvious</h2>

          <p>
            In Gujarat the winter list is not a marketing exercise. Undhiyu, ponk and
            ubadiyu are available while the produce is available and not one week longer,
            and every kitchen in the state reorganises around that for about eight weeks.
          </p>

          <p>
            A printed menu gives you three bad options: reprint twice a year, print an insert
            that gets lost, or leave the items up all year and disappoint people for ten
            months. Most kitchens pick the third. That is how you end up with an undhiyu on
            the menu in April that nobody intends to cook.
          </p>

          <blockquote>
            A menu that is wrong about what is available teaches diners to ask the server
            instead of reading. Once that habit forms, the menu has stopped working.
          </blockquote>

          <h2>So we separated the code from the card</h2>

          <p>
            The QR code on your table encodes one address. The menu behind that address is
            yours to change whenever you like, from wherever you are, in as long as it takes
            to type a number. Nothing you do afterwards reaches the paper.
          </p>

          <p>
            That is the entire idea. Everything else in the product exists to make the page
            behind the code worth scanning: {venues} venues are live on it today, with{' '}
            {dishes.toLocaleString('en-IN')} dishes priced.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="display t-h1">What we decided, and why</h2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <li key={p.n} className="glass glass-lift rounded-2xl p-6">
              <span className="display block text-[22px] leading-none text-[var(--claret)]">
                {p.n}
              </span>
              <h3 className="display mt-4 text-[17px]">{p.title}</h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--ink-soft)]">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <div className="glass rounded-3xl p-6 sm:p-10">
          <h2 className="display t-h2">What we are not building</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-soft)]">
            No ordering. No payments. No delivery, no POS, no table reservations, no loyalty
            scheme. Those are real products and other people build them well. Adding them
            here would mean a slower menu page and a guest who has to think about software
            before they can read what is for dinner.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-soft)]">
            We do one thing: the card behind the code, and the code on the table.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <LinkButton href="/how-it-works" size="lg">See how it works</LinkButton>
            <LinkButton href="/register" variant="secondary" size="lg">List your venue</LinkButton>
          </div>
        </div>

        <p className="mt-6 text-center text-[13px] text-[var(--muted)]">
          Browsing rather than listing?{' '}
          <Link href="/city/surat" className="font-semibold text-[var(--claret)] hover:underline">
            See the menus already live in Surat
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
