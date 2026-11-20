# Báo cáo đợt 1 – E (Mô phỏng Hóa–Lý–Tin)

**Xong:** 004 (10 kind Hóa–Lý + 8 cảnh cố định) và 006 (`sim.screen_demo` + preset thư viện, `sim.spreadsheet_mini`). `ex.spreadsheet` do C làm, E không đè.

**"Chưa hỗ trợ" trước → sau** (`node _thu/E/dem.js`, book.json thật):
- kimyo8: 120 → 0
- fizika8: 183 → 0
- informatika5: 93 → 0 (81 demo, 12 cảnh bảng tính)

Không có SVG rỗng, không lỗi console. 55/55 phương trình cân bằng. 81/81 demo chạy hết 1.426 bước không lỗi.

**Kiểm tra** (`node _thu/E/chup.js` → `_thu/E/ket-qua.txt`, ảnh `_thu/E/_anh/E-*.png`): đạt 17/17.
- 14 ảnh: điện thoại 390 và máy tính bảng 820; uz, ru, vi; 3 ảnh tối.
- Không cuộn ngang. Nút demo ≥ 44px. Đổi ngôn ngữ thì chú thích đổi theo.
- Bảng tính: sửa ô B1 = 10 thì ô kết quả ra 16. Đổi fx sang MAX thì ra 10. `=alert(1)` trả `#NAME?`.

**Cách làm:**
- Logic vẽ giữ như bản cũ; chữ lấy từ params.
- Tiêu đề và chú thích hiện bằng HTML, nên đọc được trên điện thoại.
- Có tôn trọng prefers-reduced-motion.
- Hình khuất màn hình thì dừng hoạt hình.
- Bấm vào hình để phát lại. Phân tử: kéo ngang để xoay.

**Yêu cầu đã gửi** (YEU-CAU.md):
- A: khai báo preset và `stage_def` trong danh-muc/schema; sửa ghi chú `cReact0`.
- D: build.py chạy `sinh-preset.py`.
- C: gộp 2 bộ tính bảng tính.

**Đã nhận:** C → E (`ex.spreadsheet` thuộc C).

**Còn lại:**
- Thay demo bằng video thật của giáo viên (TC02).
- Chữ trong màn hình demo nhỏ khi xem ở khổ 390.
