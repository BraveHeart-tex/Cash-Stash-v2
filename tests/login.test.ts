import { expect, test } from "@playwright/test";

test("Should redirect the user to the login page if they are not logged in", async ({
  page,
}) => {
  await page.goto("/");

  expect(page.url()).toBe("/login");
});

test("Should redirect the user to the dashboard page if they are logged in", async ({
  page,
}) => {
  await page.goto("/login");

  await page.fill("#email", "test@test");
  await page.fill("#password", "testtest");

  await page.click("button:has-text('Log In')");

  expect(page.url()).toBe("/dashboard");
});
