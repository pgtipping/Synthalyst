/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Other experimental features can go here
    optimizeCss: true, // Enable CSS optimization
    optimizePackageImports: ["@/components", "@/lib", "@/hooks"], // Optimize package imports
  },
  // Enable source maps in production
  productionBrowserSourceMaps: true,
  webpack: (config, { isServer, webpack }) => {
    config.externals = [...(config.externals || []), "canvas", "jsdom"];

    // Add fallbacks for node modules that aren't available in the browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: "crypto-browserify",
        stream: "stream-browserify",
        buffer: "buffer",
        util: "util",
        http: "stream-http",
        https: "https-browserify",
        os: "os-browserify/browser",
        zlib: "browserify-zlib",
      };

      // Add buffer and process polyfills
      config.plugins = [
        ...(config.plugins || []),
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
        }),
        new webpack.ProvidePlugin({
          process: "process/browser",
        }),
      ];

      // Disable minification to fix SHA224 error with react-pdf
      if (config.optimization) {
        config.optimization.minimize = false;
      }
    }

    // Only apply chunk optimization for client-side bundles
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true, // Enable minification for production
        splitChunks: {
          chunks: "all",
          maxInitialRequests: 25,
          minSize: 20000,
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
            // Separate React and related packages
            react: {
              name: "react",
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              chunks: "all",
              priority: 30,
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
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has TypeScript errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "images.unsplash.com",
      "source.unsplash.com",
      "picsum.photos",
      "placehold.co",
      "res.cloudinary.com",
      "synthalyst.com",
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  serverExternalPackages: ["@prisma/client", "bcrypt"],
  // Skip database-dependent pages during static generation
  staticPageGenerationTimeout: 120,
  output: "standalone",
};

export default nextConfig;
