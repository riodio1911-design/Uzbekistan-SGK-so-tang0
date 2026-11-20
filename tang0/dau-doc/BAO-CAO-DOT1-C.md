# Báo cáo đợt 1 – agent C (Bài tập): 002, 003

**Xong:** 002 (`ex.order`) và 003 (16 dạng: fill_blanks, self_check, sketch, true_false, choice_multi, label_reveal, match_pairs, choice_per_row, mark_done, spreadsheet, crossword, label_diagram, list_examples, experiment_variables, sim_task, oral_recording). Mã: `components/ex/*.js` (17 file mới + `_chung.js` tiện ích/chuỗi uz-ru-vi). Chấm theo đúng `grading.rule` của thư viện (per_position mặc định D2, all_or_nothing, set_equal, per_row_*, per_pair, per_word_norm, regex_class, consistency_3…).

**"Chưa hỗ trợ" ex.\* trước → sau** (`_thu/C/dem.js`, book.json thật): tabiiy5 110→0, fizika8 37→0, kimyo8 19→0, informatika5 17→0, biologiya5 12→0, adabiyot5 8→0, matematika5 0→0. Tổng 203→0.

**Kiểm tra đạt** (`_thu/C/thu.js`): 25 bài thật, mỗi dạng có chấm thử sai rồi đúng (sai <1, đúng =1); dạng không chấm: rỗng → "empty", có làm → lưu. 0 lỗi console, không cuộn ngang (390/820), 0 nút/ô <44px (lưới ô chữ chỉ để nhìn, nhập qua danh sách câu hỏi ≥44px). Ảnh `_thu/C/_anh/C-*.png`: điện thoại uz/ru/vi, máy tính bảng uz/ru/vi, tối (`tablet-vi-toi`, `phone-vi-sheet-toi`), kéo thả order (`phone-ru-order-keo`).

**Yêu cầu:** gửi D – `ownsPrompt`, lớp ảnh thiếu ở pageCrop (chờ). A đã làm xong (answer đa ngữ, `sequence{text,image}` + 8 SVG, mẫu theo ngôn ngữ) → đã sửa, thử lại đạt uz/ru/vi (`thu-a.js`). Nhận D → C `T0.answers`: ghi/đọc trong 6 dạng. Đã gộp bộ tính bảng tính với E thành một `T0.sheet` (`thu-bang.js`: bộ kiểm tra của E vẫn đạt, 12/12 cảnh).

**Còn lại:** đáp án ru/vi do A thêm chưa duyệt; ảnh sơ đồ `wb-flower.png`/trang vở chưa có trong `_mau` nên label_diagram thử trên nền trống; ghi âm chỉ cục bộ (chấm nói là 040); sketch/sim_task/oral chờ GV chấm (009).
