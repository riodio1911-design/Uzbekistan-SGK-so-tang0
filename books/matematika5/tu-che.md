# matematika5: phần tầng 0 v0.9.0 chưa biểu diễn được (tự chế tạm)

Nguồn: `fix/matematika5/index.html`. Dữ liệu lấy bằng `tang0/tri-thuc/_scripts/dump.js` vào `_work/raw.json`, chuyển bằng `_tools/convert.py`.
Quy ước: chỗ nào schema cho phép trường tự do (`exercise.data`) thì có đánh dấu `"_tu_che": [...]`. Chỗ nào schema cấm trường thêm (`additionalProperties: false`) thì chỉ ghi quy ước ở đây. Chưa thêm thành phần nào vào tầng 0.

## A. Dữ liệu

| Mã | Mô tả | Vị trí trong mã cũ | Số lượng | Cách xử lý tạm trong book.json | Đề xuất cho tầng 0 |
|---|---|---|---|---|---|
| TC1 | Một ý có nhiều ô nhập trên trang vở; đáp án các ô nối bằng `;` | `window.WBI['<trang>']['i.j']` có nhiều `[x,y,w]`; `chkInline` | 204 ô / 92 ý / 30 bài | `fields[].item_key = "<id ý>/<k>"`, trong đó k là thứ tự phần trong đáp án `;`. Bài gắn `data._tu_che: ["TC1"]` | Thêm `field.part` (số nguyên) |
| TC2 | Chuỗi không thuộc ngôn ngữ nào: biểu thức toán, số, tên riêng | `items[].q` dạng chuỗi (572), `quiz.a[]` dạng chuỗi, `lines[]` dạng chuỗi | 1.149 chuỗi | Ghi là `{"uz": "<chuỗi>"}`; đầu đọc lùi về uz nên vẫn hiện đúng. Riêng `lines` của `sim.scene_text_lines` giữ chuỗi trần | Cho `i18n` nhận chuỗi trần, hoặc thêm khóa `zxx` = trung tính |
| TC3 | Ý tự luận trên trang vở là nút "✎ a" mở modal, không phải ô gõ | `pageHTML` nhánh `BK==='wb'`, `button.ia.op` | 43 nút / 22 bài | `fields[].type = "textarea"`, `box = [x,y,w]`. Bài gắn `data._tu_che: ["TC3"]` | Thêm `field.type = "open_button"` (mở bài tập) |
| TC4 | Khóa lưu bài làm cũ tính theo vị trí ý: `mat5.ans['<n>.<i>.<j>']` (SGK), `['w<n>.<i>.<j>']` (vở) | `exKey()` | 1.461 ý | `exercise.legacy_ids = ["p<n>.ex<i>"]` hoặc `["w<n>.ex<i>"]`, giữ đúng thứ tự `items` gốc: ý j = `items[j]`. Không đánh dấu được (exercise_item không có trường tự do) | Thêm `exercise_item.legacy_index`, hoặc ghi quy tắc chuyển khóa vào schema |
| TC5 | Hai bài cùng số in trên một trang (thường là hai bài học trên cùng trang) | `PG[n].ex[].no` | 21 bài | Id bền `p<n>.q<số>-2`, `-3`… Gắn `data._tu_che: ["TC5"]` | Chốt quy tắc id khi trùng số (gợi ý: thêm id bài học, ví dụ `p14.t12.q1`) |
| TC6 | Số bài "★" (bài khởi động) | `ex.no = '★'` | 83 bài (SGK + vở) | Id `p<n>.qstar`; `no` giữ "★". Gắn `data._tu_che: ["TC6"]` | Chốt token cho số không phải chữ số |
| TC7 | Tỉ lệ ảnh trang 1241×1635 viết cứng trong mã (`fit()`, crop `img`) | `fit`, `V()` nhánh `img` | 1 giá trị | Ghi trong `profile.edition.note` | Thêm `profile.page_aspect` hoặc `volumes[].page_size` (thư viện mô phỏng đã ghi nhu cầu này) |

Không coi là tự chế (đã có chỗ trong schema): tên bộ vở (`setName()` → `workbook_sets[].title`, dựng từ chuỗi U), mục "Kirish · Mundarija" (`units[intro]`, chỉ có uz như mã), đố nhanh, nhắc việc và tool của Robo (`features.tutor`), `hw/` và `res/` (`teacher`, `features.classroom`).

## B. Đầu đọc thiếu (`dau-doc` v0.9; không viết lại core)

| Mã | Thiếu | Ảnh hưởng | Bằng chứng |
|---|---|---|---|
| DT1 | Chưa có renderer cho `sim.scene_text_lines`, `sim.place_value`, `sim.decimal_shift`, `sim.fraction_model`, `sim.fraction_area`, `sim.triangle_area`, `sim.cuboid_volume`, `sim.ratio_bars` | 209/276 cảnh video và 33/33 mô hình hiện "Chưa hỗ trợ". Cảnh `img` (67) chạy được | `preview/_anh/m5-model-t8-vi.png`, `m5-video-t8-canh3-lines-vi.png` |
| DT2 | Chế độ ghim không vẽ `pages[].fields` | Vở mất 917 ô nhập trên trang (vẫn mở được 333 bài qua ghim) | `m5-wb-w5-vi.png` (0 input) |
| DT3 | Ghim `workbook` không chuyển sang bộ vở khi không có lớp bài học. Thiếu thanh điểm bộ (thang 10), bảng "Bài về nhà", giao bài, "Kết quả cả lớp" | 50 ghim báo "không có dữ liệu"; tính năng lớp học (`features.classroom`) chưa có giao diện | `m5-tb-p7-wbpin-uz.png` |
| DT4 | Không dựng ký pháp phân số `{tử/mẫu}` (hàm `M()` cũ) | ≈6.300 chỗ trong chuỗi hiện nguyên dạng `{2/3}` | đọc mã `core.js` |
| DT5 | Không hiện dòng hướng dẫn cách gõ (`ui_strings.type`: "Phân số gõ 2/3, hỗn số gõ 1 2/3") trong modal bài tập | Học sinh không biết cách gõ phân số | đọc mã |
| DT6 | Chữ cố định tiếng Uzbek trong mô phỏng cũ (`PVN`, "Raqamlar chapga", "Surat/Maxraj", "Bir qavatda … kub") | Cần chuỗi đa ngữ khi viết renderer cho DT1 | `V()`, `openModel()` |
