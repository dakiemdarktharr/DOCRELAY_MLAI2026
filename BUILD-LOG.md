# Build Log

## Support policy/workflow migration — 2026-09-20

- Tool: Astra/Codex, theo master prompt Policy Engine & Workflow Migration. Implement trực tiếp `mlai26`, không tạo project mới; không copy runtime hoặc credential từ repository khác. Không ghi nhận thay mặt sinh viên rằng họ tự viết phần này.
- Trước code: đọc tài liệu/source/tests/datasets theo checklist, ghi `MIGRATION-AUDIT.md` và manifest SHA256. Baseline12tests/lint/build PASS.
- Phases1–2: typed contract/catalog, executable rule data độc lập, guidance/precedence/missing/conflict/subrequests/redaction, tests tương ứng trước nối intake.
- Phase3: preview và confirmed/idempotent submit, memory/Mongo document storage, safe input/decision API, UI động; giữ generic UI ở `/legacy/*` và API cũ.
- Phase4: mock/OpenAI server adapter, strict schema và evidence, recompute risk, approved assistance steps, no tools, no retries, timeout12s và budget tối đa20. Explanation deterministic. Tham khảo OpenAI JSON/structured-output docs; không gọi paid model trong QA.
- Phase5: public synthetic reviewer, optimistic versions, transitions, mandatory reject/override reason, employee feedback/handoff/clarification, embedded audit và history.
- Phase6: Verify dùng route submit thật, bộ v3 riêng3auto/2escalate, extended10case, load5+123 fixture gốc không sửa expected. Hash tests bảo đảm originals không đổi. Original evaluation cuối48/128 matched,80 mismatch hiển thị; không case ESCALATE gốc nào thành AUTO.
- Các lỗi phát hiện và sửa: phủ định “không factory reset” bị nhận destructive; redaction dấu tiếng Việt ở “mật khẩu là”; model environment thiếu evidence; guidance label đi kèm requestedAction wipe; generic endpoint phản chiếu secret/provider exceptions; từ “load” khớp nhầm “loa”; yêu cầu chuyển admin bị hiểu nhầm xin quyền admin. Regression tests đi kèm.
- Phase7: README/RUNBOOK/STATUS cập nhật runtime, provenance, limits và compatibility; E2E server riêng3216, reusefalse, app marker/mock/memory. Xem STATUS và artifacts cho kết quả QA cuối.
- Baseline Git mới nhất `4009759`; không đổi author date/commit date/lịch sử. Commit mới chỉ ghi nhận thay đổi mới, không biến prototype cũ thành code sáng tác sau cutoff. Nhóm cần công bố scaffold/AI assistance và xác nhận quy định cuộc thi.
- Human review chưa được quan sát: đội thi vẫn phải đọc, giải thích, kiểm thử và ghi quyết định của từng thành viên. Không ghi khống đã review hoặc bảo đảm đủ điều kiện dự thi.

## Initial generic scaffold

- Date: 2026-09-16
- Scope: reusable pre-sprint shell only.
- AI tools used: AI coding assistant (this session); team should add the exact tool/account details before submission.
- AI assistance: generated the initial Next.js/TypeScript structure, generic UI primitives, API response helpers, Zod validation pattern, Prisma Event model, LLM wrapper, generic Verify runner, and documentation templates.
- Human decisions: preserve LabPass as the future concept, keep the current code challenge-agnostic, use deterministic generic echo verification, keep the API key server-side, and use PostgreSQL/Prisma for production event persistence.
- Corrections/risks to review: dependency versions, Render configuration, database connectivity, and all generated code must be reviewed and explained directly by team members.
- Largest feature intentionally cut: challenge workflow, because it must be developed during Sprint 1 after the official brief is released.

## Update template

For every meaningful change, record:

1. Tool or assistant used.
2. What it generated or changed.
3. What failed or cost time.
4. What a team member reviewed and decided.
5. Test/evidence link.

## Authorship clarification

The team requirement is stricter than merely using an AI coding assistant: challenge-specific TypeScript/TSX core must be self-written by student members. AI-generated generic scaffold code is not evidence of student authorship for the challenge core. During Sprint 1, each member must own a vertical slice, make the commits, explain the code, and record any material AI assistance.
