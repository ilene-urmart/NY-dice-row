/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: "export",
  trailingSlash: true,
  devIndicators: false,
  assetPrefix: ".",
  basePath: "/event/new-year-2026",
};

export default nextConfig;
