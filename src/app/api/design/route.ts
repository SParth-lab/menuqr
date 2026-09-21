import { NextResponse } from 'next/server';
import { z } from 'zod';
import { errorResponse, requireOwnRestaurant } from '@/lib/rbac';
import { revalidateMenu } from '@/lib/revalidate';
import { getTemplate, templates } from '@/templates/registry';
import { resolveTheme } from '@/lib/theme';
import {
  BUTTON_STYLES, CARD_STYLES, FONT_KEYS, LAYOUTS, LOGO_POSITIONS, RADII,
} from '@/types';

export async function GET() {
  try {
    const r = await requireOwnRestaurant();
    const template = getTemplate(r.design?.templateKey);
    return NextResponse.json({
      design: r.design,
      resolved: resolveTheme(template.defaultConfig, r.design?.config),
    });
  } catch (err) {
    return errorResponse(err);
  }
}

const hex = z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, 'Colors must be hex values');

const configSchema = z.object({
  primary: hex.optional(),
  secondary: hex.optional(),
  background: hex.optional(),
  surface: hex.optional(),
  text: hex.optional(),
  muted: hex.optional(),
  fontHeading: z.enum(FONT_KEYS).optional(),
  fontBody: z.enum(FONT_KEYS).optional(),
  radius: z.enum(RADII).optional(),
  cardStyle: z.enum(CARD_STYLES).optional(),
  buttonStyle: z.enum(BUTTON_STYLES).optional(),
  layout: z.enum(LAYOUTS).optional(),
  logoPosition: z.enum(LOGO_POSITIONS).optional(),
  showImages: z.boolean().optional(),
  showDividers: z.boolean().optional(),
});

const putSchema = z.object({
  templateKey: z.string().optional(),
  config: configSchema.optional(),
  /** true when the owner has diverged from the template's palette. */
  isCustom: z.boolean().optional(),
  /** Discards overrides and returns to the template's own defaults. */
  reset: z.boolean().optional(),
});

export async function PUT(req: Request) {
  try {
    const r = await requireOwnRestaurant();
    const parsed = putSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
    }
    const { templateKey, config, isCustom, reset } = parsed.data;

    if (templateKey && !templates[templateKey]) {
      return NextResponse.json({ error: 'Unknown template' }, { status: 400 });
    }

    const next = {
      templateKey: templateKey ?? r.design?.templateKey ?? 'modern',
      isCustom: reset ? false : (isCustom ?? r.design?.isCustom ?? false),
      // Switching template discards stale overrides; editing merges onto them.
      config: reset ? {} : templateKey ? (config ?? {}) : { ...(r.design?.config ?? {}), ...(config ?? {}) },
    };

    r.set('design', next);
    r.markModified('design');
    await r.save();

    revalidateMenu(r.slug);

    const template = getTemplate(next.templateKey);
    return NextResponse.json({
      ok: true,
      design: next,
      resolved: resolveTheme(template.defaultConfig, next.config),
    });
  } catch (err) {
    return errorResponse(err);
  }
}
