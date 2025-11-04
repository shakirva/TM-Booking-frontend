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
  // Always enable PWA so install prompt can show in development too
  // If you need to turn it off locally, set NEXT_DISABLE_PWA=1
  disable: process.env.NEXT_DISABLE_PWA === '1' ? true : false,
})(nextConfig);
