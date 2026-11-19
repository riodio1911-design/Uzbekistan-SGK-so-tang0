# 020 – Sửa lệch giữa thư viện, đầu đọc, ví dụ và công cụ

**Ưu tiên:** P0 · **Độ khó:** thấp · **Phụ thuộc:** Không · **Số chỗ thiếu thô gộp vào:** 4

## Thay đổi gì
- `thu-vien/mo-phong/danh-muc.json`: params của `sim.scene_page_image` ghi theo đầu đọc: `crop = {page, box:[x,y,w,h]}` (+ `img` từ 001).
- `schema/kiem-tra.py` mục 7: chỉ quét trường kiểu `asset_path` (`images`, `background`, `media.files.path`, `src`), không quét chuỗi OCR.
- `schema/vi-du/adabiyot5.book-trich.json`: 581.11×822.05 thay 595×842.
- `dau-doc/index.html`: `.t0-ctrl{min-width:0}`, `.t0-sel{max-width:100%;min-width:0}`.

## Vì sao + bằng chứng
kimyo8 TC-D1 (203 cảnh), TC-D2 (báo lỗi nhầm "@," ở tr.72); adabiyot5 TC-08 (chữ lệch ~2,4 %); informatika5 TC-DD6 (cuộn ngang 486/420 ở 390 px).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** kimyo8, informatika5, adabiyot5
- **Loại sách mới:** —
- **Nguồn đã nêu chỗ thiếu này:** adabiyot5, informatika5, kimyo8

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P0
- Phụ thuộc: Không

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 24 | informatika5 | dau_doc_renderer | TC-DD6 CSS vỏ 390px | select#t0-book gây cuộn ngang (486/420) |
| 64 | adabiyot5 | schema | TC-08 tọa độ vi-du sai | schema/vi-du/adabiyot5.book-trich.json dùng 595×842 thay vì 581.11×822.05 |
| 91 | kimyo8 | sim | TC-D1 params sim.scene_page_image lệch | Thư viện ghi page+crop[4], đầu đọc dùng crop={page,box} |
| 92 | kimyo8 | quy_trinh | TC-D2 kiem-tra.py báo nhầm "@" | Mục 7 coi mọi chuỗi bắt đầu "@" là asset_path |
