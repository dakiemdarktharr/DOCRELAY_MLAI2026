# RAG hardening — audit và contract trước code

Base: main `7c26cae`. Checkout riêng, không commit/push/deploy; giữ nguyên draft contracts.ts ở workspace gốc.

## Runtime và thiếu sót
- Có Mongo lexical retrieval, 10 bài, hosted web giới hạn domain, model answer validation và policy độc lập.
- Mongo chỉ tìm trong label, label bonus đủ chọn cả bài không liên quan; chưa có benchmark riêng. Corpus nhỏ, chưa có quy trình review tài liệu nội bộ cho demo công khai.
- Sources hiển thị gồm cả bài model không dùng; fallback khi retrieval lỗi lấy bài đầu theo label. Cache web có TTL nhưng answer chưa cache; cache web và nội dung knowledge từ DB chưa đối chiếu manifest đã review.
- Pattern guard hữu ích nhưng không chứng minh miễn nhiễm prompt injection. Output có nguồn chưa chứng minh từng claim được nguồn hỗ trợ.
- Không có tài liệu nội bộ thực, không thể tự tạo entitlement. Cap 50 đã duyệt phải giữ; không biến việc thiếu budget thành lỗi chuyển reviewer.

## Contract / phase
A — Tiến Khoa: corpus công khai mở rộng, retrieval BM25 nhỏ + synonym/typo tolerance chỉ dùng cho tìm kiếm, label là gợi ý không là filter; chỉ chấp nhận revision có nội dung đúng reviewed manifest. Benchmark synthetic cố định trước chỉnh thuật toán, đo hit@1/recall@3/MRR, unknown abstention; không thay Ground Truth cũ.
B — Duy Anh: fallback cùng retrieval; source attribution theo knowledgeIds thực; output/retrieved web injection checks; policy/GPU thiếu nội bộ thì giới hạn deterministic, không bịa quyền. Cache answer chính xác theo câu hỏi/policy/model/corpus, không cache thông tin cá nhân hay câu hỏi nối tiếp. Hiển thị nguồn cache/fallback rõ; kiểm thử workflow adversarial, cache, thiếu nguồn.

Hai package dùng đường dẫn file riêng, mỗi package áp dụng từ base và có unit/lint/build; tích hợp cả hai chạy toàn bộ E2E. Mỗi gói có patch, file mới, manifest/hash, prompt giao việc và hướng dẫn review/commit bằng danh tính thật. Không tạo commit sẵn, không backdate/co-author giả. AI đã tạo bản sửa; thành viên tự kiểm chứng và ghi nhận phần mình thật sự làm.

## Giới hạn công bố
Không có chính sách nội bộ thật, không đo accuracy người dùng thực, không chứng nhận chống mọi injection. Không nâng cap hay gọi API có phí trong QA đóng gói. Embeddings chỉ thêm sau khi benchmark chỉ ra nhu cầu; hiện ưu tiên retrieval có thể giải thích, không thêm dịch vụ/phí.
