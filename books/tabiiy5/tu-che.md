# tabiiy5 – những gì tầng 0 v0.9.0 chưa biểu diễn được

Bước ④ không tự thêm thành phần mới vào tầng 0. Mỗi chỗ còn trống được giữ trong `book.json` ở trường tự do (`params`, `data`) và đánh dấu `"_tu_che": "<mã>"`. Số liệu lấy từ `_work/stats.json` và `doi-chieu.json`.

| Mã | Mục | Vị trí trong mã cũ | Số lượng | Tạm xử lý trong book.json | Đề xuất cho tầng 0 |
|---|---|---|---|---|---|
| TC01 | Mô phỏng: phần logic vẽ vẫn nằm trong mã | `ACT.*` (dòng ~5105–5640), `WB RENDER.sim` | 27 (26 ACT + 1 WB sim) | `simulations[]` đúng `sim.*` theo bang-anh-xa. `params.text` = mọi chuỗi đa ngữ có trong hàm (đã có ru), `params.images`, `params.variant` (sound_vibration, magnet_lab), `params.code_ref` = `tabiiy5/index.html#ACT.<key>`. Riêng WB sim đã tách hết `conditions`, `result_table`, `predictions`. Đây là cách làm theo M5 | Viết renderer `sim.*` theo `params` của danh-muc mô phỏng, rồi tách nốt số liệu (bảng RES, toạ độ, ngưỡng) ra `params`. Đến lúc đó, `code_ref` trỏ tới mã cũ vẫn là nguồn tham chiếu |
| TC02 | Cảnh video vẽ tay `draw(p,s,L)` | `VIDEOS.v*.scenes[k].draw` (script 11–20) | 88/136 cảnh | `visual.kind = sim.scene_custom_draw`, `params.code_ref`. Lời thuyết minh, `min_seconds`, `audio_ref` đã đủ. 48 cảnh VK (photo/cards/grid/explain) đã thành tham số đầy đủ | Đặt tên định dạng chuẩn cho cảnh tự vẽ, ví dụ SVG theo khung hình hoặc kịch bản JSON (M2), hoặc ghi video bằng nhà máy media (`sim_recording_mp4`) |
| TC03 | Khối thông tin hiện sau khi phân loại | `ACT.bin92` (`const NEXT`) | 1 bài (7 chuỗi) | `exercise.data.after_check_info` | Thêm cho `ex.sort_bins` một trường `after_check` (giải thích hoặc nội dung mở ra sau khi Kiểm tra) |
| TC04 | Ảnh thẻ là SVG vẽ bằng mã | `ACT.order12` (`stagePic`), WB `plate` (`__plant`) | 2 bài (8 ảnh) | `data.item_images = "code:…"` | Xuất ra `sim/<id>-<k>.svg` như R2 đã làm với `flower.svg`, hoặc thêm `sequence[].image` cho `ex.order` |
| TC05 | Ô khoanh tròn trên trang vở (`circ`) | `genItem` mcq `p.circ` | 38 ô / 11 bài | `exercise.data.on_page_circles[{page, box, item_key}]` | Thêm `circle` vào `$defs/field.type` |
| TC06 | Văn bản thuyết minh của clip khối là chuỗi ghép | `lessonItems()` / `nItem()` | 145 clip × 3 thứ tiếng | `clip.text_path` trỏ tới khối hoặc `/units/i/intro`. `source_hash` = sha256(NFC(chuỗi ghép)), tức `strip(**)`, nối title+paras(+steps "k. ", note) bằng dấu cách, objectives có câu dẫn "Mavzuni o‘rganish davomida:" | Quy định cách ghép (`narration_compose`) hoặc thêm `clip.text` để Đóng gói tính lại được text_hash |
| TC07 | Thuộc tính phụ của ô vở | `paperSpec` / `genItem`: `ph`, `sm`, `cls:'num'`, `big`, `list` (datalist) | 210 ô có ph/list, 177 ô `sm`, 4 ô num/big | Bỏ qua (gợi ý chữ của ô có sẵn trong đề bài, bank nằm ở `data.bank`). `lined` → `write_lines` | Thêm `field.placeholder`, `field.size`, `field.list_ref` |
| TC08 | Cờ `wide` của ảnh gallery | `learn.gallery[].wide` | 7 | Bỏ qua (chỉ ảnh hưởng trình bày) | Thêm `gallery[].wide` hoặc `aspect` |
| TC09 | Tỉ lệ trang vở và chương không sinh ô tự do | `PAGE_AR = 1100/1451`, `WB.chapters[n].noFree` | 1 hằng, 9 chương | Ô tự do đã sinh sẵn nên `noFree` đã có tác dụng; `crop.width_px` = `cropW` | Thêm `volumes[].page_aspect` |
| TC10 | Chuỗi chưa có ru | RUDICT không có khóa | 3/3365 | Để nguyên uz (bản cũ cũng hiện uz) | Dịch bổ sung khi duyệt bản dịch (T3) |

## Đầu đọc thiếu (preview hiện "chưa hỗ trợ" hoặc bỏ qua; không sửa core)

- **Renderer bài tập:** có 5 dạng (`choice_single`, `open_response`, `short_answer`, `sort_bins`, `table_fill`). 13 dạng còn thiếu, chiếm 110/314 bài:
  - `fill_blanks` 25, `self_check` 23, `sketch` 17, `true_false` 11, `choice_multi` 10, `order` 7, `match_pairs` 6
  - `choice_per_row` 4, `crossword` 3
  - `label_diagram`, `list_examples`, `experiment_variables`, `sim_task`: mỗi dạng 1 bài
- **Renderer mô phỏng:** chỉ có `figure_explorer` (dùng cho mô hình hoa). Thiếu 22 kind với 26 bản, từ `germination_lab` tới `satellite_uses`.
- **Cảnh video:** thiếu 3 kind là `scene_cards` 14, `scene_icon_grid` 14, `scene_explain` 12. `scene_page_image` có renderer nhưng chỉ nhận `crop`, chưa nhận `img` của `VK.photo` (8 cảnh).
- **Lớp ô nhập trên trang vở:** `pages[].fields` (877 ô) chưa được chế độ ghim vẽ ra. Trang vở mới chỉ hiện ảnh trang.
- **Ghim chưa có cách mở:**
  - Ghim `skills` (23) và `term` (84): hàm `resolve()` trong `modes/pin.js` không xử lý hai kind này.
  - Ghim `workbook` (35) chuyển sang chế độ bài học.
