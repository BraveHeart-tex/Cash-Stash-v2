import { test as base } from "@playwright/test";
import prisma from "@/app/libs/prismadb";
import { getUserData } from "./testUtils";

const test = base.extend({
  insertNewUser: async ({}, use) => {
    let userId: string | undefined = undefined;
    await use(async () => {
      const newUser = await prisma.user.create({
        data: getUserData(),
      });
      return newUser;
    });

    if (userId) {
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });
    }
  },
});

const { expect } = test;

test("basic test", async ({ page }) => {
  await page.goto("http://localhost:3001");

  const title = await page.title();

  expect(title).toBe("Cash Stash | Personal Finance");
});
