import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  const response = await request.get("/api/support/health");
  expect(response.ok()).toBe(true);
  const body = await response.json();
  expect(body.data.app).toBe("MLAI_SUPPORT_REFEREE_V3");
  expect(body.data.provider).toBe("mock");
});
async function submit(page: Page, text: string) {
  await page.goto("/workspace");
  await page.getByLabel("Mô tả yêu cầu", { exact: true }).fill(text);
  await page.getByRole("button", { name: "Xem hệ thống đã hiểu gì" }).click();
  await page.getByRole("button", { name: "Xác nhận và gửi yêu cầu" }).click();
  await expect(page).toHaveURL(/\/requests\/[a-f0-9-]+$/);
  await expect(page.getByText("Trạng thái:")).toBeVisible();
}
test("public entry buttons open both workspaces without authentication", async ({
  page,
}, info) => {
  await page.goto("/");
  await page.getByRole("link", { name: "I need help", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "I Need Help" }),
  ).toBeVisible();
  await page.goto("/");
  await page.getByRole("link", { name: "admin", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Human Reviewer" }),
  ).toBeVisible();
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `artifacts/home-${info.project.name}.png`,
    fullPage: true,
  });
});
test("shutdown guidance resolves through employee feedback", async ({
  page,
}) => {
  await submit(page, "Tôi tắt máy tính lúc về được không?");
  await expect(page.getByText("Trạng thái:")).toContainText("AUTO_APPROVED");
  await expect(
    page.getByText("Lưu tài liệu đang làm và đóng các ứng dụng sau khi lưu."),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "A. Tôi đã làm được", exact: true })
    .click();
  await expect(page.getByText("Trạng thái:")).toContainText("COMPLETED");
});
test("reset asks clarification and then guides restart without a device ID", async ({
  page,
}) => {
  await submit(page, "Làm sao để reset máy?");
  await expect(page.getByText("Trạng thái:")).toContainText(
    "NEEDS_INFORMATION",
  );
  await page
    .getByLabel("Thông tin làm rõ")
    .fill("Tôi muốn restart laptop, không factory reset");
  await page.getByRole("button", { name: "Gửi bổ sung" }).click();
  await expect(page.getByText("Trạng thái:")).toContainText("AUTO_APPROVED");
});
test("medium assistance passes to admin with history intact", async ({
  page,
}, info) => {
  await submit(page, "VPN không kết nối");
  await expect(
    page.getByText("Model mô phỏng (mock)", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "C. Tôi không hiểu bước này", exact: true })
    .click();
  await expect(page.getByText("Trạng thái:")).toContainText("ESCALATED");
  await expect(
    page.getByText(
      "Mở ứng dụng VPN chính thức đã được IT cung cấp và kiểm tra tên profile công ty.",
    ),
  ).toBeVisible();
  await page.screenshot({
    path: `artifacts/assistance-${info.project.name}.png`,
    fullPage: true,
  });
});
test("structured guidance matches freeform; intake conflicts escalate", async ({
  page,
}) => {
  await page.goto("/workspace");
  await page
    .getByLabel("Nhóm hỗ trợ", { exact: true })
    .selectOption("DEVICE_BOOT");
  await page
    .getByRole("button", { name: "Structured · Chọn mục", exact: true })
    .click();
  await page
    .getByLabel("Nhu cầu cụ thể", { exact: true })
    .selectOption("DEVICE_RESTART_GUIDANCE");
  await page.getByRole("button", { name: "Xem hệ thống đã hiểu gì" }).click();
  await expect(page.getByText("AUTO_APPROVE", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Quay lại sửa" }).click();
  await page
    .getByLabel("Mô tả yêu cầu", { exact: true })
    .fill("Grant write access to production DB");
  await page.getByRole("button", { name: "Xem hệ thống đã hiểu gì" }).click();
  await expect(page.getByText("ESCALATE", { exact: true })).toBeVisible();
});
test("reviewer rejection requires a reason and records audit", async ({
  page,
  request,
}, info) => {
  const text = `Grant production admin - demo ${crypto.randomUUID().slice(0, 8)}`;
  const response = await request.post("/api/support/requests", {
    data: {
      rawText: text,
      confirmed: true,
      idempotencyKey: crypto.randomUUID(),
    },
  });
  const { data } = await response.json();
  await page.goto("/review");
  await page.getByRole("link", { name: text, exact: false }).click();
  await expect(page).toHaveURL(new RegExp(`/review\\?requestId=${data.id}$`));
  await expect(
    page.getByRole("button", { name: "Reject", exact: true }),
  ).toBeDisabled();
  await page
    .getByLabel("Lý do (bắt buộc với Reject / Override)")
    .fill("Không đủ scope và approval trong demo.");
  await page.getByRole("button", { name: "Reject", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("REJECTED");
  await expect(
    page.getByRole("button", { name: "Approve", exact: true }),
  ).toBeDisabled();
  await page.screenshot({
    path: `artifacts/reviewer-${info.project.name}.png`,
    fullPage: true,
  });
  const detail = await (
    await request.get(`/api/support/requests/${data.id}`)
  ).json();
  expect(detail.data.status).toBe("REJECTED");
  expect(detail.data.events.at(-1).actor).toBe("public-demo-reviewer");
  await page.reload();
  await expect(page.getByRole("status")).toContainText("REJECTED");
  await page.getByRole("link", { name: "← Review queue" }).click();
  await expect(
    page.getByRole("link", { name: text, exact: false }),
  ).toHaveCount(0);
  await page.getByLabel("Hiển thị", { exact: true }).selectOption("all");
  await expect(
    page.getByRole("link", { name: text, exact: false }),
  ).toBeVisible();
  await page.goto("/audit");
  await page.getByLabel("Mã yêu cầu", { exact: true }).fill(data.id);
  await page.getByRole("button", { name: "Lọc / tải lại" }).click();
  await expect(
    page.getByText("REJECT · public-demo-reviewer", { exact: true }),
  ).toBeVisible();
});
test("one click Verify and a new judge input use live decision API", async ({
  page,
}) => {
  await page.goto("/verify");
  await page
    .getByRole("button", { name: "Chạy toàn bộ test (5)", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "5/5 · Pass: 5 · Fail: 0",
  );
  await page.getByLabel("Bộ kiểm thử").selectOption("extended-v3");
  await page
    .getByRole("button", { name: "Chạy toàn bộ test (10)", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "10/10 · Pass: 10 · Fail: 0",
  );
  await page
    .getByLabel("Yêu cầu tự do")
    .fill("Please help me restart my personal laptop after saving my work");
  await page.getByRole("button", { name: "Đánh giá input mới" }).click();
  await expect(
    page.getByRole("link", { name: "Xem hướng dẫn / chuyển admin" }),
  ).toBeVisible();
});
test("security request cannot be approved and secret is absent from API/audit", async ({
  request,
}) => {
  const secret = "SYNTHETIC" + "_E2E_991";
  const response = await request.post("/api/support/requests", {
    data: {
      rawText: `Open RDP public 3389; password=${secret}`,
      confirmed: true,
      idempotencyKey: crypto.randomUUID(),
    },
  });
  const body = await response.text();
  expect(body).not.toContain(secret);
  const { data } = JSON.parse(body);
  expect(data.decision.bucket).toBe("SECURITY_RISK");
  const rejected = await request.post(`/api/review/${data.id}`, {
    data: { action: "APPROVE", version: data.version },
  });
  expect(rejected.status()).toBe(409);
  const events = await request.get(`/api/support/events?requestId=${data.id}`);
  expect(await events.text()).not.toContain(secret);
});
