# 016 – Khóa zxx trong i18n cho chuỗi không ngôn ngữ

**Ưu tiên:** P1 · **Độ khó:** thấp · **Phụ thuộc:** Không · **Số chỗ thiếu thô gộp vào:** 3

## Thay đổi gì
- `$defs/i18n`: bỏ `required: ["uz"]`, thay bằng `anyOf: [{required:["uz"]}, {required:["zxx"]}]`; thêm `zxx: string` (D2 đã thêm `zxx` cho `media_lang`).
- Đầu đọc: `zxx` hiện như nhau ở mọi ngôn ngữ; kiểm tra bản dịch bỏ qua `zxx` (không tính là "chưa dịch").
- Công cụ chuyển: `{"uz": "<chuỗi>"}` toàn ký hiệu/số → `{"zxx": ...}`.

## Vì sao + bằng chứng
matematika5 TC2 (1.149 chuỗi: biểu thức, số, tên riêng), kimyo8 TC-D3 (121/220 câu quiz), TC-D4 (15/41 ý chuỗi phản ứng). Hiện ghi giả là uz nên không phân biệt được "chưa dịch" với "không cần dịch".

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** matematika5, kimyo8, fizika8
- **Loại sách mới:** Toán/Lý/Hóa, ingliz2 (tên riêng), tarix7 (năm), musiqa5 (ký hiệu nhạc).
- **Mở khóa:** ≈1.285 chuỗi; báo cáo bản dịch chính xác hơn.
- **Nguồn đã nêu chỗ thiếu này:** kimyo8, matematika5

## Tương thích ngược
Có. Dữ liệu cũ `{uz}` vẫn hợp lệ.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P1
- Phụ thuộc: Không

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 2 | matematika5 | schema | TC2 i18n chuỗi trung tính | Biểu thức toán, số, tên riêng không thuộc ngôn ngữ nào phải ghi giả là {"uz":...} |
| 93 | kimyo8 | schema | TC-D3 phương án quiz trung tính | Công thức/số ghi giả {"uz":...} |
| 94 | kimyo8 | schema | TC-D4 items[].q trung tính | Chuỗi phản ứng ghi giả {"uz":...} |
