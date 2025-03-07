/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
      allowedOrigins: ["http://localhost:3000", "http://localhost:3001"],
    },
  },
  webpack: (config, { isServer }) => {
    config.externals = [...(config.externals || []), "canvas", "jsdom"];

    // Add fallbacks for node modules that aren't available in the browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    // Only apply chunk optimization for client-side bundles
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for third-party libraries
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk for code shared between pages
            common: {
              name: "common",
              minChunks: 2,
              chunks: "all",
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }

    return config;
  },
  // Increase the timeout for loading chunks
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 60 * 1000, // 1 hour
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
