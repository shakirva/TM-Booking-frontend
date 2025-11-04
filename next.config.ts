import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/api/portraits/**',
      },
    ],
  },
  // other config options
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60 * 30 // 30 days
        }
      }
    }
  ],
  buildExcludes: [/middleware-manifest.json$/],
  // Always enable PWA so install prompt can show in development too
  // If you need to turn it off locally, set NEXT_DISABLE_PWA=1
  disable: process.env.NEXT_DISABLE_PWA === '1' ? true : false,
})(nextConfig);
