import { expect, test } from "@playwright/test";

test("generic routes are reachable", async ({ page }) => {
  for (const route of [
    "/",
    "/legacy/workspace",
    "/legacy/verify",
    "/legacy/audit",
  ]) {
    await page.goto(route);
    await expect(page).toHaveTitle(/VNG Support/);
  }
});

test("workspace sends an echo request", async ({ page }) => {
  await page.goto("/legacy/workspace");
  await page.getByLabel("Test input").fill(" hello ");
  await page.getByRole("button", { name: "Process" }).click();
  await expect(page.locator("pre")).toContainText('"text": "hello"');
});
