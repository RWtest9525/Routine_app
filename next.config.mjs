/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  eslint: {
    // Allows production builds to successfully complete even if there are subtle lint warnings
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
