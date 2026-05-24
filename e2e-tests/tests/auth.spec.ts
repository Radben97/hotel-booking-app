import { test, expect } from '@playwright/test';

const UI_URL = "http://localhost:5173"

test('should allow the user to sign in', async ({ page }) => {
  await page.goto(UI_URL)
  await page.getByRole("link", { name: "Sign In" }).click()
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible()
  await page.locator("[name=email]").fill("e2etest1@gmail.com")
  await page.locator("[name=password]").fill("12345678")
  await page.getByRole("button", { name: "Log In" }).click()
  await expect(page.getByText("Logged In")).toBeVisible()
  await expect(page.getByRole("link",{name: "My Bookings"})).toBeVisible()
  await expect(page.getByRole("link",{name: "My Bookings"})).toBeVisible()
  await expect(page.getByRole("button",{name: "Sign Out"})).toBeVisible()
})
const testEmail = `e2etest${Math.floor(Math.random()*100000)}@gmail.com`
test("should allow user to register", async ({page}) => {
  await page.goto(UI_URL)
  await page.getByRole("link", { name: "Sign In" }).click()
  await page.getByRole("link", { name: "Create an account here" }).click()
  await expect(page.getByRole("heading", { name: "Create an account" })).toBeVisible()
  await page.locator("[name=firstname]").fill("e2e")
  await page.locator("[name=lastname]").fill("test2")
  await page.locator("[name=email]").fill(testEmail)
  await page.locator("[name=password]").fill("12345678")
  await page.locator("[name=confirmPassword]").fill("12345678")
  await page.getByRole("button", { name: "Create Account" }).click()
  await expect(page.getByText("Registration Success!")).toBeVisible()
  await expect(page.getByRole("link",{name: "My Bookings"})).toBeVisible()
  await expect(page.getByRole("link",{name: "My Bookings"})).toBeVisible()
  await expect(page.getByRole("button",{name: "Sign Out"})).toBeVisible()
  
})