# Evidence của bản tham khảo

Các screenshots, `e2e-results.json` và `original-fixture-evaluation.json` ở đây được tạo khi kiểm thử implementation AI-assisted tại commit `69b16493143b1fd48d41487012ff0db77999a042` (nhánh `codex/support-v3-migration`).

Main nhận chúng làm tài liệu tham khảo nhưng **không nhận `src/`** theo yêu cầu người dùng tự code. Do đó các artifacts này không chứng minh main hiện có ứng dụng chạy được, hoặc implementation mới của sinh viên đã pass. Manifest baseline ghi snapshot đầu migration; nó không xác nhận thời điểm sáng tác, quyền tác giả hoặc đủ điều kiện cuộc thi.

Sau khi tự viết và chạy QA, ghi rõ implementation/commit mới cùng kết quả mới. Không đổi nhãn báo cáo cũ thành kết quả của bài làm mới. Các tests Verify có thể tạo lại `original-fixture-evaluation.json`; kiểm tra diff và nguồn gốc trước khi commit.
