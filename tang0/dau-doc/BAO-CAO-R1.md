# BÁO CÁO R1 – lõi + chế độ ghim

**Đạt.** `core.js` theo đúng hợp đồng (+ `pageImage`, `ui.pageCrop`, `media.speak`, `grade.shortAnswer`, `openExercise`). Chế độ `pin` chạy kimyo8 tr.21, 37, t4 và tabiiy5 tr.9–10. `dist/index.html` (359 KB) gộp đủ 3 chế độ. 24 file phụ (26 MB) liệt kê trong `dist/files.json`.

**Bằng chứng** (`_anh/r1-*.png`, 13 ảnh): 390×844 và 820×1180, ở uz/ru/vi, chế độ tối, trải hai trang ở 1280. Đã chụp lại cả lesson và reading trên dist. Không lỗi console, không cuộn ngang. Vùng chạm ≥44px: ghim là `.k-hit`, ghim sát nhau thì tự giãn ngang.

**Chấm thử** (`_thu/ex-r1.js`):
- short_answer: đúng 2/2, sai 1/2.
- choice_single: đúng 5/5, sai 0/5.
- open_response: để trống thì không lưu; có chữ thì lưu và hiện lời giải mẫu.
- Vai trò gia sư `feedback` → `open_feedback`.

**Lỗi trong LOI-CORE.md:** đã sửa hết (R3: 1–5, R2: 1–3 và 5), cùng lỗi "lưu khi để trống" mà R3 báo qua điều phối.

**Tạm quyết (D2):**
1. Mặc định hiện bản in gốc (tọa độ `tr` khớp bản này). Bản RU chọn bằng nút; khi đó ẩn vùng dịch và dồn ghim sang lề phải.
2. Renderer nhận cả bài tập (`items[]`); khung kiểm tra do core vẽ.
3. Gia sư: thiếu `profile.country` và `subject_id`, nên `subject_id` đang suy từ `subject`.

**Thiếu trong schema/thư viện (đề xuất):**
- `profile.country`, `subject_id`, `tutor{}`.
- `tr` của tabiiy5 trích đang rỗng.
- Ghim tham chiếu id nằm ngoài bản trích (`video.i4`…): hiện mờ.
- `sim.scene_player` và `atom_shells` chưa có ai được giao; R1 làm bản tối giản.
- Hình vẽ bằng mã (flower) cần một trường `background_src` chính thức.
