# BÁO CÁO bước ④ – kimyo8

**Xong khi: ĐẠT.** `doi-chieu.json`: 61 dòng, tổng lệch 0, `tu_che` 0. Mọi nội dung đều biểu diễn được bằng tầng 0 v0.9.0.

**Số liệu (cũ = mới):**
- 208 trang; ảnh uz 208, ru 208 (`@ru_pages`); OCR ru 2.232 đoạn
- 1.378 vùng dịch; 610 ghim
- 403 bài tập: 315 bài SGK (425 ý, 213 đáp án, 425 lời giải), 44 quiz (220 câu), 19 order, 25 sort
- 74 hình (375 điểm); 133 video (754 cảnh, 754 clip vi)
- 7 chương; 133 chủ đề; 400 thuật ngữ

**Kiểm tra (`_work/*.out`):**
- Hai file JSON hợp lệ theo schema 2020-12.
- 17 id `ex.*`/`sim.*` có trong thư viện; 88 giá trị trục có trong từ điển.
- 2.460 ghim và tham chiếu trỏ đúng. Hash khớp, id bền.
- Gia sư: 12 lời nhắc, 0 lỗi.
- Playwright: 11 ảnh 390×844, không lỗi console, không cuộn ngang.

**Chỗ hở (tu-che.md):**
- (A) Đầu đọc thiếu `ex.order` và 10 cảnh hóa học, nên 519/754 cảnh chưa có hình.
- (B) Quy tắc id chưa phủ 9 bài trùng số và 43 hình không số.
- (C) db `media/` và localStorage chưa chuyển.
- (D) Lệch params `scene_page_image`; `kiem-tra.py` báo nhầm ký tự `@` trong OCR.

**Rủi ro:**
- Video gần như chỉ còn thuyết minh cho tới khi có renderer hóa học.
- Video thật của GV vẫn nằm trên db cũ.
- `ru_pages.url` còn null.
- Bản xem trước nặng 3,3 MB.
