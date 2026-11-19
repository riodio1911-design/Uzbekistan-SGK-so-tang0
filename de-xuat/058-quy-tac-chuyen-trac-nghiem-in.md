# 058 – Quy tắc chuyển trắc nghiệm in: nhãn A-B-D-E, tổ hợp mã hóa, câu phủ định

**Ưu tiên:** P2 · **Độ khó:** thấp · **Phụ thuộc:** [002](002-renderer-ex-order.md), [003](003-renderer-16-dang-bai-con-lai.md) · **Số chỗ thiếu thô gộp vào:** 3

## Thay đổi gì
- `exercise.option_labels`: mảng nhãn in (mặc định A, B, C, D; sách uz in A, B, D, E – bỏ C); đầu đọc và gia sư không tự sinh A-B-C-D.
- Quy tắc bước ④: câu "tổ hợp mã hóa" (A) 1, 2, 4, 5 / thứ tự "2, 3, 1, 4" / ghép "1-a, 2-b") chuyển sang `ex.choice_multi` / `ex.order` / `ex.match_pairs` gốc; giữ văn bản in ở `data.print_form` để hiện chế độ "như bản in".
- `exercise.negation: true` ("Noto‘g‘ri berilgan javobni aniqlang", "qaysi biri … emas") → UI làm nổi chữ phủ định; gia sư gợi ý khác.

## Vì sao + bằng chứng
onatili3_darslik1 R4 (A, B, D, E); tarix7_metodika C4 (tr.129 câu 1; tr.130 câu 6, 9; tr.131 câu 13; tr.132 câu 2), C5 (tr.41 câu 6; tr.42 câu 10; tr.52 câu 17), R0 (nhãn lặp sai "E)" tr.131, 133).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** tarix7_metodika, onatili3_darslik1; mọi sách Uzbekistan dùng nhãn A, B, D, E.
- **Nguồn đã nêu chỗ thiếu này:** onatili3_darslik1, tarix7_metodika

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P2
- Phụ thuộc: [002](002-renderer-ex-order.md), [003](003-renderer-16-dang-bai-con-lai.md)

## Cần người quyết
Bản số giữ dạng tổ hợp như bản in (giống đề thi thật) hay chuyển sang dạng gốc? Đề xuất: chuyển dạng gốc, có nút xem "như bản in".

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 312 | onatili3_darslik1 | quy_trinh | rui_ro[4] | Phương án trắc nghiệm theo thứ tự A, B, D, E (bỏ C) – bộ chấm/hiển thị không được tự sinh A-B-C-D |
| 359 | tarix7_metodika | ex | ex.choice_coded_combo | Trắc nghiệm mã hoá: liệt kê mục đánh số 1)…5), phương án là tổ hợp ('1, 2, 4, 5'), thứ tự ('2, 3, 1, 4'), hay ghép ('1-a, 2-b, 3-d'). Bản s… |
| 360 | tarix7_metodika | ex | ex.choice_negative | Biến thể câu hỏi phủ định 'Noto‘g‘ri berilgan javobni aniqlang' / 'qaysi biri … emas' – vẫn là choice_single nhưng UI phải làm nổi chữ phủ … |
