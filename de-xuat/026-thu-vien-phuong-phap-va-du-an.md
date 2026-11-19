# 026 – Thư viện phương pháp dạy học method.* và dự án nhóm

**Ưu tiên:** P2 · **Độ khó:** vừa · **Phụ thuộc:** [023](023-giao-an-lesson-plan.md) · **Số chỗ thiếu thô gộp vào:** 4

## Thay đổi gì
- Thư viện mới `tang0/thu-vien/phuong-phap/danh-muc.json`: mục `method.<ten>` (`klaster`, `venn`, `insert`, `aqliy_hujum`, `fsmu`, `arra`, `svetofor`, `charxpalak`, `kubik`, `domino`, `bbb`, `teskari_test`, `loyiha`…) với `name` đa ngữ, `steps[]`, `group_size`, `materials`, `minutes`, `sources`.
- `lesson_plan.stages[].method_ref`.
- `$defs/project`: đề tài, số nhóm, ngày giao/nộp, sản phẩm, tiêu chí bảo vệ, vai trò HS/GV theo bước → `assignment` nhiều buổi + `ex.open_response` nộp tệp + `teacher_grade` theo nhóm.
- `ex.peer_review`: HS nhận xét bài của bạn, GV xem tổng hợp (cần `user`).

## Vì sao + bằng chứng
geografiya7_metodika C3 (~15 phương pháp tr.19–27; đếm trong giáo án: Suhbat 9, Klaster 7…); tarix7_metodika C7 (FSMU, Arra, Insert… tr.17–28), C8 (LOYIHA ISHI tr.57–59, 128, 191); onatili3_metodika C6 (nhận xét bài của bạn tr.154, 159).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** geografiya7_metodika, tarix7_metodika, onatili3_metodika; dự án ở onatili3_darslik1 (Loyiha tr.110).
- **Mở khóa:** Phần lý luận (geo tr.5–27, tarix 36 trang) có cấu trúc thay vì chỉ đọc.
- **Nguồn đã nêu chỗ thiếu này:** geografiya7_metodika, onatili3_metodika, tarix7_metodika

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P2
- Phụ thuộc: [023](023-giao-an-lesson-plan.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 204 | geografiya7_metodika | schema | thu_vien_phuong_phap_day_hoc | Danh mục phương pháp/hoạt động lớp có tên, quy trình bước, số nhóm, vật liệu (Klaster 4 bước, Venn, Insert V/+/−/?, Aqliy hujum, Svetofor, … |
| 320 | onatili3_metodika | ex | ex.peer_review | HS nhận xét/đánh giá bài trình bày hoặc bài viết của bạn (nêu điều thích/không thích, lý do), GV xem tổng hợp. |
| 362 | tarix7_metodika | schema | method_library | Thư viện phương pháp dạy học tương tác dùng chung (id method.*): FSMU, Aqliy hujum, Arra/Arra-2, Insert, Venn, Ikki qismli kundalik, Nuqtay… |
| 363 | tarix7_metodika | schema | project_work | Dự án nhóm (LOYIHA ISHI): đề tài, số nhóm, giao trước, sản phẩm (trình bày/esse), tiêu chí bảo vệ, bảng vai trò HS/GV theo bước. Ánh xạ tần… |
