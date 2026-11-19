# 022 – Loại sách giáo viên riêng đi kèm sách học sinh (companion)

**Ưu tiên:** P1 · **Độ khó:** vừa · **Phụ thuộc:** [015](015-quy-tac-id-ben-thong-nhat.md) · **Số chỗ thiếu thô gộp vào:** 6

## Thay đổi gì
- `profile.audience = "giao_vien"` (đã có) + mới: `profile.companion_of: [{book_id, volume?}]` (một SGV có thể phủ nhiều tập HS: onatili3 1-qism, 2-qism).
- `profile.volumes[].kind` thêm `teacher_guide`; `profile.volumes[].part` (số tập) cho sách HS nhiều tập.
- `$defs/student_ref = {book_id, lesson?, pages?: page_range, exercise?: id}` – dùng ở giáo án (023), đáp án (024), mục tiêu (025).
- Đầu đọc: mở SGV cạnh trang HS tương ứng và ngược lại (GV đang xem bài N của HS → nút "Giáo án").
- Sách HS tham chiếu ngược: `profile.teacher_guide: book_id`.

## Vì sao + bằng chứng
onatili3_metodika C0 (mục lục 30 chủ đề trùng 16 chủ đề HS tập 1 và tiếp tập 2; "darslikning 6-betida berilgan savollar" tr.8); tarix7_metodika C1 (tr.221–222: 30 mục khớp 1:1 mục lục HS tr.189–190; "(Darslik 10–14 betlar)" tr.44); geografiya7_metodika C1 (giáo án 5.5 trỏ bài 5.5 SHS tr.61; đáp án trỏ "1-topshiriq"). onatili3_darslik1 C6 ("1-qism"). Schema hiện chỉ có `$defs/teacher` là lớp dữ liệu GV trong sách HS (media_overrides, content_overrides, assignments, results, grades), không có cuốn GV.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** geografiya7_metodika, tarix7_metodika, onatili3_metodika; gián tiếp onatili3_darslik1 (sách nhiều tập dùng chung một SGV).
- **Mở khóa:** Mở khóa loại sách "metodika" (3/12 mẫu sóng 0).
- **Nguồn đã nêu chỗ thiếu này:** geografiya7_metodika, onatili3_darslik1, onatili3_metodika, tarix7_metodika

## Tương thích ngược
Có. Trường mới tùy chọn; sách HS hiện tại không đổi.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P1
- Phụ thuộc: [015](015-quy-tac-id-ben-thong-nhat.md)

## Cần người quyết
SGV là một book riêng (artifact riêng) hay một volume trong cùng book với sách HS? Đề xuất: book riêng, liên kết bằng `companion_of`, vì quyền xem khác nhau (024) và giới hạn 256 MB.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 202 | geografiya7_metodika | schema | lien_ket_sach_hs | Liên kết SGV ↔ SHS theo số bài và theo từng bài tập: giáo án 5.5 trỏ đúng bài 5.5 (SHS tr.61), đáp án '1-topshiriq' trỏ đúng ex của SHS. Cầ… |
| 220 | geografiya7_metodika | quy_trinh | rui_ro[4] | Văn bản lý luận dài (tr.5–27) ít giá trị tương tác; chỉ nên ở chế độ đọc. |
| 297 | onatili3_darslik1 | schema | sach_nhieu_tap_chung_sach_gv | Một môn/lớp chia 2 tập HS (1-qism, 2-qism) nhưng 1 sách GV phủ cả năm; cần khai báo 'tập' trong profile và liên kết chủ đề giữa các tập. |
| 314 | onatili3_metodika | schema | sach_giao_vien_rieng | Loại sách GIÁO VIÊN RIÊNG đi kèm sách HS: không phải 'lớp dữ liệu giáo viên' (schema teacher hiện chỉ có media_overrides, content_overrides… |
| 329 | onatili3_metodika | quy_trinh | rui_ro[1] | Sách GV phủ cả năm nhưng chỉ có sách HS tập 1 trong mẫu; tập 2 (tr.84–154 của sách GV) chưa có để đối chiếu |
| 356 | tarix7_metodika | schema | companion_student_book | Liên kết hai cuốn: profile.companion_of / student_book_id ở sách GV, và mỗi lesson_plan trỏ tới lesson + dải trang của sách học sinh. Đầu đ… |
