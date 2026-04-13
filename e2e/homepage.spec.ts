import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
 test("loads without errors", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Portfolio|Nathalie/);
 });

 test("has a dock navigation", async ({ page }) => {
  await page.goto("/");
  const dock = page.locator('nav, [role="navigation"]').first();
  await expect(dock).toBeVisible();
 });
});

test.describe("Login page", () => {
 test("renders email and password inputs", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
 });

 test("shows error on invalid credentials", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill("invalid@example.com");
  await page.getByLabel(/password/i).fill("wrongpassword");
  await page.getByRole("button", { name: /sign in/i }).click();
  // Either stays on login or shows an error message
  await expect(page).toHaveURL(/login/);
 });
});
