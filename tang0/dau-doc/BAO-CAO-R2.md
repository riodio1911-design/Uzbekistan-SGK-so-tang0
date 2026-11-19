# BÁO CÁO R2 – lớp "bài học"

**Mã:** `modes/lesson.js`, `components/blocks.js` (13 `block.type`), `components/rubric-data.js` (sinh bằng `_thu/r2/sinh-rubric.py`), `components/ex/{sort_bins,table_fill}.js`, `components/sim/scene_custom_draw.js`. Tài nguyên mẫu: `mau/tabiiy5/{img,wbpages,audio2,sim/flower.svg}`.

**Đạt (thử với core thật, trang `_thu/r2/thu.html`):** tabiiy5 bài 1.1 (12 khối) + vở 1.1 trang 1. Ở 390×844 và 820×1180, uz/ru/vi: không lỗi console, không cuộn ngang; các nút <44px đều có `.k-hit`. Ảnh: `_anh/R2-{phone,tablet}-{uz,ru,vi}.png`, `R2-phone-vi-vo.png`, `R2-tablet-uz-toi.png` (tối), `R2-phone-vi-video.png`.
Chấm tự động: sort_bins sai 4/6 → đỏ, đúng 6/6 → xanh; table_fill (có phương án) sai 0/5, đúng 5/5; không có phương án → "Đã lưu".

**Chưa đạt:** mô hình hoa nền trống, chờ R1 dùng `background_src` (LOI-CORE R2-2). Cảnh vẽ bằng mã chỉ hiện khung thay thế. Video v2 không có trong bản trích.

**Tạm quyết (D2):** nhãn mục lấy theo `rubric-bo-sach.json`, `ru` thiếu thì lấy tên khái niệm. Hình vẽ bằng mã xuất thành `sim/<id>.svg`. Vở = trang riêng trong lớp bài học, có ảnh trang in để đối chiếu. Có nút "Kèm bản gốc" song ngữ.

**Thiếu trong schema/dữ liệu (đề xuất):**
- `table_fill` thiếu `data.cell_options`: 5 chức năng `FUNCS` có trong mã cũ nhưng không vào vi-du.
- `cards[].image` chưa chuẩn hóa: hiện ảnh nằm ở `data.card_images` và chỉ khớp theo thứ tự.
- `fields` của trang vở 1 không trỏ tới bài tập nào và tọa độ lạ.
- Bài tập `wb.ch1.t1` không có `page`/`unit`.
- Trích thiếu ý `same`/`diff`/`two` của a11.
- `media.play` chưa có tham số tốc độ cho lớp bài học.
