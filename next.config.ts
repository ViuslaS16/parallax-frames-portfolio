import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        // Cloudflare R2 public dev subdomain (e.g. pub-xxx.r2.dev)
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        // Cloudflare R2 private/custom domain (r2.cloudflarestorage.com)
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
    ],
  },
};

export default nextConfig;
