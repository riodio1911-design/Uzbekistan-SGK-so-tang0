# tarix7_metodika – Sách giáo viên Sử 7

**Đặc tính:** 224 trang, có lớp chữ, uz Latin. Phần A (tr.3–36) là lý luận và thư viện phương pháp tương tác (FSMU, Aqliy hujum, Arra, Insert, Venn…), kèm mẫu "texnologik xarita". Phần B (tr.37–220) có **30 mục khớp 1:1 với 30 bài sách học sinh**. Mỗi mục gồm tiêu chí đánh giá, **TEST** (khoảng 460 câu, đáp án **in đậm**), **TARIXIY HUJJAT** (tư liệu có chú giải), có khi thêm LOYIHA ISHI và QR phim. Giáo án đầy đủ (ba loại mục tiêu, phương pháp, tiến trình chia phút) chỉ có ở 3/30 bài (tr.37, 40, 71–76).

**Tầng 0 thiếu:**
1. Schema `lesson_plan` và `assessment_criteria`. `$defs/teacher` hiện không có chỗ cho nội dung sư phạm. Mọi trường phải tuỳ chọn.
2. Liên kết sách GV với sách học sinh (`student_ref{lesson, pages}`) và **chế độ đọc "giáo án"**: chọn bài → giáo án + ngân hàng test + nút giao cho lớp.
3. Tách đáp án theo font in đậm, có bước người duyệt. Nhãn phương án lẫn A/B/D/E và A/B/C/D, có lỗi nhãn (tr.131, 133).
4. `ex.choice_coded_combo` (đáp án dạng "1, 2, 4, 5", "1-a, 2-b") đổi sang choice_multi/order/match_pairs.
5. `source_document`, `method_library` (`method.*`), `media.external_video` cho QR, và gia sư vai trò trợ lý soạn giáo án.

**Chế độ:** chế độ mới *giáo án* trên dữ liệu cấu trúc; trang gốc để đối chiếu.

**Rủi ro:** tách đáp án sai, link QR chết, bản quyền bản dịch tư liệu cổ, khuôn giáo án không đều giữa các bài.
