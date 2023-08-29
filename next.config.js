/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["localhost", "res.cloudinary.com"],
  },
};

module.exports = nextConfig;
