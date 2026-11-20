# Báo cáo đợt 1 – A (id và chỗ lệch): 015, 020

**Đã xong**
- **015:** quy tắc id bền được ghi trong `schema/README.md`. Thêm `exercise.series` cùng `$defs/exercise_series`, và công cụ `schema/_tools/id_ben.py` (chạy lại vẫn cho cùng kết quả). Đã sinh lại 233 id: matematika5 23, informatika5 115, kimyo8 38, fizika8 57 (gồm 24 hình `chizma`→`rasm_`). Id cũ nằm trong `legacy_ids`. Tham chiếu đã đổi theo. Bảng đổi id: `schema/_tools/doi-id-dot1.txt`. adabiyot5 đã rà: giữ bid làm id (khóa của mã gốc, đã đóng băng).
- **020:** params `sim.scene_page_image` và `picture_story.scenes` đổi sang `crop={page,box,volume?}`. `kiem-tra.py` chỉ quét `@nguồn` ở trường asset. Ví dụ adabiyot5 dùng 581.11×822.05. Phần CSS 390 px đã gửi cho D (`index.html` không thuộc A).

- **Giao thêm (008):** `field.part` đã áp: matematika5 204 ô (`a/1`), tabiiy5 161 ô (`line:k`). Khóa cũ ghi ở `legacy_item_key`. Nhãn TC1 của matematika5 đã bỏ: `tu_che` của ô trang 247→43, của bài vở 49→22.

- **Yêu cầu G:** đã làm (`class_summary`, `result_key` nhận hai dạng, chưa đổi mặc định; `content_overrides.lesson`; bảng khóa cũ trong README).
- **Yêu cầu E:** đã làm (preset/`stage_def` screen_demo, `spreadsheet_mini.interactive`, ghi chú cReact0; inf5 bỏ TC01).
- **Yêu cầu C, F:** đã làm hết, chỉ trừ mục tùy chọn `germination_lab factor`. Chi tiết ở YEU-CAU.md (A → C, F, D).

**Id sai quy tắc, trước → sau:** m5 23→0, inf5 115→0, kim8 38→0, fiz8 57→0. tabiiy5, biologiya5, adabiyot5: 0. Số khung "chưa hỗ trợ" không đổi, vì A không viết renderer.

**Kiểm tra:** `kiem-tra-tat-ca.sh` đạt 6/6. `kiem-tra.py` có mục 8 mới (7 book.json: schema, id, `@nguồn`), cả 7 đạt. doi-chieu 4 cuốn chạy lại, tổng lệch 0. matematika5 `tu_che` bài SGK 68→0. Đếm lại: `_thu/A/dem.py`.

**Yêu cầu**
- Đã nhận từ D (008, `$defs/field`): đã làm.
- Đã gửi: cho D (CSS); cho B (`crop.volume` chưa được truyền vào pageCrop); thông báo cho G (014 dùng `legacy_ids`).

**Còn lại**
- Nâng `version` lên 0.10.0 khi đóng đợt.
- `block.anchor` (019, P1).
