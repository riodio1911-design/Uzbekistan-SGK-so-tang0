# Kimyo 8 (Hóa học lớp 8) — kiểm kê

**Họ bộ máy:** A (ảnh trang gốc + ghim), kèm "video" hoạt hình dựng bằng mã cho từng bài. HTML 2,8 MB, không có base64. Có 422 file đi kèm, tổng ~118 MB: 208 trang UZ, 208 trang bản Nga, 5 MP3 sprite tiếng Việt.

**Đặc trưng nhất**
- Có bản in tiếng Nga song song: ảnh `pages_ru/` và OCR `window.RUTXT`. Có nút đổi UZ ↔ RU.
- 133 chủ đề `TP` gồm 754 cảnh. Cả 754 cảnh đều có thuyết minh MP3 tiếng Việt (~107 phút).
- Thư viện hoạt hình hóa học có tham số: `cReact`, `cMol`, `cShell`, `cIonic`, `cTube`, kèm parse công thức và kiểm tra cân bằng phương trình.
- Bài tập: 315 bài, 425 ý. 213 ý tự chấm, 212 ý tự luận có lời giải mẫu. Ngoài ra có 220 câu quiz và 44 hoạt động sắp xếp/phân loại.
- Robo dùng `sample` và đọc `BOOK_PROFILE`. Robo trò chuyện được (có tool `open_lesson`, `add_reminder`), gợi ý bài tập và nhắc việc.
- Giáo viên có thể thay video hoạt hình bằng video thật theo từng thứ tiếng (`db` media + `assets`).

**Nên đưa vào tầng 0**
- Trình xem trang có ghim và lược đồ `PG`/`TP` ba thứ tiếng.
- Bộ chấm `nrm`/`right`.
- Trình phát cảnh + `__AU`.
- `openQuiz`/`openModel(order|sort)`, `openFig`.
- Robo (đã tách qua `ROBO_HOST`).
- `__VM` để thay video.
- Thư viện `__DRAW` hóa học.

**Rủi ro**
- Nhiều mã chết chép từ cuốn khác: hình Toán/Tin (`pv`, `frac`, `sheet`, `blocks`…), hàm vẽ Lý (`pCircuit`, `pField`, `pElectro`), `window.DM`, `#mini`, `workbook`.
- Tiến độ quiz lưu dưới khóa `gul:done`, lệch tiền tố `kim8.`.
- Kết quả học sinh chỉ nằm trong localStorage, giáo viên không xem được.
- Audio chỉ có tiếng Việt.
