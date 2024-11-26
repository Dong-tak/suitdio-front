// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  env: {
    NEXT_PUBLIC_POST_API_URL: process.env.NEXT_PUBLIC_POST_API_URL,
  },
};

export default nextConfig;
