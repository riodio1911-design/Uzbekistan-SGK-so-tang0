# Báo cáo bước ④ – tabiiy5

**Xong khi: ĐẠT.** Toàn bộ trang, bài tập và media của cuốn cũ đều có trong `book.json`, hoặc được ghi ở `tu-che.md`. Ở `doi-chieu.json`, 59/60 dòng có lệch = 0. Dòng còn lại là 3 chuỗi chưa có ru, vì RUDICT không có khóa cho chúng (bản cũ cũng chỉ hiện uz).

**Số liệu cũ = mới:**
- Trang: 142 trang SGK và 117 trang vở.
- Ghim: 387.
- Nội dung bài: 10 chương, 23 bài, 251 khối.
- Bài tập: 314 bài, gồm 64 bài SGK (81 câu quiz) và 250 mục vở.
- Đáp án: 165 (SGK) và 390 (vở), cộng 77 regex dự phòng.
- Ô trên trang vở: 915 ô, trong đó 877 ô vào `fields`, 38 ô tự chế.
- Media:
  - Video: 26 video, 136 cảnh.
  - Clip audio: 281 clip cho mỗi thứ tiếng uz/vi/ru, cả 843 clip đều có `source_hash`.
  - Thuật ngữ: 85.
  - Tệp: 449, giữ nguyên đường dẫn cũ.
- Bản dịch ru: 3362/3365 chuỗi lấy từ RUDICT (tra theo khóa uz rồi đến khóa vi).

**Kiểm tra đã chạy:**
- `book.json` và `features.json` hợp lệ theo schema 2020-12.
- Có 0 tham chiếu hỏng và 0 id theo vị trí. 18 `ex.*` và 29 `sim.*` đều có trong thư viện. Các giá trị trục đều có trong từ điển.
- Gia sư: 12 lời nhắc, 0 lỗi.
- Playwright: 5 ảnh chụp ở khổ 390×844, 0 lỗi console, không cuộn ngang.

**Tự chế:**
- TC01: 27 mô phỏng còn giữ logic trong mã.
- TC02: 88 cảnh video vẽ tay.
- TC05: ô khoanh tròn.
- TC06: thuyết minh của clip là chuỗi ghép.
- TC03, TC04, TC07–TC10: các mục nhỏ, xem `tu-che.md`.

**Rủi ro:**
- Đầu đọc còn thiếu nhiều phần:
  - 13 dạng bài tập (110 bài).
  - 22 kind mô phỏng.
  - Lớp ô trên trang vở.
  - Ghim skills và term.
- Artifact hiện tại không còn thư mục `audio/`, gồm 450 tệp, khác con số 480 trong kiểm kê.
- Tệp `sim/flower.svg` không có trong artifact cũ. File này lấy từ `tang0/dau-doc/mau`.
