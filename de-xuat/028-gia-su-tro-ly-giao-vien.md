# 028 – Gia sư vai trò trợ lý giáo viên có nguồn thật

**Ưu tiên:** P1 · **Độ khó:** vừa · **Phụ thuộc:** [023](023-giao-an-lesson-plan.md), [024](024-dap-an-chi-gv-xem.md) · **Số chỗ thiếu thô gộp vào:** 3

## Thay đổi gì
- `gia-su/prompts.json`: luật `audience = giao_vien` (đang `duyet_d2`, `sources: []`) thêm nguồn từ 3 SGV; vai trò mới `lesson_assistant` (soạn biến thể giáo án theo khung 6 bước / texnologik xarita, gợi ý phương pháp `method.*`, tạo phương án nhiễu cho test, tạo câu hỏi phân tích nguồn, chia phút).
- Ngữ cảnh: khi GV hỏi về một trang HS, nạp `lesson_plan` + đáp án `teacher_only` + chuẩn của tiết hiện tại.
- Luật: không bao giờ đưa đáp án/ghi chú `teacher_only` vào câu trả lời cho `audience = hoc_sinh` ("bu narsa o‘quvchilarga aytilmasligi lozim").

## Vì sao + bằng chứng
geografiya7_metodika C9 (vai trò GV ở trạng thái đề xuất, sources rỗng); tarix7_metodika C11 (khung tự đánh giá giờ dạy tr.34, mẫu xarita tr.36); onatili3_metodika C7 (tr.10: "7-savolning aniq javobi … o‘quvchilarga aytilmasligi lozim").

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** geografiya7_metodika, tarix7_metodika, onatili3_metodika
- **Nguồn đã nêu chỗ thiếu này:** geografiya7_metodika, onatili3_metodika, tarix7_metodika

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P1
- Phụ thuộc: [023](023-giao-an-lesson-plan.md), [024](024-dap-an-chi-gv-xem.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 210 | geografiya7_metodika | gia_su | gia_su_giao_vien_duyet | Vai trò gia sư 'giao_vien' trong prompts.json đang ở trạng thái de_xuat, sources rỗng ('Chưa cuốn nào có sách giáo viên'). Cuốn này cho ngu… |
| 321 | onatili3_metodika | gia_su | gia_su_gv_dung_giao_an | Gia sư cho GV (audience=giao_vien đã có luật) cần lấy NGỮ CẢNH từ giáo án tiết tương ứng + đáp án + chuẩn đầu ra khi GV hỏi về một trang HS… |
| 366 | tarix7_metodika | gia_su | gia_su_tro_ly_giao_vien | Vai trò gia sư cho GV (không phải học sinh): soạn biến thể giáo án theo khuôn texnologik xarita, đề xuất phương án nhiễu cho test, tạo câu … |
