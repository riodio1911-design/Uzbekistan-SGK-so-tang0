# Informatika 5 — tóm tắt kiểm kê

**Họ bộ máy:** A, tức ghim trên trang gốc. Sách có 176 ảnh JPG, 1465 vùng chạm để xem bản dịch uz/vi/ru và 374 ghim màu mở modal. Ngoài ra có thêm một lớp **màn hình mô phỏng** dành riêng cho môn Tin.

**Đặc trưng nhất:** 81 demo thao tác máy tính được viết bằng JSON (`window.DM` cùng các mẫu màn hình `window.DEMO_STG`). Demo trải trên 9 "stage" (Word, Paint, Excel, Scratch, web, mail, desktop, chuột, bàn phím) và có con trỏ động, gõ phím, kéo khối Scratch, vẽ hình và vẽ biểu đồ. Giáo viên có thể thay demo bằng video thật: link hoặc tải lên qua `assets`, lưu dùng chung qua `db` collection `media`, quyền sửa xác định bằng `user.canEdit`.

**Nội dung khác:**
- 41 "video" là trình chiếu cảnh (301 cảnh). Lời thuyết minh tiếng Việt lấy từ MP3 sprite (760 đoạn, 13.9 MB); uz/ru đọc bằng speechSynthesis.
- 140 câu trắc nghiệm.
- 28 hoạt động: 14 sắp thứ tự, 11 phân loại thẻ, 3 bảng tính mini có công thức.
- 230 mục bài tập: 215 mục mở, có lời giải mẫu và không chấm; 15 mục chấm tự động.
- Robo có hai vai: gợi ý trong bài tập (`modelTier:'quick'`) và trợ lý chat nổi có tools mở bài và nhắc việc. Cả hai đọc `BOOK_PROFILE`.

**Nên đưa vào tầng 0:**
1. Screen-demo player cùng định dạng kịch bản DM.
2. Cơ chế giáo viên thay media (db/assets/user).
3. `window.__AU`, trình phát MP3 sprite có dự phòng TTS.
4. Bộ đọc trang có vùng dịch và ghim.
5. `nrm()`/`right()` để chấm đáp án ngắn.
6. Hai dạng order/sort, MCQ và bảng tính mini `sheetVal`.
7. Robo (`ROBO_HOST`).

**Rủi ro / mã thừa:**
- `V()`/`openModel()` còn nguyên nhánh trực quan Toán (pv, shift, frac, area, tri, cuboid, ratio), rõ ràng chép từ cuốn Toán và không dùng ở đây.
- Khóa localStorage `gul:done` mang tên của cuốn khác.
- Robo tìm các block `think`/`workbook` mà cuốn này không có, nên nhánh đó không bao giờ chạy.
- Robo không chọn được tiếng uz.
- Kết quả làm bài chỉ lưu ở localStorage, giáo viên không xem được.
- Không có tính năng giáo viên giao bài.
- Tổng dung lượng 44.7 MB, trong đó 28.9 MB của pages/ là số ước lượng.
