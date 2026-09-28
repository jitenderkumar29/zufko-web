import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: ["./src/styles"],
    silenceDeprecations: ["import", "global-builtin", "color-functions"],
  },
};

export default nextConfig;