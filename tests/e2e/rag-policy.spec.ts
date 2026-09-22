import { expect, test } from "./fixtures";
import { fillEmployeeIdentity } from "./intake-helpers";
test("internal policy gaps are explained without invented entitlements or automatic handoff", async ({
  page,
}) => {
  await page.goto("/workspace");
  await fillEmployeeIdentity(page);
  await page
    .getByLabel("Mô tả yêu cầu", { exact: true })
    .fill("Chính sách công ty cho tôi bao nhiêu ngày nghỉ phép?");
  await page.getByRole("button", { name: "Gửi", exact: true }).click();
  const answer = page.getByRole("article", { name: "Câu trả lời của trợ lý" });
  await expect(answer).toContainText("chưa có chính sách nội bộ đã xác minh");
  await expect(answer).not.toContainText("AI đang tạm không sẵn sàng");
  await expect(
    page.getByRole("button", { name: "Lưu và tiếp tục trò chuyện" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Lưu và tiếp tục trò chuyện" })
    .click();
  await expect(page).toHaveURL(/\/requests\//);
  await expect(page.getByText("Trạng thái:")).toContainText("Đã có hướng dẫn");
});
