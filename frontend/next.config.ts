import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "dummyjson.com",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
