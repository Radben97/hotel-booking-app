import { test, expect } from "playwright/test";

const UI_URL = "http://localhost:5173";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByRole("link", { name: "Sign In" }).click();
  await page.locator("[name=email]").fill("e2etest1@gmail.com");
  await page.locator("[name=password]").fill("12345678");
  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});

test("Filters should filter out hotels properly", async ({ page }) => {
  await page.getByPlaceholder("Where are you going?").fill("India");
  await page.getByRole("button", { name: "Search" }).click();
  await page.waitForTimeout(1000);
  await expect(page.getByText("1 Hotelsin India")).toBeVisible();
  await page.getByRole("checkbox", { name: "4" }).click();
  await expect(page.getByText("0 Hotelsin India")).toBeVisible();
});
