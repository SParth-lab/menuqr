import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Restaurant, type IRestaurant } from '@/models';

/**
 * Server-component counterpart of `requireOwnRestaurant`. Redirects rather than
 * throwing, because a page cannot return a 401 body usefully.
 */
export async function getOwnerRestaurant(): Promise<IRestaurant> {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role === 'SUPER_ADMIN') redirect('/admin');

  await connectDB();
  const restaurant = await Restaurant.findOne({ ownerId: session.user.id }).lean();
  if (!restaurant) redirect('/login');

  return restaurant as IRestaurant;
}
