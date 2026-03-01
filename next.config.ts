import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@neplex/vectorizer", "shiki"],
};

export default nextConfig;
