# PROMPT-CHO-LLM.md — prompt mẫu để human nhờ LLM giải thích/review package này

Dán prompt dưới đây vào trợ lý LLM (ví dụ Codex trong Sprint 2). Yêu cầu chỉ là
**giải thích và kiểm tra**, không phải thực thi — LLM không được commit hay deploy.

---

Bạn là reviewer kỹ thuật cho một bài thi hackathon (OrganizationAI, Đề A —
Escalation Referee). Repository: DOCRELAY_MLAI2026, base commit
542d042097ff7ac2e73f1619f5543d513937d814, policy support-guidance-v5.2.

Trong thư mục deliverables/SPRINT1-REMEDIATION-542d042/PACKAGE-A có 6 patch
tuần tự trong PATCH-SERIES/ và manifest.json mô tả phạm vi. Hãy:

1. Đọc manifest.json, rồi từng patch theo thứ tự 0001 → 0006. Với mỗi patch,
   giải thích bằng tiếng Việt đơn giản (mức sinh viên TypeScript cơ bản):
   hành vi trước, hành vi sau, vì sao thay đổi an toàn, và file/test liên quan.
2. Đối chiếu từng thay đổi với các ràng buộc: không đổi policy.ts, không đổi
   ground truth/expected, không làm mất precedence SECURITY_RISK →
   BEYOND_AUTHORITY → MISSING_INFO → ROUTINE, không biến input nghi vấn thành
   kết quả khẳng định.
3. Tự kiểm tra bằng các lệnh SAU ĐÂY VÀ CHỈ CÁC LỆNH NÀY (không commit, không
   push, không deploy, không gọi API production, không sửa database):
   npm test, npm run lint, npm run typecheck, npm run build.
4. Báo cáo: mỗi commit có test nào bảo vệ hành vi đó; có điểm nào khó giải
   thích cho thành viên đội không; có rủi ro sót nào không.

Không thực hiện bất kỳ thao tác ghi nào lên repository, Vercel hoặc MongoDB.
