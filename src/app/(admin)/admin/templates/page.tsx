import type { Metadata } from 'next';
import { connectDB } from '@/lib/db';
import { Restaurant } from '@/models';
import { listTemplates } from '@/templates/registry';
import { Card, PageHeader } from '@/components/ui';

export const metadata: Metadata = { title: 'Templates', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminTemplates() {
  await connectDB();

  const templates = listTemplates();
  const usage = await Restaurant.aggregate([
    { $group: { _id: '$design.templateKey', n: { $sum: 1 } } },
  ]);
  const usageByKey = new Map(usage.map((u) => [u._id as string, u.n as number]));

  return (
    <>
      <PageHeader
        title="Templates"
        description="The catalog is defined in code at src/templates/registry.ts. Adding one is a single entry there — no migration and no database change."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <Card key={t.key} className="p-0">
            <div className="flex h-24 flex-col justify-end p-3" style={{ background: t.defaultConfig.background }}>
              <span className="h-2 w-12 rounded-full" style={{ background: t.defaultConfig.primary }} />
              <span className="mt-1.5 h-1.5 w-16 rounded-full" style={{ background: t.defaultConfig.secondary }} />
            </div>
            <div className="border-t border-[var(--line)] p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-[var(--ink)]">{t.name}</h2>
                <span className="rounded-full bg-[var(--pane)] px-2 py-0.5 text-[10px] font-semibold text-[var(--ink-soft)]">
                  {usageByKey.get(t.key) ?? 0} in use
                </span>
              </div>
              <p className="mt-1 text-xs text-[var(--muted)]">{t.category}</p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--ink-soft)]">{t.description}</p>
              <p className="mt-2 font-mono text-[10px] text-[var(--faint)]">{t.key}</p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
