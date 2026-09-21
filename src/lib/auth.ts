import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { Restaurant, User } from '@/models';
import { authConfig } from '@/lib/auth.config';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        await connectDB();
        const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).select(
          '+passwordHash'
        );
        // Same null for "no such user" and "wrong password" — never leak which.
        if (!user || !user.isActive) return null;

        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;

        const restaurant =
          user.role === 'RESTAURANT_OWNER'
            ? await Restaurant.findOne({ ownerId: user._id }).select('_id').lean()
            : null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          restaurantId: restaurant?._id?.toString(),
        };
      },
    }),
  ],
});
