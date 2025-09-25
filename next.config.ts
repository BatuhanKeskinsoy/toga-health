import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: false,
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
    ],
    dangerouslyAllowSVG: true,
  }
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);