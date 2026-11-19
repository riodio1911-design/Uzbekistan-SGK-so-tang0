# Biologiya 5: kiểm kê

**Họ bộ máy:** lai. Chế độ mặc định là **trang in chữ sống** (#p1): ảnh trang pg/ cộng lớp chữ dựng lại từ `window.PG` theo bố cục sách tiếng Nga, xem được bằng chữ Nga gốc hoặc chữ Uzbek đổ vào cùng hộp. Trên trang có ghim: hình, video, bài tập tư duy, test, câu hỏi. Song song là bản **bài học dựng lại** (#l1–#l18) từ `window.BOOK`: 3 chương, 18 bài, mọi chuỗi có đủ {uz,vi,ru}.

**Điểm đặc trưng**
- 83 hình có **trình khám phá điểm nóng** (400 điểm, có tự tua, giáo viên sửa được).
- 67 video hoạt hình SVG theo cảnh (213 cảnh), lời MP3 bằng 3 thứ tiếng.
- 90 câu trắc nghiệm, 18 bài phân loại/sắp xếp, 114 câu hỏi mở có nút "Robo nhận xét" (`sample`).
- Có kính hiển vi ảo và thí nghiệm Redi.
- Chế độ giáo viên ghi vào db `edit`: ẩn/hiện, sửa quiz, sửa hình, thay video (link hoặc tải lên).

**Nên đưa vào tầng 0:** `drawPage`/`pageLegend` (trang in chữ sống), `fxOpen`/`fxEdit`, `Speaker`+`Queue`+SPRITE, `Player`+`VK`, `GACT`/`sorter`, lớp giáo viên `commit`/`applyOvr`, Robo (`ROBO_HOST` + `BOOK_PROFILE`), lớp ngôn ngữ `tx`/`DUAL`.

**Rủi ro / mã thừa**
- ~71 MB audio `fx-*.mp3` (lời đọc cho 400 điểm) không có mã nào phát.
- 32/34 hàm `ACT` chép từ Tabiiy fanlar 5 không được dùng, vài hàm trỏ tới ảnh không tồn tại. `V.v1–v6` vẽ hoa bị ghi đè. Có `mountFlower`, `window.WB` và tiền tố `gul:`.
- RUDICT có 3236 mục, ước khoảng 77% không khớp nội dung cuốn này (không chắc).
- Getter `Object.prototype.ru` sửa prototype toàn cục.
- Phần trợ giúp của Robo đã lỗi thời (thiếu RU, mô tả màu ghim sai).
- Mã gọi `user` nhưng artifact không khai báo capability này, nên chế độ giáo viên có thể không hiện (không chắc).
- Kết quả học sinh chỉ lưu trong localStorage, giáo viên không nhận được.
