import { test as base } from "@playwright/test";
import { signToken } from "../lib/session";
import { getUserData } from "./testUtils";

const test = base.extend({});

const { expect } = test;

test("renders the create account modal after create button click", async ({
  page,
  baseURL,
  context,
}) => {
  const jwt = await signToken(getUserData());

  await context.clearCookies();

  await context.addCookies([
    {
      name: "token",
      value: jwt,
      url: baseURL,
    },
  ]);

  await page.goto(baseURL!);
  expect(page.url()).toBe(`${baseURL}/`);

  // wait for the page to load
  await page.waitForSelector("[data-testid='create-account-button']");

  const createAccountButton = page.getByTestId("create-account-button");

  expect(createAccountButton).toBeTruthy();

  await createAccountButton?.click();

  await page.waitForSelector("[data-testid='create-user-account-form']");

  const createAccountForm = page.getByTestId("create-user-account-form");

  expect(createAccountForm).toBeTruthy();
});
