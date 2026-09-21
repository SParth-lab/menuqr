import clsx from 'clsx';

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export type AdSlotProps = {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  label?: boolean;
};

/**
 * AdSense seam. Renders nothing until NEXT_PUBLIC_ADSENSE_CLIENT is set, so the
 * layout can be positioned now and monetised after approval without touching pages.
 *
 * Deliberately never used on /menu/[slug] — a diner's menu stays ad-free.
 */
export function AdSlot({ slot, format = 'auto', className, label = true }: AdSlotProps) {
  if (!CLIENT || !slot) return null;

  return (
    <aside className={clsx('my-8', className)} aria-label="Advertisement">
      {label ? (
        <p className="mb-1 text-center text-[10px] uppercase tracking-widest text-slate-400">
          Advertisement
        </p>
      ) : null}
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <script dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }} />
    </aside>
  );
}

/** Loaded once in the content-site layout, never in the menu layout. */
export function AdSenseScript() {
  if (!CLIENT) return null;
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
