# OrganizationAI VN — Đề A

Workspace riêng cho sản phẩm IT Helpdesk Escalation Referee.

Trước khi phát triển, đọc `PROJECT-MEMORY.md` để nắm các quyết định đã thống nhất. Mọi coding agent phải tuân theo `AGENTS.md`.

## Nguyên tắc dữ liệu

- Dữ liệu ticket, danh tính, approval và audit demo trong `data/` là synthetic hoặc đã được ẩn danh.
- Ground Truth và policy phải được lưu riêng, có mã rule rõ ràng.
- Không lưu credential, token hoặc dữ liệu production thật trong repository.

## Cấu trúc chính

- `src/app/`: các route và giao diện web.
- `src/components/`: UI dùng chung.
- `src/lib/policy/`: policy và rule evaluation.
- `src/lib/decision/`: decision engine và escalation logic.
- `src/lib/audit/`: audit log và human override.
- `src/lib/verify/`: Verify harness.
- `src/types/`: domain types và contract dùng chung.
- `data/`: policy, Ground Truth, Verify, adversarial cases và dữ liệu demo.
- `docs/`: brief, kiến trúc, bằng chứng người dùng và quyết định thiết kế.
- `tests/`: unit, integration và end-to-end tests.
- `scripts/`: các script seed, verify và hỗ trợ vận hành.
- `prisma/`: schema và migration khi cần persistence.
- `public/`: tài nguyên tĩnh của web app.

Challenge-specific implementation sẽ được thêm sau khi chốt policy và dataset.
