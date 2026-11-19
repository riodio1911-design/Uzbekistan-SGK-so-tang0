# 005 – Renderer 7 mô phỏng Toán và chuỗi đa ngữ của chúng

**Ưu tiên:** P0 · **Độ khó:** vừa · **Phụ thuộc:** [012](012-ky-phap-toan-noi-dong.md) · **Số chỗ thiếu thô gộp vào:** 2

## Thay đổi gì
- Component cho `sim.place_value`, `sim.decimal_shift`, `sim.fraction_model`, `sim.fraction_area`, `sim.triangle_area`, `sim.cuboid_volume`, `sim.ratio_bars`; mỗi cái chạy được ở 2 dạng: mô hình tương tác (`simulations[]`) và cảnh video (`visual.kind`).
- Đưa chữ cố định tiếng Uzbek trong mã cũ (`PVN`, "Raqamlar chapga", "Surat/Maxraj", "Bir qavatda … kub") vào `ui_strings` đa ngữ của thư viện mô phỏng.

## Vì sao + bằng chứng
matematika5 DT1: 33/33 mô hình và 76 cảnh (ratio_bars 19, fraction_model 15, cuboid_volume 15, triangle_area 10, decimal_shift 8, place_value 6, fraction_area 3) hiện "Chưa hỗ trợ" (ảnh `m5-model-t8-vi.png`). DT6: chữ cố định uz.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** matematika5
- **Loại sách mới:** Toán lớp 1–6 (phân số, giá trị chữ số, diện tích, thể tích).
- **Mở khóa:** 33 mô hình + 76 cảnh; matematika5 hết cảnh thiếu (cùng 001).
- **Nguồn đã nêu chỗ thiếu này:** matematika5

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P0
- Phụ thuộc: [012](012-ky-phap-toan-noi-dong.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 9 | matematika5 | dau_doc_renderer | DT1b 7 sim toán | sim.place_value, decimal_shift, fraction_model, fraction_area, triangle_area, cuboid_volume, ratio_bars chưa có renderer |
| 14 | matematika5 | dau_doc_renderer | DT6 chuỗi cố định uz trong mô phỏng | PVN, "Raqamlar chapga", "Surat/Maxraj"… cần đa ngữ khi viết renderer |
