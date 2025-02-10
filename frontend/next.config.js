/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.rac.com.au'
        }
      ],
    },
    poweredByHeader: false,
    // Uses standalone output for Docker, not for local dev
    output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
  }
  
  module.exports = withBundleAnalyzer(nextConfig)