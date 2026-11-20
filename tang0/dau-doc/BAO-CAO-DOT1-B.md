# Báo cáo đợt 1 – B (Cảnh & chữ): 001, 011 (phần blocks), 012

**Xong:** 001 (7 cảnh + `scene_page_image` nhận `img`, `volume`), 012 (phân số `{a/b}` ở mọi chỗ hiện chữ + dòng hướng dẫn gõ), 011 phần `blocks.js` (steps, nút "Video izoh", nhãn bộ mục lệch, API mở ghim link/skills/term). Phần `pin.js` của 011: gửi D.

**Cảnh "chưa hỗ trợ" trước → sau** (`_thu/B/dem.js`, book.json thật): kimyo8 399→0 · fizika8 467→0 · matematika5 209→76 (7 kind toán của F) · informatika5 165→12 (spreadsheet_mini của E) · biologiya5 178→0 · tabiiy5 40→0 · adabiyot5 0→0. Không cảnh nào lỗi, 0 lỗi console.
**`{a/b}` còn thô trong DOM:** matematika5 1058→0, fizika8 45→0 (cảnh + mọi bài tập).
**Nhãn mục:** adabiyot5 208/240 khối có nhãn (trước ≈102; "Zavqli mutolaa", "Topshiriq", "Uyga vazifa" hiện). Khối text steps/video: biologiya5 64/64, tabiiy5 3/3.

**Kiểm tra** (`_thu/B/chup.js`, ảnh `_thu/B/_anh/B-*.png`): 390×844 + 820×1180, uz/ru/vi, 2 ảnh tối; không cuộn ngang trang; vùng chạm ≥44 px (ô tick 24px nằm trong nhãn 44px); bài matematika5 p56.q2 đúng → ok, sai → bad, có dòng "Phân số gõ 2/3…". Còn tràn: chấm cảnh của scene_player ở 390 px (file R1 – đã yêu cầu D).

**Yêu cầu đã gửi:** B → D (ghim skills/link, giọng đọc bỏ ngoặc, scene_player chấm tràn + bỏ bản crop cũ, chạy build). **Đã nhận:** A → B (crop.volume) – xong trong `scene_vk.js`; F → B (thông báo) – không ảnh hưởng.
**Còn lại:** ảnh `img/*` của VK chưa có trong bản xem trước (hiện khung ảnh dự phòng, không phải "chưa hỗ trợ").
