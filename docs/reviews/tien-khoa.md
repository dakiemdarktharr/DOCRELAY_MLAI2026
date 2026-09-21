# Ghi chú kiểm tra trước commit — gói Tiến Khoa

## Trạng thái

Đây là ghi chú kiểm tra kỹ thuật do Codex lập theo yêu cầu commit của người dùng. Gói nguồn ghi rõ là **AI-assisted**; chưa có xác nhận rằng Tiến Khoa đã tự review hoặc tự viết toàn bộ phần này. Vì vậy, human review của Tiến Khoa vẫn **đang chờ** và commit này không được hiểu là chứng nhận tác giả hay đủ điều kiện dự thi.

## Phạm vi đã tiếp nhận

- Repository: `https://github.com/dakiemdarktharr/DOCRELAY_MLAI2026`
- Base: `7c26caec36b608779af86196efc2b6cf766c6a21`
- Branch: `codex/rag-tien-khoa`
- Gói: `TIEN-KHOA`, checksum patch khớp manifest.
- Nội dung: mở rộng corpus knowledge lên 24 bài; retrieval lexical BM25 nhỏ với synonym/typo tolerance; kiểm tra bản ghi Mongo phải khớp corpus đã review; thêm benchmark synthetic và tài liệu.

## Việc đã kiểm tra

- Đọc hướng dẫn commit, manifest, audit, tài liệu retrieval, source payload và `AGENTS.md` của repository.
- Chạy helper dry-check rồi apply; patch áp dụng được trên đúng base, không có conflict.
- Chạy `git diff --check`: PASS.
- Chạy `npm test -- tests/rag-retrieval.test.ts`: 3/3 PASS; benchmark báo hit@1 0.92, recall@3 1.00, MRR 0.96 và unknown abstention 4/4.
- Chạy `npm test`: 222/222 PASS.
- Chạy `npm run lint`: PASS.
- Chạy `npm run typecheck`: PASS.
- Chạy `npm run build`: PASS.
- Chạy `npm run test:e2e`: 2 PASS, 28 không chạy được assertion vì môi trường thiếu executable Chromium của Playwright. Đã thử `npx playwright install chromium`, nhưng tải browser bị timeout; E2E không được đánh dấu PASS.

## Kiểm tra diff và provenance

- Chỉ các file trong manifest và file ghi chú review này được dự kiến stage.
- Hai thay đổi có sẵn/sinh trong quá trình làm việc là `artifacts/e2e-results.json` và `artifacts/original-fixture-evaluation.json`; chúng không thuộc gói Tiến Khoa và không được đưa vào commit.
- Không có secret, API key, `node_modules`, `.env`, database production hay API trả phí được dùng trong kiểm tra.
- Chưa chạy Mongo production, chưa deploy và chưa khẳng định accuracy trên dữ liệu người dùng thật.

## Câu hỏi cần human review tiếp

- Kiểm tra độc lập tính đúng và quyền công bố của từng nguồn knowledge trước khi dùng cho demo công khai.
- Bổ sung các câu hỏi paraphrase/typo do thành viên tự nghĩ, giữ riêng khỏi bộ development benchmark, rồi chạy lại full QA.
- Xác nhận hành vi retrieval trong Mongo thật và kiểm tra E2E trên máy có Chromium.
- Ghi bổ sung phần chỉnh sửa thực tế của Tiến Khoa nếu có; không đánh dấu phần này là tự viết toàn bộ.
