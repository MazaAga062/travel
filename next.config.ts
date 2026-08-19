import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/travel",
  assetPrefix: "/travel/",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
