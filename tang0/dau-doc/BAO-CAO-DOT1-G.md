# Báo cáo đợt 1 – G (Lớp học & dữ liệu cũ) – 20/11

**Xong:** 009 (phần lõi), 014.
- `modules/classroom.js`: nút + bảng "Bài về nhà", GV giao bài `hw/` (bật + hạn), học sinh đẩy `res/` (debounce 1,5 s, `class_result` có `answers`), "Kết quả cả lớp" (tên từ `user.profiles`), GV chấm câu mở → `grade/`, học sinh thấy điểm GV; thanh điểm bộ vở thang 10; ghim workbook mở đúng trang vở; video thật GV `media/` (URL/asset ≤ 20 MB) + `mediaFor()`; `dbRules()` cho publish. Hai dạng khóa: phẳng D2 và lồng `{self}`.
- `modules/migrate.js`: chuyển một lần `mat5/inf5/kim8/fiz8.ans`, `gul:done`, `gul:ans:*`, `wb:*`, `adab5:A`, `mat5.hw` và khóa xem trước id cũ → id bền (legacy_ids), rồi đẩy `res/`.
- `_cong-cu/chuyen-du-lieu-cu/chuyen_db.py`: dump db cũ → batch ArtifactData (media/edit/quiz/hw/res), capabilities.json, danh sách asset cần chép.

**"Chưa hỗ trợ"/ghim chết (`_thu/G/dem.js`):** matematika5 ghim workbook không dữ liệu 50 → 0; 6 cuốn khác 0 → 0.

**Kiểm tra (`_thu/G/thu.js`, db/user giả có quy tắc):** 34/34 đạt – chấm, đẩy res, quyền ({self}, admin), migrate một lần, 390/820, uz/ru/vi, tối, không cuộn ngang, chạm ≥ 44, 0 lỗi console. Trên dist mới (`_thu/G/dist.js`) 7 cuốn: 0 lỗi, chuyển dữ liệu chạy, không chữ null, thanh ẩn dưới modal. Ảnh: `_thu/G/_anh/G-*.png`.

**Yêu cầu gửi:** D (nạp module, `#t0-tools`, pin.js gọi openSet, exresult kèm `v/items`), A (result_key lồng + class_summary, content_override.lesson, bảng ánh xạ README), B (scene_player dùng mediaFor). **Đã nhận:** D→G (thanh che modal, chữ null) – đã sửa.

**Còn lại:** giao diện sửa/ẩn/thêm quiz (`edit/`, `quiz/`), GV sửa gán bài–bài học (chờ schema), bytes/sha256 ảnh trang (014), chưa thử db thật.
