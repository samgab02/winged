import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Hide the Next.js "N" / route-info badge in local product chrome
  devIndicators: false,
};

export default nextConfig;
