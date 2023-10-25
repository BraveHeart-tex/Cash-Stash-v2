import { test as base } from "@playwright/test";
import prisma from "../app/libs/prismadb";
import { getUserData } from "./testUtils";
import { faker } from "@faker-js/faker";

const test = base.extend({
  createUser: async ({}, use) => {
    let userId: string | undefined = undefined;
    await use(async () => {
      const newUser = await prisma.user.create({
        data: {
          name: faker.person.firstName(),
          email: faker.internet.email(),
          hashedPassword: faker.internet.password(),
        },
      });
      userId = newUser.id;
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

test("redirects to the login page if the user is not authenticated", async ({
  page,
  baseURL,
  context,
}) => {
  await context.clearCookies();
  await page.goto(baseURL!);

  expect(page.url()).toBe(`${baseURL}/login`);

  await page.waitForSelector("[data-testid='login-form']");

  const loginForm = page.getByTestId("login-form");

  expect(loginForm).toBeTruthy();

  const emailField = page.getByTestId("email");
  expect(emailField).toBeTruthy();

  const passwordField = page.getByTestId("password");
  expect(passwordField).toBeTruthy();
});
