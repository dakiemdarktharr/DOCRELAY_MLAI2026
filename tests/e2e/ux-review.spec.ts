import { expect, test } from "./fixtures";
import { fillEmployeeIdentity } from "./intake-helpers";

test("missing reviewer request has a persistent error and recovery instead of an endless spinner", async ({ page }) => {
  let queueReads = 0;
  page.on("request", (request) => { if (request.url().includes("/api/support/requests?")) queueReads++; });
  await page.goto("/review?requestId=00000000-0000-4000-8000-000000000000");
  await expect(page.getByRole("main").getByRole("alert")).toContainText("Không tìm thấy");
  await expect(page.getByRole("button", { name: "Thử tải lại yêu cầu" })).toBeVisible();
  await page.getByRole("button", { name: "Thử tải lại yêu cầu" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("Không tìm thấy");
  await expect(page.getByText("Đang tải yêu cầu…", { exact: true })).toHaveCount(0);
  expect(queueReads).toBe(0);
  await page.getByRole("link", { name: "← Danh sách yêu cầu" }).click();
  await expect(page.getByRole("button", { name: "Tải lại danh sách" })).toBeVisible();
});

test("natural VPN and reset journeys preserve safe guidance while risky requests still escalate", async ({ page }) => {
  for (const text of [
    "Sáng nay VPN không kết nối, Wi-Fi vẫn vào web được. Tôi cần kiểm tra từ đâu?",
    "Máy chạy chậm quá, tôi muốn reset máy, bạn hướng dẫn được không?",
    "Mở port 3389 public để vendor vào sửa giúp máy chủ.",
  ]) {
    await page.goto("/send-help");
    await fillEmployeeIdentity(page);
    await page.getByLabel("Mô tả yêu cầu", { exact: true }).fill(text);
    await page.getByRole("button", { name: "Gửi", exact: true }).click();
    await page.getByRole("button", { name: /^(Xác nhận và gửi yêu cầu|Lưu và tiếp tục trò chuyện)$/ }).click();
    await expect(page.getByRole("heading", { name: "Vấn đề bạn đã gửi" })).toBeVisible();
    if (text.includes("reset")) {
      await page.getByRole("combobox", { name: /Cách đặt lại máy/ }).selectOption("restart");
      await page.getByLabel("Thông tin làm rõ", { exact: true }).fill("Tôi chỉ muốn khởi động lại, vẫn giữ nguyên dữ liệu.");
      await page.getByRole("button", { name: "Gửi bổ sung" }).click();
      await expect(page.getByText("Trạng thái:")).toContainText("Đã có hướng dẫn");
    } else {
      await expect(page.getByText("Trạng thái:")).toContainText(text.includes("3389") ? "Đang chờ nhân viên" : "Đã có hướng dẫn");
    }
  }
});
