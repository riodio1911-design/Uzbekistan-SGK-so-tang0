# 024 – Đáp án chỉ giáo viên xem và nối đáp án SGV vào bài của sách HS

**Ưu tiên:** P1 · **Độ khó:** vừa · **Phụ thuộc:** [022](022-sach-giao-vien-companion.md) · **Số chỗ thiếu thô gộp vào:** 9

## Thay đổi gì
- `exercise.visibility` / `exercise_item.visibility`: `all | teacher_only` cho `answer`, `correct`, `solution`, `teacher_note` (gợi ý dạy sau đáp án).
- `$defs/answer_source = {book_id, page, note?}`: đáp án sách HS lấy từ SGV; `exercise.answer_source`.
- Lưu trữ: đáp án `teacher_only` KHÔNG nằm trong `book.json` công khai mà ở db có luật đọc theo vai trò (hoặc artifact đồng hành chỉ GV mở được) – cần capability `user` + kiểm `canEdit`.
- Bước ④ cho SGV: công cụ tách đáp án in đậm theo font (`pdfplumber fontname`, Arial-BoldMT) + người duyệt; cờ `answer_reviewed`.
- Đáp án chưa được chuyên gia duyệt: chấm `giao_vien`, không `tu_dong`.

## Vì sao + bằng chứng
geografiya7_metodika C2 ("Javob:" ở 24 trang; tr.44 đáp án kèm câu hỏi gợi mở), R1 (đáp án biểu đồ tr.104–105 cần duyệt), R2; onatili3_metodika C2 (Javob, T/N, thứ tự từ điền tr.8–12), R3 ("hiện chỉ có user.canEdit/admin"); tarix7_metodika C3 + R0 (đáp án chỉ là chữ đậm; tr.50, 77–79 không thấy đậm); onatili3_darslik1 R5; geografiya7_darslik R5; ingliz2_daftar R2. Hiện `exercise.solution` hiện cho HS sau 2 lần sai (trục 5 `loi_giai_sau_2_lan_sai`).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** geografiya7_metodika, tarix7_metodika, onatili3_metodika; onatili3_darslik1, geografiya7_darslik, ingliz2_daftar (đáp án nằm ở SGV/multimedia).
- **Mở khóa:** Chấm tự động các bài "làm vào vở" của onatili3_darslik1 và geografiya7_darslik bằng đáp án SGV.
- **Nguồn đã nêu chỗ thiếu này:** geografiya7_darslik, geografiya7_metodika, onatili3_darslik1, onatili3_metodika, tarix7_metodika

## Tương thích ngược
Có. `visibility` mặc định `all`.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P1
- Phụ thuộc: [022](022-sach-giao-vien-companion.md)

## Cần người quyết
Đáp án GV giữ ở đâu để HS không đọc được qua mã nguồn trang? Đề xuất: db với luật đọc `canEdit`; cần xác nhận nền tảng artifact hỗ trợ luật đọc theo vai trò.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 200 | geografiya7_darslik | quy_trinh | rui_ro[5] | Đáp án SGV cho biểu đồ tr.75 (vùng 4, 'janubiy tropik') cần chuyên gia rà: biểu đồ cho mưa mùa đông (6–8) giống kiểu cận nhiệt. |
| 203 | geografiya7_metodika | schema | dap_an_gv | Lớp đáp án chỉ GV xem (answer key) gắn vào bài SHS, kèm 'gợi ý dạy' sau đáp án (vd. 'hỏi HS vì sao…'). exercise.solution hiện là lời giải h… |
| 217 | geografiya7_metodika | quy_trinh | rui_ro[1] | Đáp án có thể chưa chuẩn (vd. tr.104–105 biểu đồ SHS tr.75) – cần chuyên gia duyệt trước khi chấm tự động. |
| 218 | geografiya7_metodika | quy_trinh | rui_ro[2] | Đáp án GV không được lộ cho HS: cần quyền theo vai trò ở db/assets. |
| 313 | onatili3_darslik1 | quy_trinh | rui_ro[5] | Nhiều bài 'làm vào vở' không có đáp án trong sách HS; đáp án nằm ở sách GV (onatili3_metodika) |
| 316 | onatili3_metodika | schema | dap_an_tu_sach_gv | Đáp án của bài tập sách HS nằm trong sách GV (Javob:, danh sách T/N, thứ tự từ điền, cặp đồng nghĩa). Cần trường answer_source/answer_map n… |
| 331 | onatili3_metodika | quy_trinh | rui_ro[3] | Đáp án GV phải ẩn với HS (quyền xem theo vai trò; hiện chỉ có user.canEdit/admin) |
| 358 | tarix7_metodika | quy_trinh | answer_key_from_bold | Đáp án trắc nghiệm không có bảng đáp án riêng mà được đánh dấu bằng chữ in đậm (Arial-BoldMT) ở phương án đúng. Bước ④ cần công cụ tách đáp… |
| 372 | tarix7_metodika | quy_trinh | rui_ro[0] | đáp án chỉ nằm ở định dạng in đậm, tách tự động có thể sai/thiếu (tr.50, 77–79 không thấy đậm); một câu có nhãn lặp sai (tr.131 câu 13 có h… |
