import clsx from 'clsx';

/**
 * The mark is a QR finder pattern — the concentric square that sits in three
 * corners of every QR code. It is the most recognisable primitive in the format,
 * it is one shape, and it survives to 16px, which a literal scannable code does
 * not. The detached module at the lower right is the timing dot, so the mark
 * reads as a fragment of a real code rather than a generic square.
 */

export type LogoProps = {
  variant?: 'full' | 'mark';
  size?: number;
  /** Flattens to a single colour for print, favicons and the QR table card. */
  mono?: string;
  className?: string;
};

export function Logo({ variant = 'full', size = 32, mono, className }: LogoProps) {
  const id = mono ? 'brandMono' : 'brandFoil';

  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="QR4Menu"
      className="shrink-0"
    >
      {!mono ? (
        <defs>
          <linearGradient id={id} x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e8ce8a" />
            <stop offset="0.5" stopColor="#b08a3c" />
            <stop offset="1" stopColor="#8c6b26" />
          </linearGradient>
        </defs>
      ) : null}

      {/* Outer ring of the finder pattern */}
      <path
        d="M6 13a7 7 0 0 1 7-7h18a7 7 0 0 1 7 7v18a7 7 0 0 1-7 7H13a7 7 0 0 1-7-7V13Z"
        stroke={mono ?? `url(#${id})`}
        strokeWidth="5"
      />
      {/* Solid core */}
      <rect x="17" y="17" width="10" height="10" rx="2.5" fill={mono ?? `url(#${id})`} />
      {/* Timing module, detached — the tell that this is part of a code */}
      <rect x="37" y="37" width="6" height="6" rx="1.6" fill={mono ?? `url(#${id})`} />
    </svg>
  );

  if (variant === 'mark') return <span className={className}>{mark}</span>;

  return (
    <span className={clsx('inline-flex items-center gap-2.5', className)}>
      {mark}
      <span
        className="display leading-none"
        style={{ fontSize: size * 0.68, color: mono ?? 'var(--ink)' }}
      >
        QR<span style={{ color: mono ?? 'var(--brass)' }}>4</span>Menu
      </span>
    </span>
  );
}
