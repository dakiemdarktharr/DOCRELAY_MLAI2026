# PACKAGE-B — JUDGE-FLOW-RELEASE-EVIDENCE-AND-DEMO-HYGIENE

Owner: **Human Owner B** · Base: `542d042097ff7ac2e73f1619f5543d513937d814`

## Đọc trước khi làm gì

1. Package này **đã được AI chuẩn bị nhưng chưa được áp dụng** vào main. Không
   có commit, push, deploy hay đổi gì trên production.
2. Sáu patch trong `PATCH-SERIES/` là tuần tự và **độc lập file với Package A** —
   có thể áp riêng lẻ hoặc song song với A.
3. Mỗi patch tương ứng đúng một human commit trong `manifest.json` → `commits`.
   **Chỉ human tạo commit** bằng Git identity của mình.

## Package này sửa gì

| Hạng mục | Thay đổi |
|---|---|
| Trang /verify | Mặc định là bộ **“Escalation — Đề A (5 case: 3 tự động / 2 chuyển tiếp)”**; bộ nộp bài chung đổi tên rõ “Bộ nộp bài chung — 4 case, có chuyển tiếp”; `official-original` (2 auto / 3 escalate — trái cấu trúc đề bài) bị ẩn khỏi lựa chọn và lần chạy của giám khảo; ground truth gốc ghi rõ là dữ liệu lịch sử không nộp |
| Trang /policy | Public, tiếng Việt: trường hợp thường quy, ba nhóm không chắc chắn, ranh giới thẩm quyền, quy tắc an toàn cho input nghi vấn, ví dụ câu hỏi chuyển tiếp, disclaimer synthetic student-demo |
| Điều hướng | “Tài liệu quy định” xuất hiện ở header, trang chủ và trang Verify |
| Reviewer/audit | Badge “Case Verify” cho hồ sơ Verify (từ `input.verifyRunId`), link “Xem trang người dùng”, audit gom theo request với mã ngắn + trạng thái/bucket/thời điểm + link chi tiết; ghi chú nội dung đã redact |
| Bộ nộp bài | `submission/TEST-CASES.md` — đúng bảng 4 case (đầu vào, hành vi kỳ vọng, cách thực thi, 1 case chuyển tiếp) |
| RUNBOOK | Viết lại thành hướng dẫn clone sạch → chạy, kèm troubleshooting và ranh giới mock/production |
| Release | `scripts/check-sprint1-release.mjs` (read-only, so sánh `sourceRevision` với SHA), `docs/SPRINT1-READINESS.md` (ledger bằng chứng), `submission/ASSET-REFRESH-RUNBOOK.md` (video/slide/build-log) |
| CI | `.github/workflows/quality.yml` — npm ci, test, lint, typecheck, build; không secret, không deploy |

## Cách áp dụng (human)

```powershell
git checkout 542d042097ff7ac2e73f1619f5543d513937d814   # hoặc branch sạch từ SHA này
git apply PATCH-SERIES/0001-feat-policy-publish-public-vietnamese-policy-and-navigation-links.patch
# ... theo thứ tự 0002 → 0006; sau mỗi patch chạy npm test, rồi human commit
# bằng thông điệp tương ứng trong manifest.json → commits[i].message
```

Sau commit cuối:

```powershell
npm run db:generate
npm test          # Expected: 324 pass
npm run lint
npm run typecheck
npm run build
npm run test:e2e  # tối thiểu: tests/e2e/verify-sprint1.spec.ts + judge-flow.spec.ts
```

Khôi phục `artifacts/*.json` trước khi commit nếu test đã ghi đè.

## Package này KHÔNG làm

- Không commit/push/deploy, không đổi env Vercel, không xóa/dọn MongoDB.
- Không sửa policy engine, không đổi fixture expected.
- Không sửa file nhị phân (PPTX/PDF/WEBM) — chỉ có runbook hướng dẫn human refresh.
- Không rebrand “VNG Support” (giữ disclaimer hiện có; rebrand cần duyệt tường minh).
- Không khẳng định human review, user study hay bằng chứng production.
