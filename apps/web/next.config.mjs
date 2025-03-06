/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@rumsan/shadcn-ui'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
