# 027 – Chế độ "giáo án" và trình chiếu lớp

**Ưu tiên:** P1 · **Độ khó:** vừa · **Phụ thuộc:** [022](022-sach-giao-vien-companion.md), [023](023-giao-an-lesson-plan.md), [024](024-dap-an-chi-gv-xem.md) · **Số chỗ thiếu thô gộp vào:** 7

## Thay đổi gì
- `features.layers.giao_an` (lớp bật thêm, D1): danh sách bài theo sách HS → thẻ giáo án (mục tiêu, từ khóa, các bước có đồng hồ phút, hoạt động, bài về nhà) + ngân hàng test + tư liệu + nút "Giao cho lớp" (009) + bật/tắt đáp án (024).
- Chế độ trình chiếu: phóng toàn màn hình trang/bài/bản đồ/thẻ của sách HS, ẩn đáp án, đồng hồ, bảng điểm 2 nhóm (thi đua "eng tez va to‘g‘ri javob").
- `features.layers.default_view` thêm `giao_an`. Phần lý luận dài vẫn ở `trang_goc_ghim`/`doc_van`.

## Vì sao + bằng chứng
tarix7_metodika C2 (30 mục giáo án, cột Vaqt, 35 trang TEST tr.39–211), R4; geografiya7_metodika C8 ("taqdimot" 48 trang), M4, R4; onatili3_metodika C5 (chia 2 nhóm thi đua tr.10; "xattaxtada" tr.12; "elektron doska" tr.159), M2–M3. Ba chế độ hiện có (pin, lesson, reading) đều hướng HS.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** geografiya7_metodika, tarix7_metodika, onatili3_metodika; dùng được với mọi sách HS khi GV chiếu bảng.
- **Mở khóa:** Cách dùng chính của 3 SGV.
- **Nguồn đã nêu chỗ thiếu này:** geografiya7_metodika, onatili3_metodika, tarix7_metodika

## Tương thích ngược
Có. Lớp mới.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P1
- Phụ thuộc: [022](022-sach-giao-vien-companion.md), [023](023-giao-an-lesson-plan.md), [024](024-dap-an-chi-gv-xem.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 209 | geografiya7_metodika | che_do_doc | che_do_giao_vien_trinh_chieu | Chế độ đọc mới cho SGV: xem giáo án theo bước có đồng hồ, mở trang SHS tương ứng, trình chiếu bản đồ/thẻ/test lên bảng ('taqdimot' 48 trang… |
| 215 | geografiya7_metodika | media | media_dac_thu[4] | trình chiếu (taqdimot) – sách chỉ nhắc, không kèm |
| 319 | onatili3_metodika | che_do_doc | trinh_chieu_lop_va_thi_dua_nhom | Chế độ lớp học cho GV: chiếu trang/bài tập lên bảng (xattaxta, 'elektron doska'), chia lớp 2 nhóm thi tìm nghĩa từ có tính điểm, chiếu ảnh/… |
| 326 | onatili3_metodika | media | media_dac_thu[2] | ảnh vệ tinh/bản đồ chiếu bảng (tr.9: sun’iy yo‘ldosh orqali olingan surat) |
| 327 | onatili3_metodika | media | media_dac_thu[3] | slayd/ảnh GV tự chuẩn bị chiếu 'elektron doska' (tr.159) |
| 357 | tarix7_metodika | che_do_doc | che_do_giao_an | Chế độ đọc mới cho sách GV: danh sách bài theo sách học sinh → mỗi bài một thẻ giáo án (mục tiêu, từ khoá, tiến trình có đồng hồ phút, hoạt… |
| 376 | tarix7_metodika | quy_trinh | rui_ro[4] | phần A (36 trang lý luận) ít giá trị tương tác – chỉ nên làm reading/trang gốc |
