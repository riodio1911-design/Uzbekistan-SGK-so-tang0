# 063 – Khái niệm bộ mục (rubric) mới

**Ưu tiên:** P1 · **Độ khó:** thấp · **Phụ thuộc:** [029](029-che-do-pre-reader.md) · **Số chỗ thiếu thô gộp vào:** 4

## Thay đổi gì
`tri-thuc/rubric-bo-sach.json` (39 khái niệm) và trục 2 thêm:
`advanced_readers` (O‘qishni biladigan o‘quvchilarga), `listening_task` (Tinglang), `watching_task` (Tomosha qiling), `tpr_movement` (jismoniy mashqlar), `class_competition` (thi đua), `lesson_end_marker` (chuông "dars tugadi" – ranh giới tiết), `project` (Loyiha), `fact_scroll` (thẻ dữ kiện giấy cói), `control_work` (Nazorat ishi), `assessment_criteria` (O‘quvchi … bera olishi), `parent_corner`, `reflection_icons` (đèn giao thông, ngôi sao).
Mỗi khái niệm thêm `icon` + `audio_label` (dùng cho 029).

## Vì sao + bằng chứng
alifbe1_darslik C12 (Shartli belgilar tr.3; tên lửa tr.7–28; Tinglang tr.15, 24, 28); musiqa5 C6 (tai nghe tr.4; màn hình tr.14); onatili3_darslik1 C5 (11 biểu tượng không nhãn tr.2; chuông tr.7, 16, 45, 52; Loyiha tr.110); chizmachilik8 C5; tarix7_darslik C7; tarix7_metodika C12; ingliz2_darslik C10 (tr.2); geografiya7_metodika M2.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** alifbe1_darslik, musiqa5, onatili3_darslik1, chizmachilik8, tarix7 ×2, ingliz2_darslik, geografiya7_metodika.
- **Nguồn đã nêu chỗ thiếu này:** alifbe1_darslik, geografiya7_metodika, musiqa5_darslik, onatili3_darslik1

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P1
- Phụ thuộc: [029](029-che-do-pre-reader.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 137 | alifbe1_darslik | truc | advanced_readers | Bộ mục mới cho rubric-bo-sach.json: 'O‘qishni biladigan o‘quvchilarga' = nội dung phân hóa cho trẻ đã biết đọc (khác challenge vì là văn bả… |
| 213 | geografiya7_metodika | media | media_dac_thu[2] | biểu tượng phản tư (đèn giao thông, ngôi sao) |
| 275 | musiqa5_darslik | truc | listening_task, watching_task | Hai khái niệm bộ mục mới trong rubric-bo-sach.json: 'Tinglang' (nghe tác phẩm) và 'Tomosha qiling' (xem biểu diễn). Không khớp lesson_video… |
| 296 | onatili3_darslik1 | truc | bieu_tuong_rubric_va_ranh_gioi_tiet | Bộ mục được thể hiện bằng 11 BIỂU TƯỢNG (không có nhãn chữ trên trang) và tiết học được ngắt bằng chuông "dars tugadi". Cần: (1) khái niệm … |
