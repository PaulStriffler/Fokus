import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Fokus",
  assetPrefix: "/Fokus",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
