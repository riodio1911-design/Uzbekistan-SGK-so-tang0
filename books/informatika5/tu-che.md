# informatika5: phần tầng 0 v0.9.0 chưa biểu diễn được

Trong `book.json`, chỗ nào phải xử lý tạm đều có đánh dấu `"_tu_che": "<mã>"`. Tầng 0 KHÔNG bị sửa, cũng không có thành phần mới nào được tự chế thêm vào tầng 0.

## A. Dữ liệu / cấu trúc

### TC01: Mẫu màn hình demo (`window.DEMO_STG`)
- **Mô tả:** 9 mẫu stage cho các demo: desk, mouse, kbd, doc, paint, sheet, scratch, web, mail. Mỗi mẫu có `els[{id,k,x,y,w,h,l,g,c}]` và `bg`, tọa độ tính theo % trên màn hình 16:10. Nhãn trong mẫu viết cứng bằng tiếng Anh hoặc tiếng Uzbek, chưa có bản đa ngữ.
- **Vị trí trong mã cũ:** `window.DEMO_STG`. Mẫu được dựng bằng helper `row()`/`win()` trong script "Screen-demo player".
- **Số lượng:** 9 mẫu, dùng cho 81 demo.
- **Cách tạm xử lý:** giữ nguyên dữ liệu trong `tu-che/demo-stg.json`. Mỗi `simulations[].params` (sim.screen_demo) có `stage`, `stage_template_ref: "tu-che/demo-stg.json#<stage>"` và `_tu_che: "TC01"`.
- **Đề xuất cho tầng 0:** đưa các mẫu stage vào `thu-vien/mo-phong`, làm preset của `sim.screen_demo`, kèm nhãn i18n. Lý do: đây là dữ liệu của trình phát, không phải nội dung riêng của cuốn. Nếu cho phép cuốn tự định nghĩa stage, cần thêm chỗ trong schema, ví dụ `params.stage_def`.

### TC02: Thay video thật cho demo (db `media/<demo id>`)
- **Mô tả:** giáo viên (`user.canEdit` hoặc `__TEACH`) gắn link hoặc tải tệp lên (qua `assets`) để thay demo. Dữ liệu cũ lưu dạng `{url}` hoặc `{asset, name}`, không theo ngôn ngữ.
- **Vị trí trong mã cũ:** `MED`, `setMed`, `ML`, khối `med()` trong `openDemo`.
- **Cách tạm xử lý:** khi chuyển, đổi sang `teacher.media_overrides[<id>].by.all` theo ánh xạ `{url}` → `{mode:'url', url}` và `{asset, name}` → `{mode:'asset', asset, title:name}`. Bản dịch hiện để rỗng `{}` vì db thật không đọc được ở bước này. Ngoài ra `params.teacher_media_replace: true` được đặt trên mỗi demo. Schema đã chứa được dữ liệu này nên không coi là tự chế; chỉ cần script chuyển đổi khi publish.
- **Đề xuất cho tầng 0:** ghi ánh xạ trên vào README của schema, phần `teacher.media_overrides`.

### TC03: Thuật ngữ không có cấu trúc riêng trong mã cũ
- **Mô tả:** chữ của Glossariy (tr. 130–175) và các dòng "Kalit so‘zlar" chỉ nằm trong `PG.tr`.
- **Cách tạm xử lý:** `pages[].tr` vẫn giữ đủ chữ. `book.glossary` được điền 838 mục `term.*` lấy từ `tri-thuc/thuat-ngu.json`. Có 9 mục là thuật ngữ liên môn, nên định nghĩa có thể đến từ cuốn khác (cờ `KIEM_TRA_nghia_lien_mon`). Có 18 mục vi/ru bị lặp ngoặc, lỗi này đã có sẵn trong dữ liệu gốc. Mục này không gắn `_tu_che`.
- **Đề xuất cho tầng 0:** thêm trường `glossary_entry.kind` (glossary | keyword) và `en`, vì Glossariy của cuốn này có tên tiếng Anh.

## B. Đầu đọc thiếu renderer (preview hiện "Chưa hỗ trợ: …")

| Mã | Thành phần | Số lượng trong cuốn | Ảnh |
|---|---|---|---|
| TC-DD1 | `sim.screen_demo` | 81 demo / 1.426 bước | `preview/_anh/06-demo-d8.png` |
| TC-DD2 | `ex.order` | 14 hoạt động | `preview/_anh/11-model-p66.png` |
| TC-DD3 | `ex.spreadsheet` + `sim.spreadsheet_mini` (dạng cảnh và dạng tương tác) | 3 mô hình + 12 cảnh | – |
| TC-DD4 | Cảnh `sim.scene_text_lines` (69), `sim.scene_steps` (62), `sim.scene_keys` (12), `sim.scene_code_blocks` (10) | 153/301 cảnh | – |
| TC-DD5 | Đọc lời thuyết minh của từng bước demo (clip `d*-s*`) | 459 clip | – |

Đầu đọc đã chạy được: trang + vùng dịch + ghim, `ex.open_response`, `ex.short_answer`, `ex.choice_single`, `ex.sort_bins`, `sim.scene_player`, `sim.scene_page_image` (136 cảnh).

### TC-DD6: Lỗi giao diện vỏ (không phải core)
- **Hiện tượng:** ở khổ 390 px, tên sách dài (uz/ru) làm `select#t0-book` rộng ra, gây cuộn ngang (scrollWidth 486/420).
- **Cách xử lý ở bản sao:** chỉ sửa `preview/src/index.html`, thêm CSS `.t0-ctrl{min-width:0}` và `.t0-sel{max-width:100%;min-width:0}`.
- **Đề xuất:** đưa đúng phần CSS này về `tang0/dau-doc/index.html`.

## C. Mã thừa không chuyển (có chủ ý)
- Nhánh trực quan Toán trong `V()` và `openModel()`: pv, shift, frac, area, tri, cuboid, ratio. Không có dữ liệu nào dùng các nhánh này.
- Khóa localStorage `gul:done`; nhánh `think`/`workbook` trong Robo `onRoute`; từ điển `RRU`. Lý do: D2 quy định ghi `ru` thẳng vào chuỗi.
- Trạng thái học sinh cũ `inf5.ans['n.i.j']` chuyển được qua `exercises[].legacy_ids` (`'<n>.<i>'`) cộng `items[].id = j`.
