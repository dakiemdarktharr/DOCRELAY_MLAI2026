import { expect, test } from "@playwright/test";

test("saved Verify loading locks pack and new run until the requested result arrives", async ({ page, request }) => {
  const response = await request.post("/api/support/verify-runs", { data: { pack: "de-a-v3" } });
  expect(response.ok()).toBe(true);
  const { data: run } = await response.json();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route(`**/api/support/verify-runs/${run.id}`, async (route) => {
    await gate;
    await route.fulfill({ json: { success: true, data: run } });
  });
  await page.goto(`/verify?run=${run.id}`);
  await expect(page.getByRole("status")).toContainText("Đang tải kết quả đã lưu");
  await expect(page.getByLabel("Bộ kiểm thử")).toBeDisabled();
  await expect(page.getByRole("button", { name: /Chạy toàn bộ test/ })).toBeDisabled();
  release();
  await expect(page.getByLabel("Bộ kiểm thử")).toBeEnabled();
  await expect(page.getByLabel("Bộ kiểm thử")).toHaveValue("de-a-v3");
  await expect(page.getByRole("button", { name: "Tiếp tục lần kiểm thử" })).toBeEnabled();
  await expect(page.getByRole("link", { name: "Liên kết kết quả đã lưu" })).toHaveAttribute("href", `/verify?run=${run.id}`);
});
