# HUMAN-REVIEW.md — PACKAGE-B

Owner: Human Owner B. Chỉ human tick vào các mục; AI không được đánh dấu hộ.

## Trước khi áp dụng

- [ ] Đọc `README-FIRST.md` và `manifest.json` (scope, investigation, acceptance).
- [ ] Xem từng patch trong `PATCH-SERIES/` bằng mắt (`git apply --check` trước,
      sau đó đọc diff). Chú ý không patch nào chạm policy engine, fixture
      expected hay file của Owner A.
- [ ] Xác nhận base đúng: `git rev-parse HEAD` = `542d042097ff7ac2e73f1619f5543d513937d814`
      (hoặc đang trên branch từ SHA đó).

## Theo từng commit

| Commit | Điểm cần review bằng mắt |
|---|---|
| 1 feat(policy) | Nội dung /policy đúng brief (3 nhóm không chắc chắn, disclaimer synthetic); link header/trang chủ hoạt động |
| 2 fix(verify) | Mặc định `de-a-v3`; nhãn 2 bộ đúng yêu cầu; `official-original` bị loại khỏi select và khỏi bộ “Toàn bộ” |
| 3 fix(demo) | Badge “Case Verify” chỉ từ `input.verifyRunId`; audit gom nhóm không làm mất sự kiện; link /requests/[id] đúng |
| 4 docs(submission) | Bảng 4 case đúng cột (đầu vào/hành vi kỳ vọng/cách thực thi) và có 1 case chuyển tiếp; RUNBOOK chạy lại được từ clone sạch |
| 5 chore(release) | Checker chỉ GET; ledger không điền số liệu bịa; package.json chỉ thêm script; matrix/status thêm dòng trung thực |
| 6 ci(quality) | Không secret; Node 22 theo README; không deploy |

## Sau commit cuối (bắt buộc)

```powershell
git restore artifacts/original-fixture-evaluation.json artifacts/rag-retrieval-evaluation.json  # nếu test đã ghi đè
npm run db:generate
npm test          # Expected: 324 passed
npm run lint
npm run typecheck
npm run build
npm run test:e2e  # tối thiểu: tests/e2e/verify-sprint1.spec.ts + judge-flow.spec.ts (chromium + mobile)
```

- [ ] Kết quả trên được chạy lại trên máy human và ghi vào `docs/SPRINT1-READINESS.md`.
- [ ] Chạy thử `node scripts/check-sprint1-release.mjs <sha-đúng-sau-deploy>` — phải PASS trên production; với SHA sai phải FAIL và in `sourceRevision` thật.

## Quyết định thiết kế cần human xác nhận

1. **official-original bị ẩn khỏi UI** (dữ liệu vẫn còn trong repo/tests) — nếu
   đội muốn hiển thị lại, phải sửa composition của file đó trước (2 auto/3
   escalate trái yêu cầu đề bài) và xác minh độc lập.
2. **Audit gom nhóm theo requestId** dựa trên thứ tự sự kiện trả về (liên tiếp
   cùng requestId). API phân trang trả về theo thời gian nên nhóm là đúng;
   nếu sau này đổi sort phải kiểm tra lại.
3. **CI chỉ chạy chất lượng, không deploy** — đúng ý “no production verification
   claims”; deploy vẫn thủ công theo release checklist.
4. **QA-CHECKLIST.md không bị sửa trong bản draft này** — danh sách kiểm tra
   mới nằm trong `docs/SPRINT1-READINESS.md`; human muốn thì tự cập nhật
   QA-CHECKLIST.

## Rủi ro còn lại

- E2E mới chưa chạy trên máy AI (thiếu Playwright browsers) — human phải chạy.
- Badge “Case Verify” ở audit page chỉ hiển thị khi bộ lọc origin=verify
  (AuditEvent không chứa verifyRunId); phân biệt từng dòng khi origin=all cần
  thay đổi API sau này nếu đội muốn — đã ghi rõ trong trang audit.
- Không có kiểm chứng production; mọi khẳng định live thuộc bước human release.
