import { expect, test } from "@playwright/test";

test("orange role gate and NAVI respect desktop, touch and reduced motion", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await expect(page.locator(".role-entry")).toHaveCSS(
    "background-color",
    "rgb(248, 182, 76)",
  );
  await expect(page.locator(".role-entry-actions a")).toHaveCount(2);
  await expect(page.locator(".site-header")).toBeHidden();
  await expect(page.locator("footer")).toBeHidden();
  await expect(page.locator(".role-entry-backdrop svg")).toBeVisible();
  if (isMobile) {
    await expect(page.locator(".navi-cursor")).toBeHidden();
  } else {
    await page.mouse.move(100, 100);
    await expect(page.locator(".navi-cursor")).toHaveAttribute(
      "data-visible",
      "true",
    );
    await page.keyboard.press("Tab");
    await expect(page.locator("html")).not.toHaveAttribute("data-navi", "true");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.mouse.move(150, 100);
    await expect(page.locator(".navi-cursor")).toHaveAttribute(
      "data-moving",
      "false",
    );
    await expect(page.locator(".navi-trail")).toBeHidden();
  }
});

test("old help route and workspace alias share preview, edit and v3 submit", async ({
  page,
}, info) => {
  for (const route of ["/workspace", "/send-help"]) {
    await page.goto(route);
    await expect(
      page.getByRole("heading", { name: "I Need Help" }),
    ).toBeVisible();
    await expect(page.locator(".site-header")).toBeVisible();
    await expect(page.locator("form select")).toHaveCount(1);
    await expect(page.locator("form textarea")).toHaveCount(1);
  }
  const description = page.getByLabel("Mô tả yêu cầu", { exact: true });
  await description.fill("Tôi tắt máy tính lúc về được không?");
  await page.getByRole("button", { name: "Xem hệ thống đã hiểu gì" }).click();
  await expect(description).toBeDisabled();
  await page.getByRole("button", { name: "Quay lại sửa" }).click();
  await expect(description).toHaveValue("Tôi tắt máy tính lúc về được không?");
  await description.fill("VPN không kết nối");
  await page.getByRole("button", { name: "Xem hệ thống đã hiểu gì" }).click();
  await expect(page.getByText("LLM_ASSIST", { exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `artifacts/help-preview-${info.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Xác nhận và gửi yêu cầu" }).click();
  await expect(page).toHaveURL(/\/requests\/[a-f0-9-]+$/);
  await expect(
    page.getByRole("button", { name: "D. Chuyển yêu cầu cho admin" }),
  ).toBeVisible();
  await expect(page.getByText("Trạng thái:")).toContainText("AUTO_APPROVED");
});
