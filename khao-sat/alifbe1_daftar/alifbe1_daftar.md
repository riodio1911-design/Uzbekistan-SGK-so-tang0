# alifbe1_daftar – Alifbe. Ijod daftari lớp 1 (Novda 2026)

**Xác nhận tên:** cuốn này **không phải "Yozuv daftari"**. Bìa và lời nói đầu (trang 1, 3) ghi "Ijod daftari", tức vở sáng tạo gồm trò chơi chữ, tô màu và vẽ. Có phần tô **chữ in** (2–4 dòng ở trang mở đầu mỗi chữ: chấm đỏ đánh dấu điểm bắt đầu, nét chấm, nét đơn giản như "/" của Z, rồi chép từ ngắn). Không có chữ viết nối. Vở tập viết thật là một cuốn khác.

**Đặc tính:** vở đi song song 1–1 với 44 tiết của sách, mỗi tiết một trang, in trên nền ô li vuông. Có 21 chỗ dán nhãn (tờ nhãn không có trong PDF). Không có QR/audio. Bản mẫu 47/64 trang, có lớp chữ.

**Năm chỗ tầng 0 thiếu quan trọng nhất:**
1. `ex.letter_trace`: cần dữ liệu nét chữ (đường đi, điểm đầu, thứ tự, hướng) và canvas tô có đường mẫu. Chấm tự động theo độ lệch so với mẫu (`do_khop_net_chu`), giáo viên duyệt.
2. `ex.color_by_rule`: tô vùng trên tranh nét đã vector hóa, theo mã màu hoặc theo luật âm tiết mở/đóng.
3. Bàn phím chữ cái có tiếng: chỉ hiện chữ đã học, o‘/g‘/sh/ch là một phím. Cần cho mọi bài "yozing" vào ô.
4. Các trò chơi chữ: `ex.letter_discrimination` (chữ lật gương, mê cung, gạch chữ), `ex.word_search`, `ex.dot_to_dot`, `ex.word_from_letters` (chấm theo từ điển uz).
5. `ex.sticker_place` cùng bộ nhãn dán số, và `pre_reader_mode` (đọc to mọi lời dặn).

**Chế độ:** làm lớp "workbook" gắn theo tiết của cuốn alifbe1_darslik. Nền là ảnh trang + ô tương tác, bật chế độ tiền đọc.

**Rủi ro:** bản quyền nhãn dán và tranh nét của Novda. Vector hóa tốn công. Tô bằng ngón tay khác cầm bút.
