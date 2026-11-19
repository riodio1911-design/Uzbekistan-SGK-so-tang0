# kimyo8 – những gì tầng 0 v0.9.0 chưa biểu diễn được

Kết luận ngắn: mọi nội dung của cuốn cũ (trang, vùng dịch, ghim, bài tập, đáp án, lời giải, hình, video cảnh, clip audio, thuật ngữ) đều biểu diễn được bằng `book.schema.json` và các `ex.*`/`sim.*` có sẵn trong thư viện. Vì vậy **book.json không có chỗ trống `_tu_che`** và cột `tu_che` trong `doi-chieu.json` bằng 0 ở mọi dòng.

Các mục dưới đây là chỗ hở ở **đầu đọc**, **quy tắc id**, **dữ liệu chạy (db/localStorage)** và **công cụ kiểm tra**. Chúng không làm mất nội dung, nhưng bước sau cần xử lý. Theo hướng dẫn, không có thành phần nào được tự chế trong tầng 0.

Vị trí "mã cũ" ghi theo `fix/kimyo8/index.html` (tên biến/hàm, không ghi số dòng vì file là một khối 2,8 MB).

---

## A. Đầu đọc thiếu (renderer)

Đầu đọc dùng chung (`tang0/dau-doc`) hiện có 5 renderer bài tập (`choice_single`, `open_response`, `short_answer`, `sort_bins`, `table_fill`) và 4 mô phỏng (`scene_player`, `scene_page_image`, `atom_shells`, `figure_explorer`, cùng `scene_custom_draw`). Các mục còn thiếu hiện khung "Chưa hỗ trợ: …". Đã chụp lại ở `preview/_anh/08-…` và `11-…`.

| Mã | Thiếu | Vị trí trong mã cũ | Số lượng | Trong book.json | Đề xuất cho tầng 0 |
|---|---|---|---|---|---|
| TC-A1 | renderer `ex.order` | `openModel` nhánh `k==='order'` (nút lên/xuống, chấm từng vị trí) | 19 bài, 110 bước | đủ: `kind: ex.order`, `sequence[]`, chấm mặc định `per_position` | Viết `components/ex/order.js` theo `data_shape` của thư viện. 5 cuốn đang cần dạng này |
| TC-A2 | `sim.scene_text_lines` | `V()` nhánh `k==='lines'`, có đánh dấu phân số `{a/b}` | 177 cảnh | `params.lines[]` (chuỗi trung tính hoặc i18n) | Renderer hiện từng dòng (delay 1,3 s), dùng lại bộ vẽ phân số của matematika5 |
| TC-A3 | `sim.scene_steps` | `V()` nhánh `k==='steps'` | 193 cảnh | `params.items[]` i18n | Renderer danh sách bước hiện dần (delay 1,1 s) |
| TC-A4 | `sim.scene_icon_grid` | `__DRAW.cIcons` | 29 cảnh | `params.title`, `items[{e,t}]` | Lưới emoji + nhãn |
| TC-A5 | `sim.chem_reaction` | `__DRAW.cReact`, `__parseF`, `__chemBalance`, `__pretty` | 55 cảnh | `params.eq`, `cond?`, `title` | Chuyển thư viện vẽ hóa học (`window.__DRAW`, `window.CHEM`) thành component; chỉ tách chữ và số liệu ra params (D2 M5) |
| TC-A6 | `sim.chem_molecule_3d` | `__DRAW.cMol`, `__geom` | 30 cảnh | `params.mol`, `title`, `note?` | như TC-A5 |
| TC-A7 | `sim.ionic_bond` | `__DRAW.cIonic` | 7 cảnh | `params.a`, `b`, `n`, `title`, `note?` | như TC-A5 |
| TC-A8 | `sim.test_tube` | `__DRAW.cTube` | 15 cảnh | `params.start`, `add`, `result`, `eq?`, `title` | như TC-A5 |
| TC-A9 | `sim.chem_fixed_scene` | `CHEM.cBond, cLab, cFountain, cIon, cSmoke, cBurn, cLife, cReact0` | 8 cảnh | `params.k` | Xuất 8 cảnh cố định thành `sim/<k>.svg` động hoặc giữ mã vẽ trong component |
| TC-A10 | `sim.electric_charges` | `__DRAW.pCharge` (dùng chung fizika8) | 2 cảnh | `params.q`, `move?`, `title`, `note` | Một component dùng chung cho kimyo8 và fizika8 |
| TC-A11 | `sim.graph_plot` | `__DRAW.pGraph` (dùng chung fizika8) | 3 cảnh | `params.pts`, `line`, `xl`, `yl`, `xt?`, `yt?`, `title`, `note` | như TC-A10 |

Hệ quả: 519/754 cảnh (69 %) chưa có hình. Cả 133/133 video đều có ít nhất một cảnh như vậy. Lời thuyết minh và audio vi vẫn phát đủ. Bài tập: 384/403 bài (95 %) làm được trên bản xem trước, chỉ 19 bài `ex.order` chưa làm được.

## B. Quy tắc id bền (D2 S7) chưa phủ hết trường hợp

| Mã | Trường hợp | Vị trí trong mã cũ | Số lượng | Cách tạm xử lý trong book.json | Đề xuất |
|---|---|---|---|---|---|
| TC-B1 | Hai bài cùng số in trên một trang (vd. tr.151: câu hỏi 1–4 và "Amaliy ish" 1–4; tr.197, 200: "1- ish"/"2- ish") | `PG[n].ex[].no` | 9 bài | Lần thứ hai thêm hậu tố lần xuất hiện: `p151.q1_2`. `legacy_ids` giữ `p151.ex5` | Cho phép tiền tố nhóm in trong id: `p151.amaliy.q1`. Cần bổ sung trường "nhóm bài" (tiêu đề khối in) ở schema |
| TC-B2 | Hình không có số in | `PG[n].fig[].no === ''` | 43/74 hình | `p<n>.rasm_<3 từ đầu của chú thích uz>` (vd. `p64.rasm_natriy_atomidan_natriy`) | Ghi quy tắc này vào schema/README; nếu sau này sửa chú thích thì id vẫn giữ |
| TC-B3 | Số in không phải số: `1-misol`, `1- misol`, `★`, `1–3`, `T1`, `1-v` | `PG[n].ex[].no` | 33 bài | Slug ASCII: `q1_misol`, `qstar`, `q1_3`, `qt1`, `q1_v`; `no` giữ nguyên chuỗi in | Ghi bảng slug vào quy ước id |

## C. Dữ liệu chạy không nằm trong file HTML

| Mã | Mục | Vị trí trong mã cũ | Số lượng | Cách tạm xử lý | Đề xuất |
|---|---|---|---|---|---|
| TC-C1 | Video thật GV đã gắn (db `media/<topicId>`) | `window.__VM`, `decorate`, `openMgr`; rule `media` read:view / write:admin | không đọc được từ file (dữ liệu nằm trên db của artifact cũ) | `teacher.media_overrides: {}`, `edit_role: admin` | Bước publish: đọc db `media/*` của artifact cũ (công cụ ArtifactData) rồi ghi sang artifact mới. Khóa topicId (`t17`…) giữ nguyên nên không phải đổi tên |
| TC-C2 | Kết quả học sinh trong localStorage | khóa `kim8.ans` (theo `p<n>.ex<i>`), `gul:done` (tiến độ quiz, lệch tiền tố), `robo.kim:*` (nhắc việc) | theo từng máy | `legacy_ids` trên mọi bài tập và hình cho phép ánh xạ khóa cũ sang khóa mới | Đầu đọc thêm bước chuyển một lần: đọc `kim8.ans`/`gul:done` rồi ghi theo id mới, đẩy lên `res/` (D2 N3) |
| TC-C3 | Dung lượng từng ảnh trang | danh sách file artifact cũ | 416 ảnh | `media.files[].bytes` chỉ ghi cho 5 file audio; ảnh để trống (tùy chọn trong schema) | Bước publish lấy bytes/sha256 từ danh sách file khi chép server-side |

## D. Lệch nhỏ giữa thư viện, đầu đọc và công cụ

| Mã | Mục | Số lượng | Cách tạm xử lý | Đề xuất |
|---|---|---|---|---|
| TC-D1 | `sim.scene_page_image`: thư viện ghi `params.page` + `params.crop[4]`, nhưng đầu đọc (R1) và bản trích kimyo8 dùng `params.crop = {page, box}` | 203 cảnh | Theo đầu đọc: `{"crop": {"page": p, "box": [x,y,w,h]}}` | Sửa mô tả params trong `thu-vien/mo-phong/danh-muc.json` cho khớp |
| TC-D2 | `schema/kiem-tra.py` mục 7 coi mọi chuỗi bắt đầu bằng `@` là asset_path. OCR bản Nga có một đoạn bắt đầu bằng "@," (nhiễu OCR, tr.72) nên bị báo lỗi nhầm | 1 chuỗi | Giữ nguyên văn OCR; `_work/check.py` bỏ qua `/ocr/` | Chỉ quét các trường kiểu `asset_path` (images, background, media.files.path, src) |
| TC-D3 | Phương án quiz là chuỗi trung tính (công thức, số), không có bản dịch | 121/220 câu có phương án chuỗi; 1 câu (t17) trộn chuỗi và i18n | Ghi `{"uz": "<chuỗi>"}`; đầu đọc lùi về uz | Cho phép `i18n` có khóa `zxx` (không ngôn ngữ) như `media_lang`, để phân biệt "chưa dịch" với "không cần dịch" |
| TC-D4 | `items[].q` dạng chuỗi trung tính (chuỗi phản ứng) | 15/41 ý | `{"uz": "<chuỗi>"}` | như TC-D3 |

## E. Mã thừa không mang sang (theo kiểm kê và thư viện mô phỏng)
Không mang sang: `pv, shift, frac, area, tri, cuboid, ratio, keys, sheet, blocks, sheetVal` (Toán/Tin), `pCircuit, pField, pElectro` (Lý), `window.DM = {}`, `#mini`, `workbook` trong Robo. Không cảnh hay hoạt động nào của kimyo8 dùng các mã này (đã đếm: 754 cảnh, 44 hoạt động; kết quả ở `doi-chieu.json`).
