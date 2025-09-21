import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Enables static exports
  distDir: "dist/landing", // Output directory for the landing page build
  basePath: "/gitcdn-landing", // Base path for GitHub Pages
  assetPrefix: "/gitcdn-landing/", // Asset prefix for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  // Only include the landing page route
  experimental: {
    outputFileTracingExcludes: {
      "*": [
        "src/app/page.tsx", // Exclude dashboard
        "src/app/settings/page.tsx", // Exclude settings
        "src/app/api/**", // Exclude API routes
      ],
    },
  },
};

export default nextConfig;
