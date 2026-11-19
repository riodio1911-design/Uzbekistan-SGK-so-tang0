# Báo cáo bước ④ – biologiya5

**Xong khi: ĐẠT** (dữ liệu). Bản xem trước chỉ mở được lớp bài học, vì đầu đọc thiếu renderer trang in chữ sống (TC01).

**Kiểm tra**
- `book.json` và `features.json` hợp lệ (jsonschema 2020-12).
- 7 `ex.*` và 8 `sim.*` đều có trong thư viện; 924 tham chiếu nội bộ và 301 `pins[].ref` không hỏng; không id trùng/theo vị trí.
- Gia sư: điền thử bằng profile, 12 lời nhắc, 0 lỗi.
- Playwright 390×844: 6 ảnh (l1, l3, l4; uz/vi/ru), 0 lỗi console, không cuộn ngang.

**Đối chiếu** (`doi-chieu.json`): 50 dòng, tất cả lệch = 0. Số cũ đếm bằng `drawPage` cũ trong Chromium.
- 96 trang, 1.025 vùng dịch, 14.467 dòng chữ, 301 ghim.
- 173 bài tập: 90 câu mcq, 15 sort, 3 order, 114 câu mở, 14 bảng, 8 đố nhãn, 1 Redi.
- 83 hình, 400 điểm; 67 video, 213 cảnh; 331 clip × 3 thứ tiếng; 35 thuật ngữ; 243 file.

**Tự chế** (`tu-che.md`)
- Đầu đọc thiếu: trang background + text_lines ở chế độ nền (TC01); 4 renderer bài/mô phỏng và 4 renderer cảnh VK (TC02); ghim `link` (TC03); `steps`/clip trong khối text (TC04a).
- Schema thiếu: cờ điểm `added` (89 điểm), `aspect`, `need` dạng mảng.
- Bỏ có lý do: 1.200 khóa audio fx (file không còn), RUDICT, mã ACT thừa.

**Rủi ro**
- `pg/` là ảnh bản Nga đã xoá chữ (12 trang trắng).
- ru thuật ngữ từ RUDICT, chưa duyệt.
- GV chấm (D2) chưa thử thật.
