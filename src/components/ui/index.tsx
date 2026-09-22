import clsx from 'clsx';
import Link from 'next/link';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={clsx('border border-[var(--rule)] bg-[var(--paper)] p-5', className)}>
      {children}
    </div>
  );
}

/**
 * Figures are the point of these tiles, so they are set in the display face —
 * the one place Bodoni is allowed to be the loudest thing on screen.
 */
export function StatCard({
  label,
  value,
  hint,
  emphasis = false,
}: {
  label: string;
  value: string | number;
  hint?: string;
  emphasis?: boolean;
}) {
  return (
    <div className="group border border-[var(--rule)] bg-[var(--paper)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#c2b69c] hover:shadow-[0_20px_36px_-24px_rgba(11,10,9,0.45)]">
      <span
        className={clsx(
          'block h-[2px] w-6 transition-all duration-300 group-hover:w-10',
          emphasis ? 'bg-[var(--claret)]' : 'bg-[var(--brass)] group-hover:bg-[var(--claret)]'
        )}
      />
      <div className="display foil mt-4 text-[44px] leading-none tabular-nums">{value}</div>
      <p
        className={clsx(
          'mt-2.5 text-[10px] font-bold uppercase tracking-[0.18em]',
          emphasis ? 'text-[var(--claret)]' : 'text-[var(--muted)]'
        )}
      >
        {label}
      </p>
      {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
    </div>
  );
}

const BUTTON_VARIANTS = {
  primary: 'bg-[var(--claret)] text-[var(--bone)] hover:bg-[var(--ink)]',
  secondary: 'bg-[var(--ink)] text-[var(--bone)] hover:bg-[var(--claret)]',
  outline:
    'border border-[#cdc5b4] bg-transparent text-[var(--ink)] hover:border-[var(--ink)]',
  danger: 'bg-[var(--claret)] text-[var(--bone)] hover:bg-[#61101a]',
  ghost: 'text-[var(--muted)] hover:text-[var(--claret)]',
} as const;

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-1.5 font-semibold transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--claret)]';

const BUTTON_SIZES = {
  sm: 'h-9 px-3.5 text-[11px] tracking-[0.1em] uppercase',
  md: 'h-11 px-6 text-xs tracking-[0.14em] uppercase',
} as const;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof BUTTON_VARIANTS;
  size?: keyof typeof BUTTON_SIZES;
};

export function Button({ variant = 'primary', size = 'md', className, ...rest }: ButtonProps) {
  return (
    <button
      className={clsx(
        BUTTON_BASE,
        BUTTON_SIZES[size],
        BUTTON_VARIANTS[variant],
        'hover:-translate-y-0.5',
        className
      )}
      {...rest}
    />
  );
}

export function LinkButton({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: {
  href: string;
  variant?: keyof typeof BUTTON_VARIANTS;
  size?: keyof typeof BUTTON_SIZES;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, 'href' | 'className'>) {
  return (
    <Link
      href={href}
      className={clsx(
        BUTTON_BASE,
        BUTTON_SIZES[size],
        BUTTON_VARIANTS[variant],
        'hover:-translate-y-0.5',
        className
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1.5 block text-[11px] text-[var(--muted)]">{hint}</span> : null}
    </label>
  );
}

const INPUT_BASE =
  'w-full border border-[var(--rule)] bg-[var(--paper)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[#a49d91] focus:border-[var(--claret)]';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={clsx(INPUT_BASE, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={clsx(INPUT_BASE, 'min-h-24', props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={clsx(INPUT_BASE, props.className)} />;
}

const STATUS_STYLES: Record<string, string> = {
  APPROVED: 'border-[#2e5e36] text-[#2e7d32]',
  PENDING: 'border-[#9a7b33] text-[#9a7b33]',
  REJECTED: 'border-[#a5342c] text-[var(--claret)]',
  SUSPENDED: 'border-[#cdc5b4] text-[var(--muted)]',
  PUBLISHED: 'border-[#2e5e36] text-[#2e7d32]',
  DRAFT: 'border-[#cdc5b4] text-[var(--muted)]',
};

export function StatusBadge({ status }: { status: string }) {
  const live = status === 'APPROVED' || status === 'PUBLISHED';
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em]',
        STATUS_STYLES[status] ?? 'border-[#cdc5b4] text-[var(--muted)]'
      )}
    >
      {live ? <span className="star h-1 w-1 rounded-full bg-[#4e9a51]" /> : null}
      {status.toLowerCase()}
    </span>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="border border-dashed border-[#cdc5b4] px-6 py-14 text-center">
      <h3 className="display text-xl">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[var(--muted)]">{body}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  eyebrow,
  action,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--rule)] pb-5">
      <div>
        {eyebrow ? <p className="eyebrow text-[var(--brass)]">{eyebrow}</p> : null}
        <h1 className="display mt-2 text-[34px] leading-none">{title}</h1>
        {description ? (
          <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-[var(--ink-soft)]">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
