# PROMPT-CHO-LLM.md — prompt mẫu để human nhờ LLM giải thích/review package này

Dán prompt dưới đây vào trợ lý LLM (ví dụ Codex trong Sprint 2). Yêu cầu chỉ là
**giải thích và kiểm tra**, không phải thực thi — LLM không được commit hay deploy.

---

Bạn là reviewer kỹ thuật cho một bài thi hackathon (OrganizationAI, Đề A —
Escalation Referee). Repository: DOCRELAY_MLAI2026, base commit
542d042097ff7ac2e73f1619f5543d513937d814, policy support-guidance-v5.2.

Trong thư mục deliverables/SPRINT1-REMEDIATION-542d042/PACKAGE-B có 6 patch
tuần tự trong PATCH-SERIES/ và manifest.json mô tả phạm vi. Hãy:

1. Đọc manifest.json, rồi từng patch theo thứ tự 0001 → 0006. Với mỗi patch,
   giải thích bằng tiếng Việt đơn giản: hành vi trước, hành vi sau, vì sao cần
   cho hành trình giám khảo 8 phút (theo Challenge_Brief_OrganizationAI_VN).
2. Đối chiếu với các ràng buộc: không đổi policy engine/decision logic, không
   đổi fixture expected, không xóa dữ liệu MongoDB, không đổi env Vercel,
   không bịa bằng chứng production.
3. Kiểm tra bằng các lệnh SAU ĐÂY VÀ CHỈ CÁC LỆNH NÀY (không commit, không
   push, không deploy, không gọi API production trả phí):
   npm test, npm run lint, npm run typecheck, npm run build.
   Với `node scripts/check-sprint1-release.mjs <sha-giả>`, xác nhận nó chỉ GET
   và báo lệch SHA đúng cách.
4. Báo cáo: mỗi commit được test gì bảo vệ; trang /verify sau patch có đúng
   bộ mặc định 5 case không; /policy có đủ 3 nhóm không chắc chắn và disclaimer
   không; còn rủi ro nào cho giám khảo không.

Không thực hiện bất kỳ thao tác ghi nào lên repository, Vercel hoặc MongoDB.
