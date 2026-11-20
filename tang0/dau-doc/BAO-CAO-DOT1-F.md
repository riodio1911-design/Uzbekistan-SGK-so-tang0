# Báo cáo đợt 1 – F (Mô phỏng Toán–KHTN; đề xuất 005, 007)

**005 – xong.** 7 renderer gốc `components/sim/{place_value,decimal_shift,fraction_model,fraction_area,triangle_area,cuboid_volume,ratio_bars}.js` + `math_kit.js`; chạy cả dạng mô hình (`mode:interactive`, thanh trượt/nút) và cảnh video. Chữ cố định uz (PVN, "Raqamlar chapga", "Surat/Maxraj", "Bir qavatda…") thành chuỗi uz/ru/vi (`T0.mathKit.UI`).
**007 – bước 1 xong, bước 2 một phần.** Gốc: `predict_check.js`, `virtual_microscope.js`, `germination_lab.js` (wb1.sim, số liệu từ params). Tạm (D3, cờ `ma_cu_nhung_tam`): `legacy_embed.js` chạy 26 ACT (gồm types92) + 88 cảnh `draw()` trong iframe sandbox từ gói sinh `legacy/tabiiy5.js` (`_sinh-tabiiy5.py`); ru lấy từ RUDICT + `params.text`.

| cuốn | mô phỏng chưa hỗ trợ trước → sau | cảnh trước → sau |
|---|---|---|
| matematika5 | 33 → 0 | 76 cảnh toán → 0 (65 khung còn lại = ảnh trang thiếu trong bản thử, không phải kind) |
| tabiiy5 | 26 → 0 | 88 khung "chưa chuyển" → 0 (114 iframe) |
| biologiya5 | 2 → 0 | 0 |

Kiểm tra (`_thu/F/dem.js`, `thu-bt.js`, ảnh `_thu/F/_anh/`): 0 lỗi console, không cuộn ngang 390/820; chạm ≥44 px; uz/ru/vi; tối (`m5-scenes-vi-dark.png`); predict_check đúng 3/3, sai 2/3; germination đúng/sai; lab13 trong iframe chạy được; cảnh vẽ tay ru (`t5-draw-ru.png`).
**Yêu cầu đã gửi** (YEU-CAU.md): A – cờ trục 9, `sim.legacy_embed` + `ui_strings` vào thư viện; D – chỉ gộp gói mã cũ vào dist tabiiy5; B – thông báo sửa nhỏ scene_custom_draw. Không có yêu cầu gửi F.
**Còn lại (đợt 2):** viết renderer gốc cho 22 kind tabiiy5 và chuyển 88 cảnh sang JSON/SVG, rồi gỡ gói mã cũ.
