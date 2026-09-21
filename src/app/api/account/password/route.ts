import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { User } from '@/models';
import { errorResponse, requireSession } from '@/lib/rbac';

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export async function POST(req: Request) {
  try {
    const session = await requireSession();
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(session.user.id).select('+passwordHash');
    if (!user) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

    // Re-verify the current password: a stolen session must not be enough to
    // change the credential that would lock the real owner out.
    const ok = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
    if (!ok) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 403 });

    user.passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
    await user.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
