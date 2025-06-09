import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: false,
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'samsunev.com',
      },
    ],
    dangerouslyAllowSVG: true
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
