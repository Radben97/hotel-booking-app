import test, { expect } from "playwright/test";

const UI_URL = "http://localhost:5173";

test("Added hotel, page header and add hotel button should be visible", async ({
  page,
}) => {
  await page.goto(UI_URL);
  await page.getByRole("link", { name: "Sign In" }).click();
  await page.locator("[name=email]").fill("e2etest1@gmail.com");
  await page.locator("[name=password]").fill("12345678");
  await page.getByRole("button", { name: "Log In" }).click();
  await page.getByRole("link", { name: "My hotels" }).click();
  await expect(page.getByText("ITC Grand Chola")).toBeVisible();
  await expect(page.locator("p:has-text('A beautiful luxury')")).toBeVisible();
  await expect(page.getByText("Chennai, India")).toBeVisible();
  await expect(page.getByText("₹45000 price per night")).toBeVisible();
  await expect(page.getByText("2 adults, 2 children")).toBeVisible();
  await expect(page.getByText("5 star rating")).toBeVisible();
  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
  await expect(page.getByRole("link", { name: "View More" })).toBeVisible();
  await expect(page.locator("svg")).toHaveCount(5);
});

test("able to edit hotel", async ({ page }) => {
  await page.goto(`${UI_URL}`)
  await page.getByRole("link", { name: "Sign In" }).click();
  await page.locator("[name=email]").fill("e2etest1@gmail.com");
  await page.locator("[name=password]").fill("12345678");
  await page.getByRole("button", { name: "Log In" }).click();
  await page.getByRole("link", { name: "My hotels" }).click();
  await page.getByRole("link", { name: "View More" }).first().click()
  await page.waitForSelector("[name='name']", { state: "attached" })
  await page.locator("[name='name']").fill("ITC Grand Chola UPDATED")
  await page.getByRole("button", { name: "Add" }).click()
  await page.reload()
  await expect(page.locator("[name='name']")).toHaveValue("ITC Grand Chola UPDATED")
  await page.locator("[name='name']").fill("ITC Grand Chola")
  await page.getByRole("button", { name: "Add" }).click()

})
