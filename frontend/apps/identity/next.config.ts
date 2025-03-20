import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  output: "standalone",
  basePath: "/identify",
  experimental: {
    serverActions: {
      allowedOrigins: ["cdvnetd.ractest.com.au", "cdvnets.ractest.com.au"],
    },
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/register",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
