import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  // types are checked by `tsc --noEmit` in `pnpm build` (TypeScript 7, which Next's own check doesn't drive)
  typescript: { ignoreBuildErrors: true },
  // the pictures are made responsive before the build (scripts/images.mjs, <Img>), not by next/image
  images: { unoptimized: true },
  poweredByHeader: false,
  experimental: { globalNotFound: true },
  async headers() {
    return [{ source: '/assets/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] }];
  }
};

export default config;
