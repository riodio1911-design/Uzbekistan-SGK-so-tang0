# Kiểm kê · tabiiy5 (Tabiiy fanlar 5 – bản "Trang gốc")

**Đặc trưng.** Thuộc họ lai A+B. Giao diện chính là ảnh 142 trang SGK, có 387 điểm chạm `HOT` ghim lên trang, chia theo loại: audio, video, act, quiz, skills, flower, term, wb. Khi chạm vào một điểm, sách mở modal để vẽ khối bài học dựng lại từ `window.BOOK` (10 chương, 23 bài). Cuốn có 32 hoạt động/mô phỏng `ACT`, như nảy mầm, mô hình hạt, lực, âm thanh (WebAudio), nam châm, vòng tuần hoàn nước, dầu tràn, mùa và Mặt Trăng. Có 26 "video", thực chất là hoạt hình SVG vẽ bằng JS, kèm thuyết minh MP3 bằng 3 thứ tiếng uz/vi/ru phát theo sprite. Vở bài tập 10 chương có 2 chế độ: lớp ô nhập phủ trên ảnh trang (`WBGEO`) và bản tương tác. Vở có khoảng 20 kiểu bài, chấm tự động; Robo chấm câu tự luận qua `sample` (modelTier `quick`). Kết quả bài làm xuất được ra HTML qua `downloads`.

**Nên đưa vào tầng 0.**
- Lớp ngôn ngữ: `tx/T/DUAL` và `RUDICT` + `ruOf`. Ngôn ngữ thứ 3 được thêm bằng từ điển, không phải sửa dữ liệu.
- `Speaker`/`Queue`/`SPRITE`: audio sprite đa ngữ.
- Trình xem trang gốc cùng `HOT`, ngăn dịch và ảnh thu nhỏ trang.
- Khung `Player` + `VIDEOS` cho video hoạt hình có thuyết minh.
- `__VM`: giáo viên thay video thật theo từng thứ tiếng (db `media/` + assets + `user.canEdit`).
- Robo đã tách qua `ROBO_HOST`: đọc `BOOK_PROFILE`, có công cụ mở bài và nhắc việc.
- Engine vở bài tập: `RENDER`/`grade`/`accept`/`renderPaper`.

**Rủi ro.**
- `audio/` (~84 MB) không được mã nào dùng. Nên xóa: tổng dung lượng xấp xỉ 231 MB sẽ giảm khoảng 36%.
- Còn mã thừa từ bản "Sách số": `viewHome`, `viewLesson`… không được gọi, và có hàm rỗng.
- Khóa lưu `gul:` mang tên chương 1. Hướng dẫn của Robo chưa nhắc RU.
- `Object.prototype.ru` là getter toàn cục, có rủi ro xung đột.
- Bài làm chỉ lưu localStorage, không có giao bài hay xem kết quả từ phía giáo viên.
- 13 ảnh không thấy tham chiếu.
- Số MB của `pages/`, `wbpages/`, `img/` là ước tính.
