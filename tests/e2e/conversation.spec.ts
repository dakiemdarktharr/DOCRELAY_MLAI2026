import { expect, test } from "@playwright/test";
test("conversation answers before confirmation, wraps and continues without a reviewer", async ({
  page,
}, info) => {
  await page.goto("/workspace");
  await page
    .getByLabel("Mô tả yêu cầu", { exact: true })
    .fill("làm sao khôi phục tài khoản google");
  await page.getByRole("button", { name: "Xem hệ thống đã hiểu gì" }).click();
  const bubble = page.getByRole("article", { name: "Câu trả lời của trợ lý" });
  await expect(bubble).toContainText("Google");
  await expect(
    page.getByRole("button", { name: "Xác nhận và gửi yêu cầu" }),
  ).toHaveCount(0);
  await expect(bubble).toBeVisible();
  const timings = await bubble.evaluate((element) => ({
    pop: getComputedStyle(element).animationDuration,
    reveal: getComputedStyle(element.parentElement!).animationDuration,
  }));
  expect(timings).toEqual({ pop: "0.2s", reveal: "0.4s" });
  await bubble.locator("summary").click();
  await expect(bubble.getByRole("link", { name: /Google:/ })).toHaveAttribute(
    "href",
    /support.google.com/,
  );
  await page.screenshot({
    path: `artifacts/conversation-${info.project.name}.png`,
    fullPage: true,
  });
  await bubble.locator(".assistant-text").evaluate((element) => {
    element.textContent =
      "A".repeat(2000) + "\n" + "Dòng hướng dẫn dài. ".repeat(200);
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Lưu và tiếp tục trò chuyện" })
    .click();
  await expect(page).toHaveURL(/\/requests\//);
  await page
    .getByLabel("Hỏi tiếp", { exact: true })
    .fill("Tôi không nhận được mã xác minh");
  await page.getByRole("button", { name: "Gửi câu hỏi", exact: true }).click();
  await expect(page.getByLabel("Hỏi tiếp", { exact: true })).toHaveValue("");
  await expect(page.getByText("Trạng thái:")).toContainText("Đã có hướng dẫn");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page
      .locator(".assistant-bubble")
      .first()
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
  await page
    .getByRole("button", {
      name: "D. Chuyển cho nhân viên hỗ trợ",
      exact: true,
    })
    .click();
  await expect(page.getByText("Trạng thái:")).toContainText(
    "Đang chờ nhân viên",
  );
});
