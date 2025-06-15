import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'r2.vibe-cooking.furari.co',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'r2.dev.vibe-cooking.furari.co',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
