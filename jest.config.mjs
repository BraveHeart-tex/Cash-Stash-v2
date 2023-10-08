import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const clientTestConfig = {
  displayName: "client",
  testMatch: ["<rootDir>/__tests__/client/**/*.test.ts?(x)"],
  testEnvironment: "jest-environment-jsdom",
};

const serverTestConfig = {
  displayName: "server",
  testMatch: ["<rootDir>/__tests__/server/**/*.test.ts?(x)"],
  testEnvironment: "@quramy/jest-prisma-node/environment",
  setupFilesAfterEnv: ["./__tests__/server/setup-prisma.js"],
};

const config = {
  projects: [
    await createJestConfig(clientTestConfig)(),
    await createJestConfig(serverTestConfig)(),
  ],
};

export default config;
