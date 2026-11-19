# 008 – Vẽ ô nhập trên trang vở và mở rộng $defs/field

**Ưu tiên:** P0 · **Độ khó:** vừa · **Phụ thuộc:** Không · **Số chỗ thiếu thô gộp vào:** 7

## Thay đổi gì
- Chế độ ghim (`modes/pin.js`) vẽ `pages[].fields` thành ô nhập đè đúng `box` (%), lưu vào `answer_map` như modal, đồng bộ hai chiều với bài tập.
- `$defs/field` thêm:
  - `type`: `circle` (khoanh tròn – tabiiy5), `open_button` (nút mở bài tự luận – matematika5);
  - `part` (số nguyên, phần thứ k của đáp án nhiều phần, thay quy ước `item_key = "<id>/<k>"`);
  - `placeholder` (i18n), `size` (`sm|md|lg`), `list_ref` (gợi ý datalist).

## Vì sao + bằng chứng
matematika5 DT2 (917 ô, ảnh `m5-wb-w5-vi.png` 0 input), TC1 (204 ô nhiều phần), TC3 (43 nút); tabiiy5 (877 ô + TC05 38 ô khoanh tròn + TC07 391 ô có thuộc tính phụ); adabiyot5 DD-2 (59 ô bảng, 14 dòng kẻ, 2 chỗ trống). Tổng **1.869 ô + 38 ô khoanh**.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** matematika5, tabiiy5, adabiyot5
- **Loại sách mới:** Mọi vở bài tập (alifbe1_daftar, ingliz2_daftar…): cùng lớp này là nền cho ô viết tay/bàn phím chữ (034), tập viết (033).
- **Mở khóa:** 1.907 ô trên trang của 3 cuốn; vở matematika5/tabiiy5 làm được tại chỗ như bản cũ.
- **Nguồn đã nêu chỗ thiếu này:** adabiyot5, matematika5, tabiiy5

## Tương thích ngược
Có. Trường mới tùy chọn; `item_key "<id>/<k>"` vẫn đọc được, công cụ chuyển sang `part`.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P0
- Phụ thuộc: Không

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 1 | matematika5 | schema | TC1 field.part | Một ý có nhiều ô nhập trên trang vở, đáp án nối bằng ";" – field chưa có số thứ tự phần |
| 3 | matematika5 | schema | TC3 field.type=open_button | Ý tự luận trên trang vở là nút "✎ a" mở modal, không phải ô gõ |
| 10 | matematika5 | dau_doc_renderer | DT2 vẽ pages[].fields | Chế độ ghim không vẽ ô nhập trên trang vở |
| 30 | tabiiy5 | schema | TC05 field.type=circle | Ô khoanh tròn trên trang vở |
| 32 | tabiiy5 | schema | TC07 field.placeholder/size/list_ref | Thuộc tính phụ ô vở bị bỏ |
| 39 | tabiiy5 | dau_doc_renderer | lớp ô nhập trang vở | pages[].fields chưa được chế độ ghim vẽ |
| 66 | adabiyot5 | dau_doc_renderer | DD-2 pages[].fields | table_cell, write_lines, gap trên trang chưa nhập được |
