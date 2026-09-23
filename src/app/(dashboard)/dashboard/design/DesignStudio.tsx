'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Button, Card, Field, Select } from '@/components/ui';
import { getTemplate } from '@/templates/registry';
import { FONT_LABELS, resolveTheme, themeToCssVars } from '@/lib/theme';
import {
  BUTTON_STYLES, CARD_STYLES, FONT_KEYS, LAYOUTS, LOGO_POSITIONS, RADII,
  type ThemeConfig,
} from '@/types';
import type { PublicCategory, PublicRestaurant, TemplateMeta } from '@/templates/types';

type TemplateListItem = TemplateMeta & { defaultConfig: ThemeConfig };

type Design = { templateKey: string; isCustom: boolean; config: Partial<ThemeConfig> };

const COLOR_FIELDS: Array<[keyof ThemeConfig, string]> = [
  ['primary', 'Primary'],
  ['secondary', 'Secondary'],
  ['background', 'Background'],
  ['surface', 'Card surface'],
  ['text', 'Text'],
  ['muted', 'Muted text'],
];

export function DesignStudio({
  templates,
  initialDesign,
  preview,
}: {
  templates: TemplateListItem[];
  initialDesign: Design;
  preview: { restaurant: PublicRestaurant; categories: PublicCategory[]; usingSample: boolean };
}) {
  const router = useRouter();
  const [design, setDesign] = useState<Design>(initialDesign);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const entry = getTemplate(design.templateKey);
  const theme = useMemo(
    () => resolveTheme(entry.defaultConfig, design.config),
    [entry.defaultConfig, design.config]
  );
  const Preview = entry.Component;

  function patch(key: keyof ThemeConfig, value: ThemeConfig[keyof ThemeConfig]) {
    setDesign((prev) => ({
      ...prev,
      isCustom: true,
      config: { ...prev.config, [key]: value },
    }));
    setDirty(true);
    setMessage(null);
  }

  function pickTemplate(key: string) {
    // Switching templates drops overrides: keeping them would carry one palette's
    // colours onto another's layout and look broken.
    setDesign({ templateKey: key, isCustom: false, config: {} });
    setDirty(true);
    setMessage(null);
  }

  async function save() {
    setBusy(true);
    setMessage(null);

    const res = await fetch('/api/design', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(design),
    });
    const body = await res.json().catch(() => ({}));
    setBusy(false);

    if (!res.ok) {
      setMessage(body.error ?? 'Could not save');
      return;
    }
    setDirty(false);
    setMessage('Saved. Your public menu has been updated.');
    router.refresh();
  }

  async function reset() {
    setBusy(true);
    const res = await fetch('/api/design', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateKey: design.templateKey, reset: true }),
    });
    setBusy(false);
    if (!res.ok) return;

    setDesign({ templateKey: design.templateKey, isCustom: false, config: {} });
    setDirty(false);
    setMessage('Reset to the template defaults.');
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        <Card>
          <h2 className="text-sm font-bold text-[var(--ink)]">Templates</h2>
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {templates.map((t) => {
              const active = t.key === design.templateKey;
              return (
                <li key={t.key}>
                  <button
                    type="button"
                    onClick={() => pickTemplate(t.key)}
                    className={clsx(
                      'w-full overflow-hidden rounded-lg border text-left transition',
                      active ? 'border-orange-500 ring-2 ring-orange-200' : 'border-[var(--line)] hover:border-[var(--line-hi)]'
                    )}
                  >
                    <span className="flex h-16 flex-col justify-end p-2" style={{ background: t.defaultConfig.background }}>
                      <span className="block h-1.5 w-8 rounded-full" style={{ background: t.defaultConfig.primary }} />
                      <span className="mt-1 block h-1 w-12 rounded-full" style={{ background: t.defaultConfig.secondary }} />
                    </span>
                    <span className="block border-t border-[var(--line)] p-2">
                      <span className="block text-xs font-semibold text-[var(--ink)]">{t.name}</span>
                      <span className="block text-[10px] text-[var(--muted)]">{t.category}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--ink)]">Customise</h2>
            {design.isCustom ? (
              <span className="rounded-full bg-[var(--pane-hi)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--brass-lift)]">
                Custom
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {COLOR_FIELDS.map(([key, label]) => (
              <label key={key} className="block">
                <span className="mb-1 block text-[11px] font-semibold text-[var(--ink-soft)]">{label}</span>
                <span className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme[key] as string}
                    onChange={(e) => patch(key, e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded border border-[var(--line-hi)]"
                  />
                  <span className="font-mono text-[10px] uppercase text-[var(--muted)]">{theme[key] as string}</span>
                </span>
              </label>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Heading font">
              <Select value={theme.fontHeading} onChange={(e) => patch('fontHeading', e.target.value as ThemeConfig['fontHeading'])}>
                {FONT_KEYS.map((f) => <option key={f} value={f}>{FONT_LABELS[f]}</option>)}
              </Select>
            </Field>
            <Field label="Body font">
              <Select value={theme.fontBody} onChange={(e) => patch('fontBody', e.target.value as ThemeConfig['fontBody'])}>
                {FONT_KEYS.map((f) => <option key={f} value={f}>{FONT_LABELS[f]}</option>)}
              </Select>
            </Field>
            <Field label="Corner radius">
              <Select value={theme.radius} onChange={(e) => patch('radius', e.target.value as ThemeConfig['radius'])}>
                {RADII.map((r) => <option key={r} value={r}>{r}</option>)}
              </Select>
            </Field>
            <Field label="Card style">
              <Select value={theme.cardStyle} onChange={(e) => patch('cardStyle', e.target.value as ThemeConfig['cardStyle'])}>
                {CARD_STYLES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Button style">
              <Select value={theme.buttonStyle} onChange={(e) => patch('buttonStyle', e.target.value as ThemeConfig['buttonStyle'])}>
                {BUTTON_STYLES.map((b) => <option key={b} value={b}>{b}</option>)}
              </Select>
            </Field>
            <Field label="Item layout">
              <Select value={theme.layout} onChange={(e) => patch('layout', e.target.value as ThemeConfig['layout'])}>
                {LAYOUTS.map((l) => <option key={l} value={l}>{l}</option>)}
              </Select>
            </Field>
            <Field label="Logo position">
              <Select value={theme.logoPosition} onChange={(e) => patch('logoPosition', e.target.value as ThemeConfig['logoPosition'])}>
                {LOGO_POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </Select>
            </Field>
          </div>

          <div className="flex flex-wrap gap-4 pt-1">
            <label className="flex items-center gap-2 text-sm text-[var(--ink-soft)]">
              <input type="checkbox" checked={theme.showImages} onChange={(e) => patch('showImages', e.target.checked)} className="h-4 w-4 accent-[#1d4ed8]" />
              Show item photos
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--ink-soft)]">
              <input type="checkbox" checked={theme.showDividers} onChange={(e) => patch('showDividers', e.target.checked)} className="h-4 w-4 accent-[#1d4ed8]" />
              Show dividers
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button onClick={save} disabled={busy || !dirty}>
              {busy ? 'Saving…' : dirty ? 'Save design' : 'Saved'}
            </Button>
            <Button variant="outline" onClick={reset} disabled={busy || !design.isCustom}>
              Reset to template
            </Button>
            {message ? <span className="text-sm text-[var(--ink-soft)]">{message}</span> : null}
          </div>
        </Card>
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <p className="mb-2 text-xs font-semibold text-[var(--ink-soft)]">
          Live preview
          {preview.usingSample ? <span className="font-normal text-[var(--muted)]"> — sample items</span> : null}
        </p>
        <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-[28px] border-[6px] border-[var(--void)] bg-[var(--void)] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
          <div className="max-h-[560px] overflow-y-auto bg-[var(--pane)]" style={themeToCssVars(theme)}>
            <Preview restaurant={preview.restaurant} categories={preview.categories} theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
}
