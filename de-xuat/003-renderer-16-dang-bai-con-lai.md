# 003 – Renderer 16 dạng bài còn lại đã có trong thư viện

**Ưu tiên:** P0 · **Độ khó:** vừa · **Phụ thuộc:** Không · **Số chỗ thiếu thô gộp vào:** 3

## Thay đổi gì
Viết renderer cho các `ex.*` đã có trong `thu-vien/bai-tap/danh-muc.json` nhưng đầu đọc chưa có (đếm trên `book.json`):
| ex.* | bài | cuốn |
|---|---|---|
| fill_blanks | 27 | tab 25, adab 2 |
| self_check | 23 | tab |
| sketch | 17 | tab |
| true_false | 11 | tab |
| choice_multi | 10 | tab |
| label_reveal | 8 | bio |
| match_pairs | 6 | tab |
| choice_per_row | 5 | tab 4, bio 1 |
| mark_done | 5 | adab |
| spreadsheet | 3 | inf (xem 006) |
| crossword | 3 | tab |
| label_diagram, list_examples, experiment_variables, sim_task, oral_recording | 1 mỗi dạng | tab ×4, adab |
Thứ tự gợi ý: true_false, choice_multi, choice_per_row, mark_done, self_check (dễ, 54 bài) → fill_blanks, match_pairs, label_reveal (41) → sketch, crossword, label_diagram, sim_task, oral_recording, experiment_variables, list_examples.

## Vì sao + bằng chứng
tabiiy5 "Đầu đọc thiếu": 13 dạng, 110/314 bài. biologiya5 TC02 (label_reveal 8, choice_per_row 1). adabiyot5 DD-1 (mark_done 5, oral_recording 1, fill_blanks 2). informatika5 TC-DD3 (spreadsheet). Tổng **123 bài**.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** tabiiy5, biologiya5, adabiyot5, informatika5
- **Loại sách mới:** Các dạng này là nền cho nhiều dạng mới (ví dụ `ex.listen_select` dựng trên `choice_single`/`choice_multi`, `ex.word_search` trên `crossword`).
- **Mở khóa:** 123 bài; tabiiy5 từ 65 % lên 100 % bài (khi có thêm 002).
- **Nguồn đã nêu chỗ thiếu này:** adabiyot5, biologiya5, tabiiy5

## Tương thích ngược
Có. Dữ liệu đã theo `data_shape`; chỉ thêm renderer.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P0
- Phụ thuộc: Không

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 36 | tabiiy5 | dau_doc_renderer | 13 dạng bài chưa có renderer | fill_blanks 25, self_check 23, sketch 17, true_false 11, choice_multi 10, order 7, match_pairs 6, choice_per_row 4, crossword 3, label_diag… |
| 44 | biologiya5 | dau_doc_renderer | TC02b ex.label_reveal, ex.choice_per_row | Hai dạng bài chưa có renderer |
| 65 | adabiyot5 | dau_doc_renderer | DD-1 ex.mark_done, ex.oral_recording, ex.fill_blanks | Ba dạng bài hiện "Chưa hỗ trợ" |
