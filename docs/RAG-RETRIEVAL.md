# Tiến Khoa — corpus, retrieval và benchmark

Contract giữ nguyên `rankKnowledge(rows, question, label, now?) -> KnowledgeArticle[]` tối đa 3 bài. `retrieveKnowledge` giữ articles/storage; không đổi decision API hoặc policy authority.

## Đọc theo thứ tự

1. `src/domain/knowledge.ts`: type, seed ban đầu và revision.
2. `src/domain/knowledge-extra.ts`: 14 bài bổ sung; corpus hiện có 24 bài đang hoạt động.
3. `src/domain/knowledge-search.ts`: chuẩn hóa phục vụ search, synonym Việt–Anh, typo một ký tự với từ dài, BM25 và trọng số title/keyword. Label chỉ là gợi ý; không dùng search normalization để cấp quyền.
4. `src/lib/support-knowledge.ts`: đối chiếu nội dung với reviewed manifest trước rank; truy vấn các ID đang review trên toàn corpus thay vì khóa một label. Mongo index/upsert cũ giữ; không xóa dữ liệu.
5. `tests/fixtures/rag-retrieval.json` và `tests/rag-retrieval.test.ts`: 54 case synthetic cố định, 50 có bài phù hợp + 4 ngoài kho. Thử cả nhãn sai. Thuật toán không đọc file test/case ID.

## Kết quả local

Cùng corpus mở rộng, baseline algorithm đạt hit@1 76%, recall@3 96%, MRR 0.86; bản mới 92%, 100%, 0.96. Unknown abstention 0/4 -> 4/4. Đây là development regression do AI xây dựng, không phải bộ held-out độc lập hoặc accuracy người dùng thật. Expected giữ nguyên trong quá trình sửa thuật toán. Tăng coverage corpus và cải thiện rank là hai yếu tố khác nhau; bảng so sánh dùng cùng corpus để không đánh tráo chúng.

Vẫn còn 4/50 câu có bài đúng ở vị trí 2. Không tuyên bố đã giải quyết mọi paraphrase. Trước khi thêm embeddings/reranker: thu thập tập có đồng ý sử dụng, gán nhãn độc lập, chia development/held-out theo intent và đo gain/latency/chi phí. Gói này không thêm API embedding hoặc vector DB.

## Bài review của thành viên

- Giải thích vì sao cần cả title-match và score, vì sao label không đủ để chọn một bài.
- Thêm tối thiểu vài câu do chính bạn nghĩ ra, giữ riêng khỏi 54 case development, chạy benchmark trước khi sửa code.
- Kiểm tra bài quá hạn, ID đúng nhưng nội dung bị đổi, câu không có tài liệu phù hợp.
- Review nguồn và tự chỉnh điểm chưa phù hợp; ghi rõ phần bạn sửa/kiểm chứng khi commit.

Chạy: `npm test -- tests/rag-retrieval.test.ts`; báo cáo sinh tại `artifacts/rag-retrieval-evaluation.json`.
