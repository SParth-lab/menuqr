import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { Post } from '@/models';
import { errorResponse, requireAdmin } from '@/lib/rbac';
import { slugify } from '@/lib/slug';
import { POST_STATUSES, POST_TYPES } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await requireAdmin();
    await connectDB();
    const sp = new URL(req.url).searchParams;
    const filter: Record<string, unknown> = {};
    if (sp.get('type')) filter.type = sp.get('type');
    if (sp.get('status')) filter.status = sp.get('status');

    const posts = await Post.find(filter).sort({ updatedAt: -1 }).limit(200).lean();
    return NextResponse.json({ posts });
  } catch (err) {
    return errorResponse(err);
  }
}

const schema = z.object({
  slug: z.string().min(2).max(90).optional(),
  type: z.enum(POST_TYPES).default('BLOG'),
  title: z.string().min(3).max(140),
  h1: z.string().min(3).max(140),
  excerpt: z.string().max(300).optional(),
  bodyMd: z.string().max(100_000).default(''),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(170).optional(),
  coverUrl: z.string().optional(),
  status: z.enum(POST_STATUSES).default('DRAFT'),
});

export async function POST(req: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
    }
    const data = parsed.data;
    const slug = slugify(data.slug || data.title);

    if (await Post.findOne({ slug }).select('_id').lean()) {
      return NextResponse.json({ error: 'That slug is already in use' }, { status: 409 });
    }

    const post = await Post.create({
      ...data,
      slug,
      publishedAt: data.status === 'PUBLISHED' ? new Date() : undefined,
    });

    revalidatePath('/blog');
    revalidatePath('/sitemap.xml');
    return NextResponse.json({ ok: true, post: post.toObject() }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
