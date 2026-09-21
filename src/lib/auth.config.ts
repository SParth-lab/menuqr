import type { NextAuthConfig } from 'next-auth';

/**
 * Edge-safe half of the auth config: no database driver, no bcrypt.
 * `middleware.ts` imports only this, because Mongoose cannot run on the edge runtime.
 */
export const authConfig = {
  pages: { signIn: '/login', error: '/login' },
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 30 },
  trustHost: true,
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role ?? 'RESTAURANT_OWNER';
        token.restaurantId = (user as { restaurantId?: string }).restaurantId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.restaurantId = token.restaurantId as string | undefined;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
