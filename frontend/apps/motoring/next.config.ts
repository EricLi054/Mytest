import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  output: "standalone",
  basePath: "/motoring",
  experimental: {
    serverActions: {
      allowedOrigins: ["ractest.com.au", "*.ractest.com.au", "rac.com.au", "*.rac.com.au"],
    },
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/roadside-assistance/update-your-vehicle/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
