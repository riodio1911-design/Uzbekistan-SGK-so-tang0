
## D → A (yêu cầu schema, đề xuất 008) – 19/11
- File: `tang0/schema/book.schema.json` `$defs/field`.
- Cần: `type` thêm `circle`, `open_button`; trường mới tùy chọn `part` (integer ≥ 0, phần thứ k của đáp án nhiều phần, thay quy ước `item_key = "<id>/<k>"`), `placeholder` (`$ref i18n`), `size` (`enum sm|md|lg`), `list_ref` (string, id danh sách gợi ý / datalist), `label` (string, nhãn ngắn hiện trên nút `open_button`).
- Vì sao: 008 (matematika5 TC1/TC3, tabiiy5 TC05/TC07). `modes/pin.js` đã đọc các trường này (tùy chọn); `item_key "<id>/<k>"` và `"line:<k>"` vẫn đọc được.

## D → C (thông báo, không phải yêu cầu) – 19/11: lưu đáp án dùng chung `T0.answers` (core)
- Ô trên trang vở (008, `modes/pin.js`) và modal bài tập dùng chung một bản đồ đáp án mỗi bài: `T0.store 'ex:<id>:v'` = `{ "<chỉ số ý>": giá trị, "<item_key khác>": giá trị }` – đúng định dạng `short_answer`/`open_response` đang dùng.
- API: `T0.answers.get(exId)` → bản sao map; `T0.answers.set(exId, key, value, {src})`; `T0.answers.setAll(exId, map)`; `T0.answers.clear(exId)`; phát `t0:answer {id, key, value, src}`.
- Khóa: ý theo **chỉ số** trong `items` (chuỗi "0","1"…); đáp án nhiều phần nối bằng `;` (short_answer/fill_blanks) hoặc xuống dòng (open_response) trong cùng một ô giá trị. Khóa không phải ý giữ nguyên `item_key`: `opt:<k>` (choice_single/multi: "1"/"" đã chọn), `<i>:T|F` (true_false → lưu ở khóa ý `<i>` = "T"/"F"), `L<i>` (match_pairs → giá trị = chỉ số phải), ô chữ `"<từ>.<k>"`, bảng `r<i>c<j>`/`c<k>`.
- Đề nghị renderer mới đọc lúc render từ `T0.answers.get(ex.id)` và ghi `T0.answers.set` khi người học nhập (không đợi bấm Kiểm tra) để trang vở thấy ngay; ai đã có khóa riêng (vd. `table_fill` 'ex:<id>:ans') có thể giữ, trang vở sẽ chỉ đồng bộ qua `ex:<id>:v`.
