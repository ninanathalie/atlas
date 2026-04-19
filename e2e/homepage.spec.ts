import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
 test("loads without errors", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Atlas|Portfolio|Nathalie/);
 });

 test("has a dock navigation", async ({ page }) => {
  await page.goto("/");
  const dock = page.getByTestId("dock-nav");
  await expect(dock).toBeVisible();
 });
});

test.describe("Login page", () => {
 test("renders OAuth sign-in buttons", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /continue with github/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /continue with google/i })).toBeVisible();
 });

 test("surfaces error message from query param", async ({ page }) => {
  await page.goto("/login?error=AccessDenied");
  await expect(page.getByText(/isn't authorized/i)).toBeVisible();
 });
});
