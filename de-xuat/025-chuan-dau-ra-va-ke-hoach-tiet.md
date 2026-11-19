# 025 – Chuẩn đầu ra, tiêu chí đánh giá, kế hoạch tiết, mức khó

**Ưu tiên:** P2 · **Độ khó:** vừa · **Phụ thuộc:** [022](022-sach-giao-vien-companion.md), [023](023-giao-an-lesson-plan.md) · **Số chỗ thiếu thô gộp vào:** 6

## Thay đổi gì
- `book.curriculum.standards[] = {code, title: i18n, group}` (ISX1–7, AK1–4, chỉ báo 7.x.x.x; OTO‘S.3.ON.1…LK.4) và `hours_plan[] = {unit, hours, theory, practice}`.
- `standards[]` gắn được vào `lesson`, `lesson_plan`, `exercise`; bảng "Kết quả cả lớp" (009) lọc theo chuẩn.
- `lesson_plan.assessment_criteria[]` ("O‘quvchi … bera olishi") làm rubric cho `open_grade`.
- `exercise.difficulty: A|B|C`; `series.kind = "nazorat"` cho bài kiểm tra chorak không có đề (GV soạn qua `teacher.content_overrides`).
- Lịch tiết: GV đánh dấu tiết đã dạy, giao bài theo tiết (`assignment.hour_ref`).

## Vì sao + bằng chứng
geografiya7_metodika C4 (bảng ISX/AK tr.10; tổng 68 = 47+21 tr.16–17); onatili3_metodika C3 (OTO‘S.3.* tr.6–7), C9 ((6+1 SOAT)… 212 tiết/năm); tarix7_metodika C12 ("bera olishi" 28 lần, tr.44, 132); chizmachilik8 C5 (NAZORAT ISHI chỉ có tiêu đề tr.35, 50, 72, 92; mức A/B tr.3), R3.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** geografiya7_metodika, tarix7_metodika, onatili3_metodika, chizmachilik8_darslik.
- **Mở khóa:** Báo cáo theo chuẩn cho GV; bài nazorat.
- **Nguồn đã nêu chỗ thiếu này:** chizmachilik8_darslik, geografiya7_metodika, onatili3_metodika, tarix7_metodika

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P2
- Phụ thuộc: [022](022-sach-giao-vien-companion.md), [023](023-giao-an-lesson-plan.md)

## Cần người quyết
Có đưa chuẩn quốc gia (DTS) vào tầng 0 thành danh mục dùng chung (`tri-thuc/chuan/*.json`) không? Đề xuất: có, theo môn–lớp, nhập dần từ SGV.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 160 | chizmachilik8_darslik | truc | control_work + difficulty_level | Hai khái niệm bộ mục mới: 'Nazorat ishi' (kiểm tra cuối chorak, sách không in đề nên GV phải soạn, cần teacher_content_edit + teacher_assig… |
| 173 | chizmachilik8_darslik | quy_trinh | rui_ro[3] | Nazorat ishi không có đề trong sách: phải nhờ GV soạn, hoặc dùng sách giáo viên nếu có |
| 205 | geografiya7_metodika | schema | chuan_chuong_trinh | Chuẩn DTS và kế hoạch theo chủ đề: mã năng lực (ISX1–7 tri thức, AK1–4 thực hành), chỉ báo 7.x.x.x, phân bổ giờ theo chương (Kirish 2, Xari… |
| 317 | onatili3_metodika | schema | chuan_dau_ra_ma_hoa | Chuẩn đầu ra có mã (OTO‘S.3.ON.1 … LK.4: Og‘zaki nutq, Tinglab tushunish, O‘qib tushunish, Yozma nutq, Lingvistik ko‘nikmalar). Cần bảng ch… |
| 323 | onatili3_metodika | quy_trinh | ke_hoach_tiet_gv | Lịch dạy theo tiết: GV đánh dấu tiết đã dạy, tiến độ theo 212 tiết/năm, gắn giao bài theo tiết (assign_unit hiện không có 'soat/tiết'). |
| 367 | tarix7_metodika | truc | assessment_criteria | Danh sách 'O‘quvchi … bera olishi' cho mỗi bài = kết quả cần đạt, dùng làm rubric chấm câu mở (AI/GV) và để gắn câu test với kết quả. Rubri… |
