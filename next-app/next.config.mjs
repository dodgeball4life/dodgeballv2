/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['logo.clearbit.com', 'icons.duckduckgo.com'],
  },
};

export default nextConfig;
