import clsx from 'clsx';

/**
 * The mark reads as a QR finder pattern drawn as a blueprint: the concentric
 * square every code carries, set over drafting guides with corner registration
 * ticks. The finder ring survives to 16px; the guides fade out below that size
 * because hairlines at 1px turn to mud.
 */

export type LogoProps = {
  variant?: 'full' | 'mark';
  size?: number;
  /** Flattens to a single colour for print, favicons and the QR table card. */
  mono?: string;
  className?: string;
};

export function Logo({ variant = 'full', size = 32, mono, className }: LogoProps) {
  const id = 'bpGrad';
  const ink = mono ?? `url(#${id})`;

  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="QR4Blueprint"
      className="shrink-0"
    >
      {!mono ? (
        <defs>
          <linearGradient id={id} x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" />
            <stop offset="0.55" stopColor="#1d4ed8" />
            <stop offset="1" stopColor="#0b1f3a" />
          </linearGradient>
        </defs>
      ) : null}

      {/* Four corner brackets: a QR finder pattern drawn the way a technical
          drawing marks its trim. Legible at 16px, where hairline guides are
          sub-pixel and vanish. */}
      <g stroke={ink} strokeWidth="4.5" strokeLinecap="square">
        <path d="M7 17v-4a6 6 0 0 1 6-6h4" />
        <path d="M31 7h4a6 6 0 0 1 6 6v4" />
        <path d="M41 31v4a6 6 0 0 1-6 6h-4" />
        <path d="M17 41h-4a6 6 0 0 1-6-6v-4" />
      </g>

      {/* Core */}
      <rect x="18" y="18" width="12" height="12" rx="3" fill={ink} />
    </svg>
  );

  if (variant === 'mark') return <span className={className}>{mark}</span>;

  return (
    <span className={clsx('inline-flex items-center gap-2 sm:gap-2.5', className)}>
      {mark}
      <span
        className="display leading-none"
        style={{ fontSize: size * 0.58, color: mono ?? 'var(--ink)', fontWeight: 700 }}
      >
        QR<span style={{ color: mono ?? 'var(--claret)' }}>4</span>Blueprint
      </span>
    </span>
  );
}
