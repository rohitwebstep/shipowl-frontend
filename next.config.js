/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
  
    images: {
      unoptimized: true,
      domains: ['https://shipping-owl-vd4s.vercel.app'],
    },
  
    reactStrictMode: false,
  
    webpack: (config, { isServer }) => {
      // Prevent server-side errors from DataTables
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
        };
      }
  
      return config;
    },
  };
  
  module.exports = nextConfig;
  