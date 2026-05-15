import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "206.162.244.4",
        port: "3578",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "206.162.244.4",
        // pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // pathname: "/media/**",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
