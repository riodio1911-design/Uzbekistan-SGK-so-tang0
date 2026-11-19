# 010 – Chế độ trang cho trang dựng lại chữ và nền xóa chữ

**Ưu tiên:** P0 · **Độ khó:** vừa · **Phụ thuộc:** [018](018-hinh-hoc-trang-va-chu-in.md) · **Số chỗ thiếu thô gộp vào:** 3

## Thay đổi gì
- `modes/pin.js` nhận trang có `background` + `text_lines` (không có `images`): dùng lại bộ vẽ SVG của `modes/reading.js`, đổi uz/ru trong cùng hộp chữ.
- Vùng dịch khớp tọa độ theo `profile.edition.layout_from` (không chỉ `lang_base`).
- Ghim `text_anchor`: ẩn khi trang có `text_lines`, hoặc phát clip theo `reading.anchors[].target`.
- Lớp đọc văn đọc cả khối `prompt` (pre/think/talk/task) và câu hỏi trong bài tập.
- `features.layers.default_view` cho phép `trang_goc_ghim` với loại trang này.

## Vì sao + bằng chứng
biologiya5 TC01: "chế độ Trang không hiện" – 96 trang, 14.467 dòng, 301 ghim; bản xem trước phải mở lớp bài học. adabiyot5 DD-3 (1.432 chấm "missing", ảnh `1-ghim-trang8.png`), DD-4 (pre/think/talk/task không nghe được; bản cũ có).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** biologiya5, adabiyot5
- **Loại sách mới:** Mọi sách phải dựng lại chữ vì nguồn xấu: onatili3_metodika (lớp chữ mất "i"), chizmachilik8 (chữ thành vector), sách có watermark (021).
- **Mở khóa:** 96 trang biologiya5 ở chế độ nền; 1.432 điểm chạm adabiyot5 hoạt động đúng.
- **Nguồn đã nêu chỗ thiếu này:** adabiyot5, biologiya5

## Tương thích ngược
Có. Chỉ mở rộng đầu đọc; dữ liệu đã có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P0
- Phụ thuộc: [018](018-hinh-hoc-trang-va-chu-in.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 42 | biologiya5 | che_do_doc | TC01 trang chữ sống ở chế độ nền | pin.js chỉ nhận trang có images; trang background + text_lines không hiện, vùng dịch chỉ khớp khi bản in = lang_base |
| 67 | adabiyot5 | che_do_doc | DD-3 ghim text_anchor | Chế độ trang gốc vẽ mọi text_anchor thành chấm "missing" |
| 68 | adabiyot5 | che_do_doc | DD-4 đọc văn bỏ qua prompt | Chế độ đọc văn chỉ đọc text/prose/poem, bỏ qua pre/think/task |
