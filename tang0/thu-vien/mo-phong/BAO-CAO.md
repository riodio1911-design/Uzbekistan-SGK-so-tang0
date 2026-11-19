# Báo cáo – C. Thư viện mô phỏng (v0.9)

**Đã làm:** đọc 7 bản kiểm kê, phân tích mã (`V`, `openModel`, `__DRAW`, `ACT`, `VK`, `openDemo`, `story`, `fxOpen`/`openFig`), đếm cảnh từ `TP`/`DM`. Kết quả: `danh-muc.json` gồm 57 mục `sim.*`; `bang-anh-xa.csv` gồm 173 dòng (65 dòng mã thừa, 15 dòng ngoài phạm vi chuyển sang `ex.*`); `README.md`.

**Xong khi: đạt.**
- Cả 57 mục đều có `params` (tổng 200 tham số, miền giá trị và mặc định lấy từ mã), `reusable_for` và `sources`.
- Mọi `sim_id` trong bảng ánh xạ đều có trong danh mục.
- Video dựng bằng mã đã chia thành 3 khung phát và 9 kiểu cảnh chung, cộng các cảnh có tham số của Hóa, Lý, Toán. Số cảnh đã đếm cho cả 7 cuốn.

**Cần quyết ở D2:**
1. Có chốt 3 chế độ `scene`/`interactive`/`player` không? Theo đó một hàm dùng cho cả cảnh video lẫn mô hình, như matematika5 đang làm.
2. Chuẩn cảnh: dữ liệu JSON (họ A) hay hàm `draw`? Đề xuất chọn JSON.
3. Duyệt các cặp đã gộp: `figure_explorer`, `germination_lab`, `sound_vibration`, `magnet_lab`.
4. Giá trị `axes` cho trục 3 và 6 cần thống nhất với Schema.
5. Mức tham số hóa cho 19 mô phỏng KHTN, hiện đang viết cứng nội dung.

**Rủi ro:**
- Số cảnh vẽ tay của tabiiy5 (~42) chỉ là ước lượng.
- Nhãn và tỉ lệ ảnh trang viết cứng trong mã.
- `ru` của ACT phụ thuộc `RUDICT`.
- Tên uz/ru của các mục chưa có người bản ngữ duyệt.
