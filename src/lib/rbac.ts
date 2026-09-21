import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import type { HydratedDocument } from 'mongoose';
import { Restaurant, type IRestaurant } from '@/models';

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function errorResponse(err: unknown) {
  if (err instanceof HttpError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error('[api]', err);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export async function requireSession() {
  const session = await auth();
  if (!session?.user) throw new HttpError(401, 'Not authenticated');
  return session;
}

export async function requireAdmin() {
  const session = await requireSession();
  if (session.user.role !== 'SUPER_ADMIN') throw new HttpError(403, 'Forbidden');
  return session;
}

/**
 * Resolves the caller's restaurant from the SESSION, never from the request body.
 * Every owner-scoped query filters on the returned `_id`, which is what makes one
 * owner unable to touch another's data even with a forged id in the payload.
 */
export async function requireOwnRestaurant(): Promise<HydratedDocument<IRestaurant>> {
  const session = await requireSession();
  if (session.user.role !== 'RESTAURANT_OWNER') throw new HttpError(403, 'Forbidden');

  await connectDB();
  const restaurant = await Restaurant.findOne({ ownerId: session.user.id });
  if (!restaurant) throw new HttpError(404, 'No restaurant for this account');
  return restaurant;
}
