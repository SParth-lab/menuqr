import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  if (pathname.startsWith('/admin')) {
    if (!user) return NextResponse.redirect(new URL('/login', req.nextUrl));
    if (user.role !== 'SUPER_ADMIN') return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    return NextResponse.next();
  }

  if (pathname.startsWith('/dashboard')) {
    if (!user) return NextResponse.redirect(new URL('/login', req.nextUrl));
    // A super admin has no restaurant of their own; send them to their own console.
    if (user.role === 'SUPER_ADMIN') return NextResponse.redirect(new URL('/admin', req.nextUrl));
    return NextResponse.next();
  }

  if ((pathname === '/login' || pathname === '/register') && user) {
    const dest = user.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(dest, req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
};
