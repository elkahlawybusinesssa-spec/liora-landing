/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.easy-orders.net",
      },
      {
        protocol: "https",
        hostname: "ghckapztoiimrmxtadpx.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
