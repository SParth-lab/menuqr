import clsx from 'clsx';
import Link from 'next/link';

/* The shell has one ink colour and one surface family. Everything here resolves
   to the tokens and the .btn / .inp classes in globals.css, so a button in the
   dashboard and a button on the landing page are the same object. */

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={clsx('glass rounded-2xl p-5', className)}>
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}

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
    <div className="glass glass-lift group rounded-2xl p-5">
      <div className="relative z-[2]">
        <span
          className={clsx(
            'block h-[2px] w-5 transition-all duration-300 group-hover:w-9',
            emphasis ? 'bg-[var(--claret-lift)]' : 'bg-[var(--brass)]'
          )}
        />
        <div className="display foil mt-3.5 text-[28px] leading-none tabular-nums">{value}</div>
        <p
          className={clsx(
            'mt-2 text-[10px] font-bold uppercase tracking-[0.16em]',
            emphasis ? 'text-[var(--claret-lift)]' : 'text-[var(--muted)]'
          )}
        >
          {label}
        </p>
        {hint ? <p className="mt-1 text-[11px] text-[var(--faint)]">{hint}</p> : null}
      </div>
    </div>
  );
}

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
} as const;

const SIZES = { sm: 'btn-sm', md: '', lg: 'btn-lg' } as const;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
};

export function Button({ variant = 'primary', size = 'md', className, ...rest }: ButtonProps) {
  return <button className={clsx('btn', VARIANTS[variant], SIZES[size], className)} {...rest} />;
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
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, 'href' | 'className'>) {
  return (
    <Link href={href} className={clsx('btn', VARIANTS[variant], SIZES[size], className)} {...rest}>
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
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1.5 block text-[11px] text-[var(--faint)]">{hint}</span> : null}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={clsx('inp', props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={clsx('inp min-h-24', props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={clsx('inp', props.className)} />;
}

const STATUS_STYLES: Record<string, string> = {
  APPROVED: 'border-[rgba(6,118,71,0.4)] text-[var(--ok)]',
  PUBLISHED: 'border-[rgba(6,118,71,0.4)] text-[var(--ok)]',
  PENDING: 'border-[rgba(37,99,235,0.45)] text-[var(--brass-lift)]',
  REJECTED: 'border-[rgba(180,35,24,0.4)] text-[var(--bad)]',
  SUSPENDED: 'border-[var(--line)] text-[var(--muted)]',
  DRAFT: 'border-[var(--line)] text-[var(--muted)]',
};

export function StatusBadge({ status }: { status: string }) {
  const live = status === 'APPROVED' || status === 'PUBLISHED';
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em]',
        STATUS_STYLES[status] ?? 'border-[var(--line)] text-[var(--muted)]'
      )}
    >
      {live ? <span className="star h-1 w-1 rounded-full bg-[var(--ok)]" /> : null}
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
    <div className="rounded-2xl border border-dashed border-[var(--line)] px-6 py-12 text-center">
      <h3 className="display text-lg">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-[var(--muted)]">{body}</p>
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
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-4">
      <div>
        {eyebrow ? <p className="eyebrow text-[var(--brass)]">{eyebrow}</p> : null}
        <h1 className="display t-h1 mt-2">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-[var(--ink-soft)]">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
