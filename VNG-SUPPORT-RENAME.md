# VNG Support — đổi tên và tài liệu, 21/09/2026

## Audit trước thay đổi

- Runtime thật: Next.js UI/API, deterministic policy v5, MongoDB persistence/knowledge/web cache, OpenAI conversation và bounded public web search. Baseline main `ff4dd13`; 218 unit tests pass; lint/build được chạy trước sửa runtime.
- Tài liệu lỗi thời: README trộn policy v3/v4/v5, budget 20/30/50 và sơ đồ trước conversation. Cần viết lại theo implementation hiện tại.
- Tên không nhất quán: IT Referee ở header, DOCRELAY ở answer/model/knowledge, generic skeleton ở package, labpass trên Vercel.
- Không đổi policy, ground truth, quyền reviewer, database hay GitHub repository. Giữ lịch sử phát triển và chứng cứ release cũ.

## Phạm vi và thứ tự

1. Đổi tên project Vercel hiện có sang `vng-support`, thêm domain production `vng-support.vercel.app`; giữ alias cũ.
2. Đồng bộ header, metadata, bubble, model identity, package; đổi tên mascot và hai file mang tên DOCRELAY, sửa link tham chiếu.
3. Tạo revision 2 cho ba knowledge article nhận diện thương hiệu. Revision 1 vẫn ở Mongo; retrieval loại các ID đã bị revision mới thay thế, kể cả khi revision mới hết hạn. Không viết lại request/history cũ.
4. Viết lại README, cập nhật phần hiện hành của RUNBOOK/STATUS/PROJECT-OVERVIEW; giữ báo cáo lịch sử có nhãn rõ.
5. Unit/lint/build, E2E desktop/mobile; commit/push main, deploy cùng project ID, kiểm tra domain/health/Mongo và tài nguyên giao diện.

Files dự kiến: README.md, RUNBOOK.md, STATUS.md, BUILD-LOG.md, PROJECT-OVERVIEW.md, package.json/package-lock.json, src/app/layout.tsx, src/app/page.tsx, src/components/{header,answer-bubble,request-detail,review-console}.tsx, src/domain/knowledge.ts, src/lib/{conversation-model,support-knowledge}.ts, tests/conversation.test.ts, public/illustrations/*, submission/README.md, submission/USER-FEEDBACK-TEMPLATE.md và các link tới hai file đổi tên.

## Mapping

| Cũ | Mới |
| --- | --- |
| Vercel project `labpass` | `vng-support` (cùng project ID) |
| labpass-five.vercel.app | vng-support.vercel.app (alias cũ giữ tương thích) |
| DOCRELAY-ERRORS-RECHECK.md | VNG-SUPPORT-ERRORS-RECHECK.md |
| submission/DOCRELAY-5-SLIDES.pptx | submission/VNG-SUPPORT-5-SLIDES.pptx |
| public/illustrations/support-mascot.png | public/illustrations/vng-support-mascot.png |
| npm mlai-vng-generic-skeleton | vng-support |

Slide, video và report lịch sử vẫn là snapshot lúc tạo, không được trình bày như bằng chứng kiểm thử release mới. GitHub `dakiemdarktharr/DOCRELAY_MLAI2026`, marker API `MLAI_SUPPORT_REFEREE_V3`, fixture approval `docrelay-demo`, Mongo database/collection và các khóa cấu hình được giữ để không phá contract/dữ liệu. Các filename quy ước như README.md, page.tsx, route.ts giữ nguyên.

## QA trước deploy

Baseline 218 unit/lint/build PASS. Sau thay đổi: 219 unit, lint/build PASS; E2E cuối 29 PASS + 1 duplicate-video skip. Đã sửa assertion title cũ ở smoke test, không sửa fixture nghiệp vụ. Link tài liệu tương đối và git diff --check PASS. Workspace gốc vẫn chỉ có draft contracts.ts (226 insertions / 104 deletions), không đưa vào commit.

## Deployment đã kiểm chứng

Source `cfb9295c07235f3f8bb20e45c6fd97fc9fcafed1`, deployment `dpl_BcyeJnNXbZae9StBorhA2adSu28Y` READY tại https://vng-support.vercel.app. Vercel build PASS. **13/13 live checks PASS** trong `artifacts/vng-support-live-verification.json`; OpenAI thật dùng `support-kb-v2-identity` từ MongoDB và tự giới thiệu tên mới. Một probe model trong cap đã cho phép, không đổi budget. Save/readback giữ đúng câu trả lời và hồ sơ synthetic đóng COMPLETED. Đã mở site mới trong browser và xác nhận title/brand/hai lối vào. Alias cũ cùng source revision.
