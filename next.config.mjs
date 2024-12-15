// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  images: {
    domains: ['mileque-bag.s3.amazonaws.com'],
    // 또는 더 안전한 방법으로:
    remotePatterns: [
      {
        // protocol: 'https',
        hostname: 'mileque-bag.s3.amazonaws.com',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_POST_API_URL: process.env.NEXT_PUBLIC_POST_API_URL,
  },
};

export default nextConfig;
