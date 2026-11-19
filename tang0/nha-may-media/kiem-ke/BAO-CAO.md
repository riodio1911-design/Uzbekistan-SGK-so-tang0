# BÁO CÁO M1 – Kiểm kê media

**Đã làm:** liệt kê file 7 artifact (bản hiện hành, sau đợt gỡ 6/11); lấy dữ liệu thật bằng `dump.js`. Kết quả: `media-hien-co.csv`, `nhu-cau.json` (7.405 điểm, id = khóa clip trong mã), `tong-hop.csv`. Chạy lại bằng `_scripts/build.py`, `_scripts/csv_out.py`.

**Số liệu**
- Mỗi ngôn ngữ 6.910 điểm âm thanh; thêm 495 video dựng bằng mã.
- Đã có bản thu: uz 1.715, vi 4.474, ru 1.715. Họ A: uz/ru của 2.759 điểm chỉ có giọng trình duyệt.
- Cốt lõi cần TTS (ước lượng): uz ≈504 phút, ru ≈511 phút, vi ≈70 phút. Mở rộng (1.963 điểm hình khám phá): thêm 230–300 phút mỗi ngôn ngữ.
- Tốc độ đọc đo từ clip có sẵn: uz 754, vi 861, ru 703 ký tự/phút.
- Không còn đoạn thừa. biologiya5 còn 1.200 khóa `fx` trỏ tới file đã gỡ.

**Cần duyệt ở D2**
- Có tính hình khám phá là nhu cầu thật không (mã chưa phát)?
- Bitrate: thêm uz+ru ở 64 kbps thì kimyo8 +143 MB, fizika8 +158 MB, cả hai vượt 256 MB. Sprite vi hiện có chỉ khoảng 32 kbps.

**Rủi ro**
- Chữ ru của tabiiy5 lấy qua RUDICT, có thể rơi về chữ uz.
- Ký tự ru của thuật ngữ và MB ảnh trang của vài cuốn là ước lượng.
- HTML cục bộ của biologiya5/adabiyot5 khác bản live 6 byte.
- Bài tập chưa tính, trừ 143 câu hỏi của adabiyot5.
