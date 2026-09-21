import { NextResponse } from 'next/server';
import { storeImage, UploadError } from '@/lib/storage';
import { errorResponse, requireSession } from '@/lib/rbac';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    await requireSession();

    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const folder = String(form.get('folder') ?? 'uploads').replace(/[^a-z0-9-]/gi, '') || 'uploads';
    const url = await storeImage(file, folder);

    return NextResponse.json({ ok: true, url });
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return errorResponse(err);
  }
}
