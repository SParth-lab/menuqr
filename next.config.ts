import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Another lockfile sits above this directory; pin the root so tracing is correct.
  outputFileTracingRoot: __dirname,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.r2.dev' },
      { protocol: 'https', hostname: '**.cloudflarestorage.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  poweredByHeader: false,
  compress: true,
  serverExternalPackages: ['mongoose', 'bcryptjs'],
};

export default nextConfig;
