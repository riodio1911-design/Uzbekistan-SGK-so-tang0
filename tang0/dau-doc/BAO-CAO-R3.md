# Báo cáo R3 – lớp đọc văn

**Đã làm:** `modes/reading.js`. Không cần viết thêm renderer, vì hai dạng bài tập của adabiyot5 (`choice_single`, `open_response`) đã có renderer của R1. Kiểm thử nằm ở `_thu/r3/` (`dung-thu.py`, `thu.js`, `thu-bt.js`, kết quả ghi trong `ket-qua.txt`).

**Tiêu chí: ĐẠT** với adabiyot5, đơn vị 2, trang 8, chạy trên core thật.
- Ở 390×844 và 820×1180, cả ba ngôn ngữ uz/ru/vi: không có lỗi console, không cuộn ngang, không còn vùng chạm nào dưới 44px. Ảnh: `_anh/R3-{phone,tablet}-{uz,ru,vi}.png`. Chế độ tối: `R3-phone-vi-toi.png`.
- Đọc theo câu: có 9 câu đọc được và 8 câu `no_read` được bỏ qua. Bấm câu thì câu đó được tô sáng và phát đúng clip. Nút "Nghe" phát lần lượt từng câu ở tốc độ 1.25×. Có thể chọn giọng bản gốc hoặc bản dịch. Ảnh: `-dang-doc`.
- Có dạng xem "Trang": dùng ảnh nền đã xóa chữ cộng `text_lines` dựng bằng SVG, tô sáng câu đang đọc theo từng dòng. Ảnh: `-trang`.
- Chú giải: từ "unguridagi" khớp với mục "Ungur" (khớp đầu từ). Ảnh: `-chu-giai`.
- Bài tập: `choice_single` đúng cho 4/4 (ok), sai cho 0/4 (sai). Với `open_response`, ô rỗng vẫn báo "Đã lưu" – lỗi nhỏ ở renderer của R1. Nút gia sư mở bản xem trước lời nhắc có đủ ngữ cảnh bài thơ.
- kimyo8 và tabiiy5 không hiện chế độ đọc văn (đúng).

**Tạm quyết (D2 chưa chốt):** chữ chính luôn là `lang_base`, bản dịch đặt ngay dưới từng dòng và bật/tắt được; `no_read` = bỏ qua khi đọc; ba mức tốc độ 0.75, 1, 1.25.

**Thiếu trong schema/thư viện (đề xuất):**
1. `text_lines[6]` chỉ ghép được với anchor qua đuôi số của id (`hot43`), nên thêm `anchor_id`.
2. `glossary.term` chưa có dạng biến tố, nên thêm `forms[]`.
3. Enum `ai_feedback.role` lệch với id trong `prompts.json`; R1 đã ánh xạ tạm trong core.
4. `audio_groups` trùng thông tin với `audio_ref`.

**Lỗi core:** đã ghi 4 lỗi vào `LOI-CORE.md`, R1 đã sửa và tôi đã thử lại. Còn một việc: R1 cần chạy lại `build.py` để nạp đủ script.
