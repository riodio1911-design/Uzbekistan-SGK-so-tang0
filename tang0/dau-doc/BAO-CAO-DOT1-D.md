# Báo cáo đợt 1 – D (Trang & lõi), 20/11

**008 – xong.** `modes/pin.js` vẽ `pages[].fields` đè đúng box: input/textarea/cell/gap/table_cell/write_lines (có dòng kẻ), select, box/underline/circle (chọn), dot (nối cặp, có vạch nối), note, open_button. Đáp án ghi vào `T0.answers` ('ex:<id>:v', core mới), nên modal bài tập và trang đồng bộ hai chiều. Nút "Kiểm tra" chấm 7 kiểu: text, choice, true_false, select, nối cặp, ô chữ, list_examples. Màn < 560 px: chạm ô mở bảng nhập lớn.
**010 – xong.** `T0.printPage` (core) dùng chung cho pin.js và reading.js. biologiya5 có chế độ Trang, đổi RU/UZ/VI trong cùng hộp chữ. adabiyot5: 1.432 chấm text_anchor thay bằng dòng bấm nghe (`T0.sentenceAt`); khối prompt đọc được. Ghim: thêm term, skills, link, workbook (nhảy trang vở + nút quay lại).
**build.py** `--book <cuon>|all`: dựng `dist/<cuon>/` từ book.json thật, nạp components/ và modules/; `files.json` tham chiếu artifact cũ.

| "Chưa hỗ trợ" (ex+sim) | trước (v0.9) | sau |
|---|---|---|
| matematika5 | 33 sim + ô vở 0/917 | 0 |
| informatika5 | 81 | 0 |
| biologiya5 | Trang không hiện | 0 |
| tabiiy5 / adabiyot5 | ô vở 0/877, 0/75 | 0 |
| kimyo8 / fizika8 | 0 | 0 |

(Phần sim/ex là của B/C/E/F; số "sau" đo bằng `_thu/D/dem.js` → `dem-ket-qua.json`.)

**Kiểm tra đạt:** 390 và 820 px không cuộn ngang, không lỗi console, sáng/tối, uz/ru/vi. Gõ đúng/sai rồi chấm; mở modal thấy cùng đáp án; sửa trong modal thì trang cập nhật (`_thu/D/tuong-tac.js`). Ảnh ở `_thu/D/_anh/`.
**Yêu cầu đã gửi:** A (schema field – đã làm), G (thanh lớp che modal, chữ "null"). **Đã nhận và làm:** A (index.html), C (ownsPrompt, .t0-missing).
**Cập nhật 20/11 (sau yêu cầu F, B):** legacy/tabiiy5.js chỉ gộp vào dist tabiiy5; ghim skills/link mở qua T0.blocks; giọng đọc bỏ {}; chấm cảnh không tràn. Đếm lại: 0 "chưa hỗ trợ", 0/3.489 ghim không mở được.
**Còn lại:** chưa chuyển chữ tiêu đề mục ru→uz ở trang đổi chữ của biologiya5; vài đoạn vòng quanh ảnh tràn hộp.
