import type { Metadata } from 'next';
import { listTemplates } from '@/templates/registry';
import { LinkButton } from '@/components/ui';
import { JsonLd } from '@/components/seo/JsonLd';

export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'How it works — set the menu, set the card, print the code',
  description:
    'A walkthrough of setting up a digital menu: building categories and dishes, choosing and customising the design, generating the QR code, and running day-to-day changes from the kitchen.',
  alternates: { canonical: `${siteUrl}/how-it-works` },
};

const STEPS = [
  {
    n: '01',
    title: 'Set the menu',
    lede: 'Categories hold dishes. Most venues land on four to eight.',
    points: [
      ['Categories first', 'Starters, mains, breads, drinks, sweets. Fewer than four and diners scroll past everything; more than eight and the category bar becomes its own navigation problem. Put the one people order from most at the top — for a café that is coffee, not food.'],
      ['Then the dishes', 'Name, price, and a short description. Keep descriptions under about fifteen words: a description earns its place by answering a question the name leaves open, not by restating it.'],
      ['Mark every item', 'The vegetarian and non-vegetarian marks are the most-read thing on an Indian menu. Mark all of them. An unmarked dish does not read as "probably vegetarian" — it reads as "nobody checked".'],
      ['Photograph selectively', 'Six photographs on a forty-item menu is a design. Forty is a delivery app. Shoot the dishes you want to sell and leave the rest as text.'],
      ['Reorder by dragging the arrows', 'Order is yours. The kitchen knows which dish should be first better than any algorithm does.'],
    ],
  },
  {
    n: '02',
    title: 'Set the card',
    lede: 'Pick a design, then move one control and the rest follows.',
    points: [
      ['Choose a template', 'Each carries its own paper, ink and display face — a bright counter menu and a dim dining room want different things. Switching template is one click and never touches your dishes.'],
      ['Move the accent', 'Change the accent colour and every rule, heading and price follows it, so the card cannot fall out of register. That is why there is no separate control for each element.'],
      ['Dot leaders on or off', 'The row of dots running from the dish name to the price is a printed-menu convention. It lets the eye travel across without the column of figures becoming the first thing scanned. Turn it off for a tighter, more modern list.'],
      ['Watch the live preview', 'The phone beside the controls is the real page at real width. What you see is what a guest sees — nothing is published until you save.'],
    ],
  },
  {
    n: '03',
    title: 'Print the code',
    lede: 'One code, printed once, pointed at an address that never moves.',
    points: [
      ['Download PNG or SVG', 'PNG for stickers and screens. SVG for anything a print shop produces — it is a vector, so it stays sharp at any size and the printer will not resample it.'],
      ['Print at 30mm or larger', 'Scanning distance is roughly ten times the code width, so 30mm reads comfortably from where a seated guest holds their phone. A counter code read from a queue wants 60mm or more.'],
      ['Keep the quiet zone', 'Leave clear space around the code — about 10% of its width. Cropping tight into a coloured background is the single most common reason a code fails to scan.'],
      ['Never invert it', 'Dark code on a light background. Many camera apps still fail on inverted codes, and the ones that succeed take longer. It is the rule people break most often because inverted looks better on a dark card.'],
      ['Test before the run', 'Scan it at the table, in your own lighting, on one iPhone and one Android. Lighting is the variable people skip. Print a hundred after that works, not before.'],
    ],
  },
  {
    n: '04',
    title: 'Change it from the pass',
    lede: 'This is the part that pays for itself.',
    points: [
      ['Mark a dish unavailable', 'One tap. Every table sees it at once, and the servers stop apologising for the same dish forty times a night. The dish stays visible and struck through, because hiding it makes guests ask for it anyway.'],
      ['Move a price', 'Type the new number. There is no reprint, no insert, no sticker, and no window where the menu disagrees with the till.'],
      ['Run a seasonal section', 'Add the category in November, hide it in February, bring it back next year. The printed code never knew it happened.'],
      ['Watch what gets read', 'The analytics screen shows menu views and how many arrived by scanning the printed code, which is the input you want before redesigning anything.'],
    ],
  },
];

const FAQ = [
  ['Do my guests need an app?', 'No. Scanning opens a web page. There is no app, no account and no email capture before someone can read the menu.'],
  ['Does the QR code change when I change the menu?', 'Never. The code encodes one address. Everything behind that address is yours to change as often as you like, and a card printed today stays correct next season.'],
  ['What happens if I rename my restaurant?', 'That is the one change that moves your public address, so the printed code would need reissuing. Everything else — prices, dishes, design, photographs — leaves the code alone.'],
  ['Can I take a dish off for one evening?', 'Yes. Mark it unavailable and it shows as unavailable to every table immediately. Turn it back on when the delivery arrives.'],
  ['How fast does the menu load?', 'The public menu is served as static HTML from a cache, so it paints in well under a second on mobile data. That matters more than it sounds: the page is opened on a weak signal by someone who is hungry.'],
  ['Is my menu found on Google?', 'Yes, once it has enough content. Each menu page carries its own title, description, canonical URL and Restaurant and Menu structured data. Pages with fewer than five dishes stay out of the index until they are filled in, so a half-built menu does not represent you in search.'],
  ['Do you take a cut of orders?', 'There are no orders. We do not handle ordering, payments or delivery, so there is nothing to take a cut of.'],
];

export default function HowItWorksPage() {
  const templates = listTemplates();

  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ.map(([q, a]) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        }}
      />

      <section className="relative">
        <div className="orbfield" aria-hidden="true" />
        <div className="mx-auto max-w-3xl px-4 pb-8 pt-12 sm:px-6 sm:pt-20">
          <p className="eyebrow rise">How it works</p>
          <h1 className="display rise t-hero mt-5">
            Set the menu. Set the card. <span className="foil">Print the code once.</span>
          </h1>
          <p className="rise mt-7 text-[17px] leading-[1.8] text-[var(--ink-soft)]" style={{ animationDelay: '0.08s' }}>
            Most venues are live in under an hour, and the longest part is typing in the
            dishes. Here is what each step actually involves.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {STEPS.map((step) => (
          <section key={step.n} className="border-t border-[var(--line)] py-12 sm:py-16">
            <div className="flex items-baseline gap-4">
              <span className="display text-[26px] leading-none text-[var(--claret)]">{step.n}</span>
              <div>
                <h2 className="display t-h1">{step.title}</h2>
                <p className="mt-2 text-[15px] text-[var(--muted)]">{step.lede}</p>
              </div>
            </div>

            <dl className="mt-8 space-y-6 sm:pl-[3.4rem]">
              {step.points.map(([t, b]) => (
                <div key={t} className="border-l-2 border-[var(--pane-hi)] pl-5">
                  <dt className="display text-[16px]">{t}</dt>
                  <dd className="mt-1.5 text-[14.5px] leading-[1.75] text-[var(--ink-soft)]">{b}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <section className="mx-auto max-w-4xl px-4 pb-4 sm:px-6">
        <div className="glass rounded-3xl p-6 sm:p-10">
          <h2 className="display t-h2">{templates.length} designs, and none of them lock you in</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-soft)]">
            Switching template never touches your dishes. Try one at service, change it after
            close, and the code on the table is unaffected either way.
          </p>
          <ul className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {templates.map((t) => (
              <li key={t.key} className="rounded-xl border border-[var(--line)] p-3">
                <span
                  className="block h-10 rounded-lg"
                  style={{ background: t.defaultConfig.background, boxShadow: 'inset 0 0 0 1px var(--line)' }}
                >
                  <span
                    className="mt-3 ml-3 block h-1 w-8 rounded-full"
                    style={{ background: t.defaultConfig.primary }}
                  />
                </span>
                <span className="mt-2.5 block text-[12px] font-medium">{t.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="display t-h1">Questions owners actually ask</h2>
        <dl className="mt-8 divide-y divide-[var(--line)]">
          {FAQ.map(([q, a]) => (
            <div key={q} className="py-5">
              <dt className="display text-[16px]">{q}</dt>
              <dd className="mt-2 text-[14.5px] leading-[1.75] text-[var(--ink-soft)]">{a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-wrap gap-3">
          <LinkButton href="/register" size="lg">Set up your menu</LinkButton>
          <LinkButton href="/city/surat" variant="secondary" size="lg">See live examples</LinkButton>
        </div>
      </section>
    </main>
  );
}
