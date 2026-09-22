import { expect, test } from "./fixtures";

test("missing business artefact shows a structured request and stays out of review", async ({ page }) => {
  await page.goto("/workspace");
  await page.getByLabel("Mô tả yêu cầu", { exact: true }).fill("Tìm nguyên nhân traffic giảm 32% tuần này từ dashboard Analytics.");
  await page.getByRole("button", { name: "Gửi", exact: true }).click();
  const evidence = page.getByRole("region", { name: "Yêu cầu bổ sung dữ liệu" });
  await expect(evidence).toContainText("Dashboard Analytics");
  await expect(evidence).toContainText("chưa có connector");
  await expect(evidence).toContainText("Chưa chuyển review");
  await page.getByRole("button", { name: "Xác nhận và gửi yêu cầu" }).click();
  await expect(page).toHaveURL(/\/requests\//);
  await expect(page.getByText("Trạng thái:")).toContainText("Cần bạn bổ sung thông tin");
  await expect(page.getByRole("button", { name: /Chuyển cho nhân viên/ })).toHaveCount(0);
  await expect(page.getByLabel("Thông tin làm rõ", { exact: true })).toBeVisible();
});
