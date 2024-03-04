/* eslint-disable no-unused-vars */
import { PrismaClient } from "@prisma/client";

declare global {
  var client: PrismaClient | undefined;
}

const prisma = globalThis.client || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  globalThis.client = prisma;
}

export default prisma;
