import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
      "@/components": path.resolve(__dirname, "components"),
      "@/lib": path.resolve(__dirname, "lib"),
      "@/i18n": path.resolve(__dirname, "i18n"),
      "@/constants": path.resolve(__dirname, "constants"),
    };
    return config;
  },
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "samsunev.com",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "http",
        hostname: "togaapi-new.test",
      },
      {
        protocol: "https",
        hostname: "togaapi-new.test",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.youtube.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "admin.togahh.com",
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
