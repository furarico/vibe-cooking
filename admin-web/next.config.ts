import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'r2.vibe-cooking.app',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'dev.r2.vibe-cooking.app',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
