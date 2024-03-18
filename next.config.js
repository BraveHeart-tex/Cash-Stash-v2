const withSerwist = require("@serwist/next").default({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  webpack: (config) => {
    config.externals.push("@node-rs/argon2");
    config.externals.push("@node-rs/bcrypt");
    return config;
  },
};

module.exports = withSerwist(nextConfig);
