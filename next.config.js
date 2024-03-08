const withSerwist = require("@serwist/next").default({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  reloadOnOnline: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  webpack: (config) => {
    return {
      ...config,
      externals: [...config.externals, "@node-rs/argon2", "@node-rs/bcrypt"],
    };
  },
};

module.exports = withSerwist(nextConfig);
