# Báo cáo đối đẳng – R (Robo), 20/11

**Thành phần mới:** `components/tutor/robo.js`, dùng chung cho 7 cuốn. Robo gắn vào `body` nên có ở mọi chế độ (ghim/bài học/đọc) và tự ẩn khi mở modal. Nhân vật, lời chào, giọng, mẫu lời nhắc và công cụ lấy từ `prompts.json` cùng `profile`. Phần bật/tắt theo các cờ `features.tutor_chat`, `features.reminders` và `tutor.roles` (`do_nhanh`, `nhac_viec`). `prompts.json`: thêm 46 chuỗi `ui_strings`. Bộ kiểm lời nhắc vẫn ĐẠT.

**Đã lên ngang hoặc hơn** (ảnh trong `_thu/R/_anh/`, chụp 390/1280, sáng/tối, uz/vi/ru):
- R01–R03 ngang (`R01-03-*`): robot SVG nổi, 5 tư thế, bong bóng chào.
- R04 hơn (`R04-*`): bong bóng khi sang bài mới có Đố nhanh, Hỏi đáp, + Nhắc bài tập. Chạy cả ở chế độ bài học.
- R05/R07 ngang (`R05-07-*`): chat có ngữ cảnh trang, bài tập, chương. Nhớ 10 lượt, có nút Dừng.
- R05ru ngang (`R05ru-*`): ngữ cảnh kèm OCR bản Nga.
- R06 ngang: `open_lesson`, `add_reminder`, `list_reminders`.
- R08 hơn: Đố nhanh có thêm nút "Câu khác".
- R09–R11 ngang (`R09-11-*`, `R10-*`): Nhiệm vụ, nhắc hạn, badge, hoãn 10 phút, giờ học, bước tiếp theo (đọc `res:<quiz>`).
- R12 hơn (`R12-*`): Hướng dẫn sinh từ ghim và tính năng thật.
- R13 ngang: nút Nghe, chọn UZ/VI/RU riêng.
- Nhãn nút và tab theo `T0.tUI` (song ngữ). Số bước bằng bản cũ; giữ tên lớp `.rb-*` của bản cũ để dùng lại kịch bản so ảnh.

**Còn kém:** biểu tượng ghim trong Hướng dẫn mới có màu, chưa có hình (chờ N xuất `T0.pinKinds`). Oqilbek dùng hình sách vẽ sẵn, chưa có ảnh cắt từ trang (chờ A thêm `profile.tutor.avatar`).

**Yêu cầu đã gửi** (`YEU-CAU.md`, mục "R → L, N, A"):
- L: sự kiện `t0:route` và `T0.goto`. L đã kết thúc, cần giao lại.
- N: thêm `data-t0-fab-avoid` và xuất `T0.pinKinds`.
- A: thêm `tutor.avatar`, `tutor.badge_colors` và cờ `robo`, `tutor_help`.

**Thử:** `_thu/R/thu.js`, `sach.js` (7 cuốn, 0 lỗi), `chedo.js`. `D/dem.js` sạch.
