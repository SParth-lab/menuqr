import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { Post } from '@/models';
import { errorResponse, requireAdmin } from '@/lib/rbac';
import { slugify } from '@/lib/slug';
import { POST_STATUSES, POST_TYPES } from '@/types';

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  slug: z.string().min(2).max(90).optional(),
  type: z.enum(POST_TYPES).optional(),
  title: z.string().min(3).max(140).optional(),
  h1: z.string().min(3).max(140).optional(),
  excerpt: z.string().max(300).optional(),
  bodyMd: z.string().max(100_000).optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(170).optional(),
  coverUrl: z.string().optional(),
  status: z.enum(POST_STATUSES).optional(),
});

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await params;

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
    }

    const post = await Post.findById(id);
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const previousSlug = post.slug;
    const data = { ...parsed.data };
    if (data.slug) {
      const next = slugify(data.slug);
      const clash = await Post.findOne({ slug: next, _id: { $ne: id } }).select('_id').lean();
      if (clash) return NextResponse.json({ error: 'That slug is already in use' }, { status: 409 });
      data.slug = next;
    }

    // First publish stamps the date; later edits must not move it.
    if (data.status === 'PUBLISHED' && !post.publishedAt) post.publishedAt = new Date();

    Object.assign(post, data);
    await post.save();

    revalidatePath(`/blog/${previousSlug}`);
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath('/blog');
    return NextResponse.json({ ok: true, post: post.toObject() });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await params;

    const post = await Post.findByIdAndDelete(id);
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
