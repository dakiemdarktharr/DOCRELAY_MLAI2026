# PACKAGE-A — DECISION-SAFETY-AND-USER-CLARITY

Owner: **Human Owner A** · Base: `542d042097ff7ac2e73f1619f5543d513937d814`

## Đọc trước khi làm gì

1. Package này **đã được AI chuẩn bị nhưng chưa được áp dụng** vào main. Không
   có commit, push, deploy hay đổi gì trên production.
2. Sáu patch trong `PATCH-SERIES/` là tuần tự và độc lập file với Package B —
   có thể áp riêng lẻ hoặc song song với B.
3. Mỗi patch tương ứng đúng một human commit trong `manifest.json` → `commits`.
   **Chỉ human tạo commit** bằng Git identity của mình.

## Package này sửa gì

| Vấn đề đã tái hiện trên base 542d042 | Cách sửa |
|---|---|
| Routine (vd “VPN không kết nối”) + model lỗi → ESCALATE FAIL-001/002 với câu hỏi chung chung “Xác nhận phạm vi và người có thẩm quyền xử lý.” | `enrichFailureHandoff` + `failureHandoffQuestions`: câu hỏi theo rule khớp + ngữ cảnh deterministic đã bảo toàn (intent/entities/evidence) |
| Missing-info hỏi tới 3 câu cùng lúc | `clarificationPlan` chỉ hỏi đúng 1 dữ kiện quyết định nhất |
| Requester thấy chữ engine (“Model trả dữ liệu không đúng schema…”) | `requesterReason`: văn bản thân thiện; reviewer vẫn thấy `adminReason` + mã lỗi đầy đủ |
| UI hiện bucket tiếng Anh thô | `BUCKET_LABELS_VI` + `bucketLabel`: nhãn tiếng Việt, ID nội bộ là chi tiết phụ |

Không đổi: precedence an toàn (SECURITY_RISK → BEYOND_AUTHORITY → MISSING_INFO
→ ROUTINE), hành vi fail-safe escalation, Verify fixture/expected, policy.ts.

## Cách áp dụng (human)

```powershell
git checkout 542d042097ff7ac2e73f1619f5543d513937d814   # hoặc branch sạch từ SHA này
git apply PATCH-SERIES/0001-fix-model-preserve-deterministic-context-after-invalid-model-output.patch
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
npm run test:e2e  # existing specs (Playwright browsers phải có)
```

Khôi phục `artifacts/original-fixture-evaluation.json` và
`artifacts/rag-retrieval-evaluation.json` trước khi commit (chạy test có thể
ghi đè chúng — không stage các file này).

## Kiểm chứng “fail trước, pass sau”

Trên base 542d042 (chưa áp patch), `tests/new-input-fallback.test.ts` fail
**15/23 test** (8 test guard đã đúng sẵn). Sau 6 patch: 23/23 pass.

## Package này KHÔNG làm

- Không commit/push/deploy, không đổi env Vercel, không đụng MongoDB.
- Không đổi ground truth/expected, không sửa Verify case.
- Không khẳng định human review, user study hay bằng chứng production.
