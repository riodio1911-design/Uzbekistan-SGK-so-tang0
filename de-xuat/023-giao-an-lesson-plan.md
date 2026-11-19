# 023 – $defs/lesson_plan: giáo án theo bài/tiết

**Ưu tiên:** P1 · **Độ khó:** vừa · **Phụ thuộc:** [022](022-sach-giao-vien-companion.md), [025](025-chuan-dau-ra-va-ke-hoach-tiet.md), [026](026-thu-vien-phuong-phap-va-du-an.md) · **Số chỗ thiếu thô gộp vào:** 5

## Thay đổi gì
`$defs/lesson_plan` (mọi trường tùy chọn vì khuôn không đồng đều):
- `id`, `student_ref`, `topic: i18n`, `hours`, `hour_no` (tiết N trong chủ đề "(6+1 SOAT)"), `key_terms[]` (→ `term.*`), `goals {talimiy, tarbiyaviy, rivojlantiruvchi}`, `materials[]` ("ta’lim vositalari": yozuvsiz xarita, taqdimot…), `expected_results[]`, `standards[]` (→ 025), `interdisciplinary[]`.
- `stages[]`: `{kind: motivatsiya|faollashtirish|yangi_mavzu|mustahkamlash|refleksiya|uyga_vazifa|kirish|asosiy_qism|yakun|other, minutes?, skill?: ogzaki_nutq|tinglab_tushunish|oqib_tushunish|yozma_nutq, area?: fonetika|leksikologiya|imlo|morfologiya|sintaksis, method_ref?: method.*, blocks[], exercise_refs[]}`.
- `homework`, `tests[]` (ngân hàng test của bài → `exercises[]` với `audience: giao_vien`).
- `book.lesson_plans[]` ở cấp gốc.

## Vì sao + bằng chứng
geografiya7_metodika C0 (bảng đầu + 6 bước; "DARSNING BORISHI" 41 trang, tr.28, 43, 100, 128); onatili3_metodika C1 ((6+1 SOAT), 1-soat DARS JARAYONI – Kirish – Asosiy qism; nhãn kỹ năng và mảng ngôn ngữ, tr.8, 12, 13); tarix7_metodika C0 ("texnologik xarita" tr.36–38; tiến trình có cột Vaqt tr.75), R1 (chỉ 3/30 bài có xarita đầy đủ); geografiya7_metodika R0 (~42/60 bài có giáo án).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** geografiya7_metodika, tarix7_metodika, onatili3_metodika
- **Mở khóa:** ≈42 + 30 + 30 chủ đề giáo án của 3 SGV.
- **Nguồn đã nêu chỗ thiếu này:** geografiya7_metodika, onatili3_metodika, tarix7_metodika

## Tương thích ngược
Có. Mục mới ở cấp gốc.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P1
- Phụ thuộc: [022](022-sach-giao-vien-companion.md), [025](025-chuan-dau-ra-va-ke-hoach-tiet.md), [026](026-thu-vien-phuong-phap-va-du-an.md)

## Cần người quyết
Bài không có giáo án: cho AI sinh theo khung không? Đề xuất: được, nhưng gắn `source: "ai_draft"` và hiện nhãn "bản nháp AI" cho tới khi GV duyệt.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 201 | geografiya7_metodika | schema | giao_an_6_buoc | Cấu trúc giáo án (lesson_plan) cố định: bảng đầu (maqsad, ta’lim vositalari, kutiladigan natijalar, standart ISX/AK + mã chỉ báo, fanlararo… |
| 216 | geografiya7_metodika | quy_trinh | rui_ro[0] | Chỉ ~42/60 bài có giáo án; bài thiếu cần GV tự soạn hoặc AI sinh theo khung – phải ghi rõ nguồn. |
| 315 | onatili3_metodika | block | giao_an_theo_tiet | Cấu trúc giáo án: chủ đề có số tiết (6+1) → tiết N → pha Kirish / Asosiy qism (/ kết luận GV) → hoạt động gắn nhãn kỹ năng (nói, nghe, đọc,… |
| 355 | tarix7_metodika | schema | lesson_plan | Schema giáo án theo bài (hiện $defs/teacher chỉ có media_overrides/content_overrides/assignments/results/grades, không có chỗ cho nội dung … |
| 373 | tarix7_metodika | quy_trinh | rui_ro[1] | khuôn giáo án không đồng đều: chỉ 3/30 bài có texnologik xarita đầy đủ – schema phải để mọi trường tuỳ chọn |
