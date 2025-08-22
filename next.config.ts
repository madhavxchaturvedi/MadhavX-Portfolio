/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx'],
  transpilePackages: ['next-mdx-remote'],
   eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [];
  },
};

export default nextConfig;
