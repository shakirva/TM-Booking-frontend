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
  // Allow enabling PWA in development by setting NEXT_ENABLE_PWA_DEV=1
  disable: process.env.NEXT_ENABLE_PWA_DEV ? false : process.env.NODE_ENV === 'development',
})(nextConfig);
