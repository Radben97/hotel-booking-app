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

test("should show hotel details", async ({ page }) => {
  await page.getByPlaceholder("Where are you going?").fill("India");
  await page.getByRole("button", { name: "Search" }).click();
  await page.waitForTimeout(1000);
  await page.getByText("Pride Plaza Hotel").click();
  await expect(page.getByRole("button", { name: "Book Now" })).toBeVisible();
  await expect(page).toHaveURL(/detail/);
});

test("should book hotel", async ({ page }) => {
  test.setTimeout(100000)
  await page.getByPlaceholder("Where are you going?").fill("India");
  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check Out").fill(formattedDate);
  await page.getByRole("button", { name: "Search" }).click();
  await page.waitForTimeout(1000);
  await page.getByText("Pride Plaza Hotel").click();
  await page.getByRole("button", { name: "Book Now" }).click();
  await expect(page.getByText("Total Cost: ₹135000")).toBeVisible();
  const rzplFrame = page.frameLocator('iframe[src*="api.razorpay.com"]');
  await page.getByRole("button", { name: "Pay" }).click();
  const cardNumberInput = rzplFrame.getByLabel("Card Number");
  const validityInput = rzplFrame.getByLabel("MM / YY");
  const cvvInput = rzplFrame.getByLabel("CVV");
  const continueButton = rzplFrame.locator('[data-test-id="add-card-cta"]');
  const maybeLaterBtn = rzplFrame.locator(
    'button[name="pay_without_saving_card"]',
  );
  console.log(
  await rzplFrame
    .locator('[data-testid="contactNumber"]')
    .getAttribute("aria-invalid")
);
  const otpInput = rzplFrame.locator('input[name="otp"]');
  const phoneInput = rzplFrame.locator('[data-testid="contactNumber"]');

  await phoneInput.waitFor({ state: "visible", timeout: 10000 });
  await phoneInput.click();
  await phoneInput.pressSequentially("8129698734");
  const continueBtn = rzplFrame.getByTestId("contact-overlay-container")
  .getByRole("button", { name: "Continue" });
await continueBtn.waitFor({ state: "visible", timeout: 10000 });
await continueBtn.click();

  await cardNumberInput.waitFor({ state: "visible" });
  await cardNumberInput.click();
  await cardNumberInput.pressSequentially("6527 6589 0000 1005");

  await validityInput.waitFor({ state: "visible" });
  await validityInput.click();
  await validityInput.pressSequentially("03/41");

  await cvvInput.waitFor({ state: "visible" });
  await cvvInput.click();
  await cvvInput.pressSequentially("123");

  await continueButton.waitFor({ state: "visible" });
  await continueButton.click();
  await maybeLaterBtn.waitFor({ state: "visible", timeout: 5000 });
  await maybeLaterBtn.click();
  await otpInput.waitFor({ state: "visible", timeout: 5000 });
  await otpInput.fill("1234");
  await rzplFrame
  .locator('button[type="submit"]')
  .filter({ hasText: "Continue" }).click();
  await expect(page.getByText("Hotel booked successfully")).toBeVisible({
    timeout: 1000000
  });
});
