# Thư viện bài tập (tầng 0, v0.9.0 – D2 đã chốt)

Thư viện gom mọi dạng bài tập đã thấy trong 7 cuốn (matematika5, informatika5, tabiiy5, biologiya5, adabiyot5, kimyo8, fizika8) về một danh mục id dạng `ex.*`. Agent Schema tham chiếu các id này qua trường `kind` (pattern `^ex\.`).

| File | Nội dung |
|---|---|
| `danh-muc.json` | 24 mục: 22 dạng bài (`role: "exercise"`) và 2 trợ giúp gắn kèm (`role: "aid"`) |
| `bang-anh-xa.csv` | 84 dòng `book, ma_goc, ex_id, ghi_chu`. Phủ đủ 59/59 mã `loai_bai_tap` của 7 bản kiểm kê, thêm 7 dòng cho trợ giúp |
| `kiem_tra.py` | Kiểm tra độ phủ, id, tên trùng, enum. Chạy bằng `python3 -I kiem_tra.py` |

## Cách phân loại

Một dạng bài được xác định bởi **hai thứ: hình dạng dữ liệu đề và hình dạng câu trả lời**. Ba thứ sau đây là **tùy chọn của cùng một dạng**, không tạo dạng mới:

- **Giao diện** (`ui_variants`):
  - `modal`: cửa sổ mở từ ghim
  - `on_page_scan`: ô đặt trên ảnh trang gốc hoặc ảnh vở quét
  - `on_page_rebuilt`: ô đặt trên trang dựng lại chữ thật
  - `lesson_block`: trong khối của lớp "bài học"
  - `workbook_interactive`: vở bài tập bản tương tác
  - `quiz_set`: bộ câu có điểm tổng
  - `tutor_chat`: trong khung chat gia sư
- **Cách chấm** (`grading.modes` thuộc `tu_dong | ai | giao_vien | khong_cham`, kèm `grading.rules` ghi quy tắc cụ thể và cuốn đang dùng).
- **Cách thao tác**: nút ↑/↓, chạm theo thứ tự, gõ số. Ghi ở trục 6.

Vì thế, ô `ans` trong modal và ô `ans` trên ảnh vở của matematika5 là cùng một dạng `ex.short_answer`. Câu hỏi mở không chấm (Hóa, Lý) và câu hỏi mở có AI chấm (tabiiy5) cũng là cùng một dạng `ex.open_response`.

Trợ giúp (`role: "aid"`) không phải dạng bài. Chúng gắn vào bài qua trường `aids`: `ex.aid.hint_ai` (nút gợi ý AI) và `ex.aid.show_solution` (xem lời giải mẫu).

Một số quy ước trong `danh-muc.json`:
- `description` là ghi chú cho người phát triển nên viết chuỗi tiếng Việt thường. `name` là chuỗi hiển thị nên là object đa ngữ.
- `grade_bands.observed` là cấp đã thấy trong 7 cuốn. `suggested` là đề xuất, chưa kiểm chứng.
- Cấp được hiểu theo **lớp** (đã chốt ở D2): lớp 5 → `5-7`, lớp 8 → `8-9`.
- `grading.default_rule` = quy tắc mặc định của dạng; quy tắc có `alias_of` là bí danh cũ.

## Bảng tóm tắt

| id | Tên | Chấm | Số mục đã thấy | Cuốn |
|---|---|---|---:|---|
| ex.short_answer | Điền đáp án ngắn / đáp số | tự động (accept_v2) | 1.857 | Toán, Tin, Hóa, Lý, Tự nhiên (vở) |
| ex.open_response | Trả lời mở / tự luận | không chấm · AI · regex · GV (v1) | 1.206 | cả 7 |
| ex.choice_single | Trắc nghiệm một đáp án | tự động | 1.153 | cả 7 (+ Robo đố nhanh) |
| ex.sort_bins | Phân loại thẻ vào nhóm | tự động | 86 | Tin, Tự nhiên, Sinh, Hóa, Lý |
| ex.label_reveal | Đố nhãn hình (tự kiểm tra) | không chấm | 83 | Sinh |
| ex.order | Sắp xếp thứ tự | tự động (per_position) | 80 | Tin, Tự nhiên, Sinh, Hóa, Lý |
| ex.table_fill | Điền bảng | tự động · không chấm | 47 | Tự nhiên, Sinh, Văn |
| ex.fill_blanks | Điền vào chỗ trống | tự động · không chấm | 25 + chỗ trống tự sinh | Tự nhiên, Văn |
| ex.self_check | Tự đánh giá kỹ năng | không chấm | 23 | Tự nhiên (Sinh có renderer) |
| ex.sketch | Vẽ / phác thảo | không chấm | 17 | Tự nhiên (Văn có mã chết) |
| ex.true_false | Đúng / sai | tự động | 11 | Tự nhiên |
| ex.choice_multi | Chọn nhiều đáp án | tự động · không chấm | 10 | Tự nhiên |
| ex.match_pairs | Nối cột | tự động | 6 | Tự nhiên |
| ex.choice_per_row | Chọn theo từng hàng | tự động | 5 | Tự nhiên, Sinh |
| ex.mark_done | Tự đánh dấu đã làm | không chấm | 5 | Văn |
| ex.crossword | Ô chữ | tự động | 3 | Tự nhiên |
| ex.spreadsheet | Bảng tính mini | không chấm | 3 | Tin |
| ex.label_diagram | Gắn nhãn sơ đồ | tự động | 1 | Tự nhiên |
| ex.oral_recording | Thu âm / đọc diễn cảm | không chấm | 1 | Văn |
| ex.experiment_variables | Xác định biến thí nghiệm | tự động | 1 | Tự nhiên |
| ex.list_examples | Nêu ví dụ | tự động | 1 | Tự nhiên |
| ex.sim_task | Bài với thí nghiệm ảo | không chấm | 1 | Tự nhiên |
| ex.aid.hint_ai | Gợi ý của gia sư AI | (trợ giúp) | – | Toán, Tin, Hóa, Lý |
| ex.aid.show_solution | Xem lời giải mẫu | (trợ giúp) | – | Toán, Tin, Hóa, Lý |

Ba dạng `short_answer`, `open_response`, `choice_single` chiếm khoảng 95% số mục. Vở bài tập tabiiy5 một mình đóng góp 12 dạng.

## Các cặp đã gộp (cùng nghĩa, khác tên)

| ex_id | Các tên gốc đã gộp |
|---|---|
| ex.short_answer | matematika5 `ans (modal)` + `ans inline`; informatika5/fizika8 `ex.ans`; kimyo8 `ex (ans)`; tabiiy5 `WB short`, trường `in` |
| ex.open_response | `open` (Toán), `ex.open` (Tin, Lý), `ex (open)` (Hóa), `WB open`, `WB area` (Tự nhiên), `open_text` (Sinh), `talk`, `task.text`, `think/pre`, `wl` (Văn) |
| ex.choice_single | `quiz` (Toán, Tin, Hóa, Văn), `quiz.qs` + `WB mcq` (Tự nhiên), `mcq` (Sinh, Lý), `robo localQuiz`, `robo_quiz` |
| ex.order | `model.order`, `order` (5 cuốn), `GACT order`, `WB order`, `WB plate` (đĩa giấy ảo, `layout: cycle`) |
| ex.sort_bins | `model.sort`, `sort`, `sort (sorter)` |
| ex.table_fill | `WB tbl`, `WB table`, `table_fill`, `task.table` |
| ex.fill_blanks | `WB fill`, `WB map`, `gap (.e)` |
| ex.choice_per_row | `WB select`, `predict_check` (ACT.redi3) |
| ex.choice_multi | `WB mcq` (multi), `WB chips` |
| ex.sketch | `WB sketch`, `draw` |
| ex.self_check | `skills`, `self_check_skills` |

## Các trường hợp tách (cùng tên, khác nghĩa)

- **"label"**: `WB label` của tabiiy5 là chọn tên vào ô, có chấm → `ex.label_diagram`. `figure_label_quiz` của biologiya5 là ẩn nhãn rồi chạm để lật, không chấm → `ex.label_reveal`.
- **"hint"**:
  - `hint` của matematika5 là nút gợi ý AI → `ex.aid.hint_ai`.
  - `hint` trong item vở tabiiy5 là mô tả câu trả lời tốt, gửi cho AI chấm. Trong thư viện đặt tên trường là `rubric` để khỏi nhầm.
- **"table"**:
  - `WB table` của tabiiy5 là bài điền bảng.
  - Khối `table` của biologiya5 là bảng tĩnh, không phải bài tập, nên không đưa vào thư viện.
- **"ex.ans" / "ex.open"**: đây là mã nội bộ của informatika5 và fizika8, không phải id thư viện. Không dùng lại chúng làm id.
- **"sim"**: `WB sim` là lớp bài tập bọc ngoài (`ex.sim_task`). Bản thân mô phỏng thuộc `sim.*` của Thư viện mô phỏng. Tương tự, `ex.spreadsheet` chỉ bọc bộ tính `sheetVal`.
- **Tick không chấm**: `ex.self_check` là tự đánh giá theo danh sách kỹ năng. `ex.mark_done` là xác nhận đã làm một nhiệm vụ ngoài máy. Hai thứ này tách riêng.
- **`ex.choice_single` và `ex.choice_multi`** dùng chung mã `WB mcq` nhưng chấm khác nhau (so chỉ số với so tập hợp). Vì vậy `WB mcq` có 2 dòng trong `bang-anh-xa.csv`, chia 21/8 theo số mục đếm trong mã.

## Quy tắc chấm cần biết

- **`accept_v2` – MẶC ĐỊNH từ D2 (18/11/2026)**: chữ thường, **đổi** mọi dấu nháy (' ` ʻ ’ ʼ) về `‘` (o' o` oʻ o’ → o‘, g' → g‘), gộp khoảng trắng; số so với dung sai 1e-6 (dấu phẩy thập phân được chấp nhận); phương án tách `|` hoặc mảng; một ý nhiều ô tách `;`.
- **`accept_v2_math`** (tùy chọn, đặt bằng `grading.rule` hoặc `book.grading_defaults.short_answer_rule`): accept_v2 cộng các bước toán của nrm_v1 (`* x х ·` → `×`, gạch ngang → `-`, bỏ khoảng trắng quanh toán tử, nhóm nghìn). Khuyến nghị cho Toán/Lý/Hóa ở bước ④: khoảng 650 đáp án của 4 cuốn họ A có ký tự toán/số mà accept_v2 thuần sẽ chấm chặt hơn.
- **`nrm_v1`** – BÍ DANH CŨ (= `accept_v2_math`). Hành vi gốc ở Toán, Tin, Hóa, Lý:
  - Chuẩn hoá: chữ thường, **bỏ** dấu nháy, `,` → `.`, `* x х ·` → `×`, bỏ khoảng trắng quanh toán tử.
  - So bằng nhau, hoặc so số.
  - Các phương án tách bằng `|`. Riêng Toán có thêm phần `;` cho một ý gồm nhiều ô.
- **`per_position`** – MẶC ĐỊNH của `ex.order` (D2): điểm = số vị trí đúng / số mục; `all_or_nothing` là tùy chọn (vở tabiiy5).
- **`giao_vien_review`** – bật ở v1 (D2) cho `ex.open_response`, `ex.sketch`, `ex.oral_recording`, `ex.table_fill` (ô không đáp án), `ex.sim_task`: bài làm lên db `res/`, GV chấm trong bảng kết quả lớp, ghi `grade/`.
- **`ai_score_0_2`** (tabiiy5): gọi AI trả JSON `{score 0|1|2, feedback}`. Tính đúng khi score ≥ 2.
- **`ai_comment`** (Sinh, Văn): AI nhận xét 2–4 câu, không cho điểm.
- **`keyword_regex`**: dự phòng khi không có AI.

## Đề xuất bổ sung (chưa cuốn nào có, không nằm trong danh mục chính)

1. ~~Giáo viên chấm~~ – đã bật ở v1 (D2).
2. ~~Lưu kết quả mọi dạng lên db~~ – đã chốt cho cả 7 cuốn (D2, xem `schema/` `features.classroom`).
3. Một bộ chuẩn hoá chung: D2 chọn `accept_v2` (+ `accept_v2_math`); còn lại đơn vị đo, phân số, dung sai theo từng ý.
4. **Thu âm thật** cho `ex.oral_recording` (micro), lưu lại cho giáo viên nghe.
5. **Kéo thả** cho `sort` và `order`, cùng **vùng chạm lớn** cho cấp 0–2 và 3–4. Hiện mọi cuốn chỉ dùng nút hoặc chạm.
6. **Chấm `ex.spreadsheet`** theo giá trị ô kết quả. **Chấm phần dự đoán** của `ex.sim_task`.
7. **Chuyển dữ liệu viết cứng ra JSON**: `CROSS`, `LBL`/`LBLBOX`, `MAP`, `FLOWERING`/`NONFLOWER`, nhãn của `factor`, `ACT.redi3`.
8. Câu hỏi hình ảnh hoặc âm thanh cho cấp 0–2 (chọn tranh, nghe rồi chọn). Đây là nhu cầu dự kiến cho lớp 0–2, chưa có mẫu trong 7 cuốn.

## Đã chốt ở D2

Xem `../../quyet-dinh/D2.md` (mục Thư viện bài tập).
