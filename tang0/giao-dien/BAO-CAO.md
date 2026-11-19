# Báo cáo F. Giao diện

**Đã làm:** Trích CSS và JS (đã bỏ base64) của 7 cuốn. Xác nhận có 3 bộ biến: A ghim (4 cuốn, 16 biến, giống hệt nhau), B bài học (2 cuốn, 23–25 biến), C đọc văn (20 biến + `--lh`). Tạo `tokens.json` (103 token, thang chữ 6 cấp tuổi, 2 preset màu theo môn), `tokens.css` (sinh từ JSON), `bang-anh-xa.csv`, `mau-viet-cung.csv` (95 màu đang viết cứng, chủ yếu màu ghim), `xem-truoc.html` và README.

**Tiêu chí "Xong khi": đạt.** 137/137 cặp (cuốn, biến) có token thay thế, trong đó có 2 biến được dùng nhưng không định nghĩa (`--blue-ink` ở bộ A, `--lh` ở C). Script đã kiểm tra mọi `token_moi` đều có trong tokens.json. Đã chụp xem-truoc bằng Playwright ở 1280px và 390px, với cả preset blue/5_7, teal/8_9 và 0_2: không lỗi JS, không cuộn ngang, giá trị token đọc lại khớp ở cả hai chế độ.

**Cần nhóm quyết ở D2:**
1. Màu ghim vở bài tập: #0E8A8A hay #6A3FB5 (màu sau gần trùng quiz).
2. Màu ghim quiz: tím, hay crimson như adabiyot5.
3. Có đặt màu nhấn riêng cho từng môn không.
4. Chọn một cách nạp font.
5. Thang chữ cho cấp 0_2, 3_4, 10_11 và giáo viên: hiện chỉ là `de_xuat`, chưa cuốn nào có.

**Rủi ro:**
- Đổi mặc định sang giá trị bộ B làm bộ A lệch nhẹ màu nền, bo góc 10→14px ở C.
- `--hue-purple` ở chế độ tối có tương phản 2.3.
- Ghim hiện có (15–28px) nhỏ hơn vùng chạm 44px.
- Thực tế lớp 5 và lớp 8 đang cùng cỡ chữ, nên thang theo tuổi chưa được kiểm chứng.
