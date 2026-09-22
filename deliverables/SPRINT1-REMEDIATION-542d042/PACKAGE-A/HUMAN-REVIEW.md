# HUMAN-REVIEW.md — PACKAGE-A

Owner: Human Owner A. Chỉ human tick vào các mục; AI không được đánh dấu hộ.

## Trước khi áp dụng

- [ ] Đọc `README-FIRST.md` và `manifest.json` (scope, investigation, acceptance).
- [ ] Xem từng patch trong `PATCH-SERIES/` bằng mắt (`git apply --check` trước,
      sau đó đọc diff). Chú ý không patch nào chạm policy.ts, fixture/expected
      hay file của Owner B.
- [ ] Xác nhận base đúng: `git rev-parse HEAD` = `542d042097ff7ac2e73f1619f5543d513937d814`
      (hoặc đang trên branch từ SHA đó).

## Theo từng commit

| Commit | Điểm cần review bằng mắt |
|---|---|
| 1 fix(model) | `enrichFailureHandoff` chỉ đổi câu hỏi/userReason cho escalation có **toàn bộ** ruleId là FAIL-*; `modelFailure` giữ nguyên canonical |
| 2 fix(questions) | `failureHandoffQuestions` dùng đúng ngữ cảnh deterministic; hints mới không ghi đè câu hỏi cũ |
| 3 fix(policy) | `clarificationPlan` còn 1 field; policy.ts tiêu thụ plan không đổi; case reset giữ 1 câu hỏi |
| 4 fix(result) | `requesterReason` chỉ áp cho audience employee; reviewer vẫn đọc `adminReason` |
| 5 feat(result) | Nhãn tiếng Việt đúng 4 bucket; ID nội bộ vẫn hiện dạng phụ |
| 6 test(fallback) | Matrix phủ routine/risky/missing/authority/retry/readback qua API thật của app (mock model) |

## Sau commit cuối (bắt buộc)

```powershell
git restore artifacts/original-fixture-evaluation.json artifacts/rag-retrieval-evaluation.json  # nếu test đã ghi đè
npm run db:generate
npm test          # Expected: 324 passed
npm run lint
npm run typecheck
npm run build
npm run test:e2e  # existing specs; Playwright browsers cần cài
```

- [ ] Kết quả trên được chạy lại trên máy human và ghi vào `docs/SPRINT1-READINESS.md`.

## Quyết định thiết kế cần human xác nhận

1. **userReason thân thiện nằm ở tầng dữ liệu** (commit 1) — reviewer vẫn có
   `adminReason` gốc. Nếu đội muốn giữ nguyên văn engine trong decision và chỉ
   đổi UI, cần điều chỉnh commit 1 (bỏ đổi userReason, giữ `requesterReason`
   của commit 4). Đề xuất: giữ như hiện tại vì audit vẫn có adminReason.
2. **Audit timeline của requester** (trang /requests/[id]) vẫn hiện rule ID
   bên trong phần “Rule, evidence…” thu gọn — đây là dữ liệu kiểm toán minh
   bạch theo brief, không thuộc phạm vi file của package này. Nếu đội muốn ẩn
   với requester, cần một thay đổi riêng ở `src/components/support-history.tsx`
   do human quyết định (ngoài scope 2 package).
3. **Câu hỏi missing-info giảm từ 3 → 1** — đây là thay đổi hành vi có chủ đích
   theo brief (“hỏi đúng một dữ kiện quan trọng nhất”). Hồ sơ vẫn ghi đủ
   `missingFields` để reviewer xem; người dùng trả lời từng bước một.

## Rủi ro còn lại

- E2E cho 2 spec mới của Package B chưa chạy trên máy AI (thiếu browser) —
  human phải chạy.
- Không có kiểm chứng production; mọi khẳng định live thuộc bước human release.
