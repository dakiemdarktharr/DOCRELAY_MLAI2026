import { expect, freshTest as test } from "./fixtures";

test("structured sender tour points to the fields before the description", async ({ page }) => {
  await page.goto("/send-help");
  await page.getByRole("button", { name: "Đã hiểu", exact: true }).click();
  const tip = page.getByRole("region", { name: "Hướng dẫn thao tác" });
  await page.getByRole("button", { name: "Chọn theo danh mục", exact: true }).click();
  await page.getByLabel("Nhóm hỗ trợ", { exact: true }).selectOption("DATABASE");
  await expect(tip).toContainText("3. Chọn nhu cầu");
  await page.getByLabel("Nhu cầu cụ thể", { exact: true }).selectOption("DATABASE_READ_ACCESS");
  await expect(tip).toContainText("Điền thông tin theo danh mục");
  await expect(page.locator('[data-guide="sender-fields"]')).toBeVisible();
  await tip.getByRole("button", { name: "Tiếp theo", exact: true }).click();
  await expect(tip).toContainText("4. Mô tả tình huống");
  await page.getByLabel("Mô tả yêu cầu", { exact: true }).fill("Xin quyền chỉ đọc dữ liệu demo");
  await expect(tip).toContainText("5. Gửi để xem phản hồi");
});

test("first visit opens a bounded scrollable guide above the role picker", async ({ page }, info) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog", { name: "Bắt đầu cùng VNG Support" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS("border-top-color", "rgb(240, 90, 34)");
  await expect(dialog.getByRole("button", { name: "Đã hiểu", exact: true })).toBeVisible();
  await expect(dialog.getByRole("img")).toHaveCount(3);
  const scroll = page.getByLabel("Nội dung hướng dẫn sử dụng", { exact: true });
  expect(await scroll.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
  await scroll.evaluate((element) => { element.scrollTop = element.scrollHeight; });
  await expect(dialog.getByRole("button", { name: "Đã hiểu", exact: true })).toBeInViewport();
  expect(await page.evaluate(() => scrollY)).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await dialog.getByRole("button", { name: "Đã hiểu", exact: true }).focus();
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
  await scroll.evaluate((element) => { element.scrollTop = 0; });
  await page.screenshot({ path: `artifacts/judge-intro-${info.project.name}.png` });
  await dialog.getByRole("button", { name: "Đã hiểu", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("link", { name: "Tôi cần hỗ trợ", exact: true })).toBeVisible();
  await page.reload();
  await expect(dialog).not.toBeVisible();
});

test("sender follows actual controls, sees feedback and does not repeat after returning home", async ({ page }, info) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Đã hiểu", exact: true }).click();
  await page.getByRole("link", { name: "Tôi cần hỗ trợ", exact: true }).click();
  const tip = page.getByRole("region", { name: "Hướng dẫn thao tác" });
  await expect(tip).toContainText("1. Chọn cách gửi");
  await page.getByRole("button", { name: "Mô tả vấn đề", exact: true }).click();
  await expect(tip).toContainText("2. Chọn nhóm hỗ trợ");
  await page.getByLabel("Nhóm hỗ trợ", { exact: true }).selectOption("NETWORK_VPN");
  await expect(tip).toContainText("4. Mô tả tình huống");
  await page.getByLabel("Mô tả yêu cầu", { exact: true }).fill("VPN không kết nối");
  await expect(tip).toContainText("5. Gửi để xem phản hồi");
  await expect(page.getByLabel("Mô tả yêu cầu", { exact: true })).toBeFocused();
  await page.screenshot({ path: `artifacts/judge-sender-${info.project.name}.png` });
  await page.getByRole("button", { name: "Gửi", exact: true }).click();
  await expect(tip).toContainText("Kiểm tra phản hồi");
  await tip.getByRole("button", { name: "Tiếp theo" }).click();
  await expect(tip).toContainText("Xác nhận hoặc lưu hội thoại");
  await page.getByRole("button", { name: "Xác nhận và gửi yêu cầu" }).click();
  await expect(tip).toContainText("Theo dõi kết quả");
  await tip.getByRole("button", { name: "Tiếp theo" }).click();
  await expect(tip).toContainText("Thử các lựa chọn hỗ trợ");
  await page.getByRole("button", { name: "C. Giải thích bước này" }).click();
  await expect(tip).toContainText("Tiếp tục hỏi hoặc bổ sung");
  await expect(page.getByRole("heading", { name: "Giải thích bước 1" })).toBeVisible();
  await page.getByLabel("Hỏi tiếp", { exact: true }).fill("VPN vẫn không kết nối");
  await expect(tip).toContainText("Gửi nội dung tiếp theo");
  await page.getByRole("button", { name: "Gửi câu hỏi", exact: true }).click();
  await expect(tip).toContainText("Xem lại toàn bộ quá trình");
  await page.getByText("Lịch sử yêu cầu và hướng dẫn", { exact: true }).click();
  await expect(tip).not.toBeVisible();
  await page.getByRole("link", { name: "VNG Support", exact: true }).click();
  await page.getByRole("link", { name: "Tôi cần hỗ trợ", exact: true }).click();
  await expect(tip).not.toBeVisible();
  await page.reload();
  await expect(tip).not.toBeVisible();
});

test("reviewer tour is independent and never executes a decision automatically", async ({ page, request }, info) => {
  const response = await request.post("/api/support/requests", { data: {
    rawText: "Mở port 3389 public", mode: "freeform", serviceGroup: "OTHER", fields: {}, confirmed: true, idempotencyKey: crypto.randomUUID(),
  } });
  expect(response.ok()).toBe(true);
  const { data: row } = await response.json();
  await page.goto("/");
  await page.getByRole("button", { name: "Đã hiểu", exact: true }).click();
  await page.getByRole("link", { name: "Tôi cần hỗ trợ", exact: true }).click();
  const tip = page.getByRole("region", { name: "Hướng dẫn thao tác" });
  await expect(tip).toBeVisible();
  await page.getByRole("link", { name: "VNG Support", exact: true }).click();
  await page.getByRole("link", { name: "Tôi cần hỗ trợ", exact: true }).click();
  await expect(tip).not.toBeVisible();
  await page.getByRole("link", { name: "VNG Support", exact: true }).click();
  await page.getByRole("link", { name: "Dành cho nhân viên", exact: true }).click();
  await expect(tip).toContainText("1. Tìm yêu cầu cần xử lý");
  await page.getByLabel("Hiển thị", { exact: true }).selectOption("all");
  await expect(tip).toContainText("2. Mở một hồ sơ");
  await page.locator(`a[href="/review?requestId=${row.id}"]`).click();
  await expect(tip).toContainText("3. Đọc bằng chứng trước");
  await tip.getByRole("button", { name: "Tiếp theo" }).click();
  await page.getByLabel("Lý do (bắt buộc cho mọi quyết định của reviewer)").fill("Dừng yêu cầu demo để kiểm tra nhật ký.");
  await expect(tip).toContainText("5. Chọn quyết định phù hợp");
  const unchanged = (await (await request.get(`/api/support/requests/${row.id}`)).json()).data;
  expect(unchanged.status).toBe("ESCALATED");
  await page.screenshot({ path: `artifacts/judge-reviewer-${info.project.name}.png` });
  await page.getByRole("button", { name: "Dừng xử lý", exact: true }).click();
  await expect(tip).toContainText("6. Kiểm tra nhật ký");
  await expect(page.locator("#request-audit")).toContainText("Dừng yêu cầu demo để kiểm tra nhật ký.");
  await tip.getByRole("button", { name: "Hoàn tất hướng dẫn" }).click();
  await page.getByRole("link", { name: "VNG Support", exact: true }).click();
  await page.getByRole("link", { name: "Dành cho nhân viên", exact: true }).click();
  await expect(tip).not.toBeVisible();
});

test("a fresh tab in the same browser gets the introduction again", async ({ page, context }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Đã hiểu", exact: true }).click();
  await page.close();
  const fresh = await context.newPage();
  await fresh.goto("/");
  await expect(fresh.getByRole("dialog", { name: "Bắt đầu cùng VNG Support" })).toBeVisible();
  await fresh.getByRole("button", { name: "Đã hiểu", exact: true }).click();
  await fresh.getByRole("link", { name: "Tôi cần hỗ trợ", exact: true }).click();
  await expect(fresh.getByRole("region", { name: "Hướng dẫn thao tác" })).toContainText("1. Chọn cách gửi");
});
