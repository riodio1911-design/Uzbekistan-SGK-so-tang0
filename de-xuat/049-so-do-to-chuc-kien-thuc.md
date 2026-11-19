# 049 – Sơ đồ tổ chức kiến thức (cụm, Venn, cây) – khối và bài tập

**Ưu tiên:** P2 · **Độ khó:** vừa · **Phụ thuộc:** [026](026-thu-vien-phuong-phap-va-du-an.md) · **Số chỗ thiếu thô gộp vào:** 3

## Thay đổi gì
- `block.type = "diagram"`: `{kind: cluster|tree|venn|columns, nodes[{id, text, parent?}], edges?}` – vẽ lại bằng HTML/SVG, không giữ ảnh.
- `ex.graphic_organizer`: cùng cấu trúc, một số nút để trống; chấm theo nút (đáp án có sẵn) hoặc `giao_vien`/AI gợi ý.

## Vì sao + bằng chứng
tarix7_darslik C8 (sơ đồ cụm tr.23; 4 cột × 3 tiêu chí tr.85); tarix7_metodika C9 (sơ đồ 5 nhà nước IV–VII tr.53; MODDIY/YOZMA MANBALAR tr.38), M1; geografiya7_metodika C3 (Klaster 7 lần, Venn).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** tarix7_darslik, tarix7_metodika, geografiya7_metodika (Klaster, Venn).
- **Nguồn đã nêu chỗ thiếu này:** tarix7_darslik, tarix7_metodika

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P2
- Phụ thuộc: [026](026-thu-vien-phuong-phap-va-du-an.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 341 | tarix7_darslik | ex | ex.graphic_organizer | Sơ đồ tổ chức kiến thức: sơ đồ cụm có ô trung tâm ("kể tên đặc điểm các thành phố thời Eftaliy") và nhánh; bảng so sánh nhiều cột kiểu thẻ.… |
| 364 | tarix7_metodika | block | so_do_tong_hop | Sơ đồ tổng hợp kiến thức (cây/khối nối) như 'O‘RTA OSIYO (IV–VII asrlar)' gồm 5 nhà nước, năm tồn tại, thủ đô, người sáng lập; sơ đồ 'O‘rta… |
| 369 | tarix7_metodika | media | media_dac_thu[1] | sơ đồ tổng hợp/bảng giáo án (vẽ lại thành HTML, không giữ ảnh) |
