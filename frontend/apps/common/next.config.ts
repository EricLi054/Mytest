import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  output: "standalone",
  basePath: "",
  assetPrefix: "/common",
  experimental: {
    serverActions: {
      allowedOrigins: ["cdvnetd.ractest.com.au", "cdvnets.ractest.com.au"],
    },
  },
};

export default nextConfig;
