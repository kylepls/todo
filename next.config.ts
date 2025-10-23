import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ["pino", "typeorm", "better-sqlite3"],
  experimental: {
    serverMinification: false
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.optimization.minimize = false;
    }
    return config;
  }
};

export default nextConfig;
