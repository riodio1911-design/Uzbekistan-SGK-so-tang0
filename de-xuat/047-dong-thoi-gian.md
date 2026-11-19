# 047 – Dòng thời gian và bài đặt sự kiện lên trục năm (TCN/CN)

**Ưu tiên:** P1 · **Độ khó:** vừa · **Phụ thuộc:** [002](002-renderer-ex-order.md) · **Số chỗ thiếu thô gộp vào:** 3

## Thay đổi gì
- `block.type = "timeline"`: `{periods[{label, from, to}], events[{date: {year, era: bc|ad, century?}, label: i18n, image?, place_ref?}]}`; vẽ bằng mã (không giữ ảnh).
- `ex.timeline_place`: kéo sự kiện lên trục; tính khoảng năm qua mốc Công nguyên (không có năm 0); chấm tự động. Biến thể chỉ xếp thứ tự dùng `ex.order` (002).

## Vì sao + bằng chứng
tarix7_darslik C4 (dải dòng thời gian 2 trang tr.4–5; vòng giai đoạn tr.6; SGV tr.53), C5 ("davr chizig‘i bilan tushuntiring", "qancha yil bo‘ldi? Hisoblab ko‘ring" tr.5; SGV tr.130 câu 6), M1.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** tarix7_darslik, tarix7_metodika; Sử các lớp khác.
- **Nguồn đã nêu chỗ thiếu này:** tarix7_darslik

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P1
- Phụ thuộc: [002](002-renderer-ex-order.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 337 | tarix7_darslik | block | dong_thoi_gian | Dòng thời gian/trục thời đại: các mốc thế kỷ, chia giai đoạn (Qadimgi davr, O‘rta asrlar, ilk/rivojlangan/so‘nggi), trước/sau Công nguyên, … |
| 338 | tarix7_darslik | ex | ex.timeline_place | Đặt sự kiện lên trục thời gian / tính khoảng cách năm (gồm qua mốc Công nguyên). ex.order hiện có chỉ xếp thứ tự, không có trục số năm, khô… |
| 346 | tarix7_darslik | media | media_dac_thu[1] | dòng thời gian vẽ lại bằng mã |
