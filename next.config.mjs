// biome-ignore lint/correctness/noNodejsModules: This is needed in this context
import { fileURLToPath } from "node:url";
import createJiti from "jiti";
import createNextIntlPlugin from "next-intl/plugin";
import serwist from "@serwist/next";

const jiti = createJiti(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin();

jiti("./env");

const withSerwist = serwist({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@node-rs/argon2"],
  },
  webpack: (config) => {
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
  },
};

export default withSerwist(withNextIntl(nextConfig));
