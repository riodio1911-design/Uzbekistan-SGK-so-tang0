# 018 – Kích thước trang, tỉ lệ ảnh, font in, meta OCR

**Ưu tiên:** P1 · **Độ khó:** thấp · **Phụ thuộc:** Không · **Số chỗ thiếu thô gộp vào:** 8

## Thay đổi gì
- `profile.volumes[].page_px: [w, h]` (thay hằng viết cứng); `sim.scene_page_image.page_aspect` lấy từ đây.
- `block.aspect`, `figure.aspect`, `gallery[].aspect` (số, tùy chọn).
- `print_text.fonts: ["Nunito","Arimo","Literata"]` (chỉ số `styles[0]` → họ font; font là woff2 đi kèm theo D2 U4).
- Mô tả `split_paragraphs`: đơn vị là "chỉ số từ của `lang_base`".
- `pages[].ocr_meta: {source: "ocr|pdf_text|manual", reviewed: bool, note: i18n}`.

## Vì sao + bằng chứng
matematika5 TC7 (1241×1635), tabiiy5 TC09 (1100/1451), fizika8 TC-3 (1241×1879, 311 cảnh); biologiya5 TC05 (83+10 `ar`), TC07 (70 trang `fr`); tabiiy5 TC08 (7 `wide`); adabiyot5 TC-07 (33 kiểu font); fizika8 TC-5 (cảnh báo OCR 175 trang).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** matematika5, tabiiy5, biologiya5, adabiyot5, fizika8
- **Loại sách mới:** Mọi sách (chizmachilik8 raster 150 ppi, musiqa5 100 ppi cần ghi kích thước gốc).
- **Nguồn đã nêu chỗ thiếu này:** adabiyot5, biologiya5, fizika8, matematika5, tabiiy5

## Tương thích ngược
Có. Mọi trường tùy chọn.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P1
- Phụ thuộc: Không

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 7 | matematika5 | schema | TC7 profile.page_aspect | Tỉ lệ ảnh trang 1241×1635 viết cứng trong mã, schema không có trường |
| 33 | tabiiy5 | schema | TC08 gallery[].wide/aspect | Cờ wide của ảnh gallery bị bỏ |
| 34 | tabiiy5 | schema | TC09 volumes[].page_aspect | PAGE_AR = 1100/1451 viết cứng |
| 50 | biologiya5 | schema | TC05 figure/block.aspect | Tỉ lệ khung ảnh ar bị bỏ |
| 52 | biologiya5 | schema | TC07 đơn vị split_paragraphs | PG.fr là tỉ lệ, schema đòi số nguyên; đổi sang chỉ số từ |
| 63 | adabiyot5 | schema | TC-07 print_text.fonts | Bảng chỉ số font → họ font (Nunito, Arimo, Literata) chưa có chỗ |
| 97 | fizika8 | schema | TC-3 profile.volumes[].page_px | 1241×1879 viết cứng; sim.scene_page_image.page_aspect "phải lấy từ profile" |
| 101 | fizika8 | schema | TC-5 meta chất lượng OCR | Cảnh báo OCR ru sai công thức; không có trường |
