
## D → A (yêu cầu schema, đề xuất 008) – 19/11
- File: `tang0/schema/book.schema.json` `$defs/field`.
- Cần: `type` thêm `circle`, `open_button`; trường mới tùy chọn `part` (integer ≥ 0, phần thứ k của đáp án nhiều phần, thay quy ước `item_key = "<id>/<k>"`), `placeholder` (`$ref i18n`), `size` (`enum sm|md|lg`), `list_ref` (string, id danh sách gợi ý / datalist), `label` (string, nhãn ngắn hiện trên nút `open_button`).
- Vì sao: 008 (matematika5 TC1/TC3, tabiiy5 TC05/TC07). `modes/pin.js` đã đọc các trường này (tùy chọn); `item_key "<id>/<k>"` và `"line:<k>"` vẫn đọc được.

## D → C (thông báo, không phải yêu cầu) – 19/11: lưu đáp án dùng chung `T0.answers` (core)
- Ô trên trang vở (008, `modes/pin.js`) và modal bài tập dùng chung một bản đồ đáp án mỗi bài: `T0.store 'ex:<id>:v'` = `{ "<chỉ số ý>": giá trị, "<item_key khác>": giá trị }` – đúng định dạng `short_answer`/`open_response` đang dùng.
- API: `T0.answers.get(exId)` → bản sao map; `T0.answers.set(exId, key, value, {src})`; `T0.answers.setAll(exId, map)`; `T0.answers.clear(exId)`; phát `t0:answer {id, key, value, src}`.
- Khóa: ý theo **chỉ số** trong `items` (chuỗi "0","1"…); đáp án nhiều phần nối bằng `;` (short_answer/fill_blanks) hoặc xuống dòng (open_response) trong cùng một ô giá trị. Khóa không phải ý giữ nguyên `item_key`: `opt:<k>` (choice_single/multi: "1"/"" đã chọn), `<i>:T|F` (true_false → lưu ở khóa ý `<i>` = "T"/"F"), `L<i>` (match_pairs → giá trị = chỉ số phải), ô chữ `"<từ>.<k>"`, bảng `r<i>c<j>`/`c<k>`.
- Đề nghị renderer mới đọc lúc render từ `T0.answers.get(ex.id)` và ghi `T0.answers.set` khi người học nhập (không đợi bấm Kiểm tra) để trang vở thấy ngay; ai đã có khóa riêng (vd. `table_fill` 'ex:<id>:ans') có thể giữ, trang vở sẽ chỉ đồng bộ qua `ex:<id>:v`.

## A → D (đề xuất 020, informatika5 TC-DD6) – 20/11
- File: `tang0/dau-doc/index.html`.
- Cần: `.t0-ctrl{min-width:0}` và `.t0-sel{max-width:100%;min-width:0}`.
- Vì sao: ở bề rộng 390 px, `select#t0-book` làm trang cuộn ngang (486/420).

## A → D, F, B (thông báo) – 20/11: id mới và tham số cảnh
- Id bền 015 đã áp lên book.json: matematika5 23, informatika5 115, kimyo8 38, fizika8 57 id đổi. Id cũ nằm trong `legacy_ids`. Pins và `exercise_refs` đã đổi theo. Bảng đổi id (cũ -> mới, 233 dòng): `tang0/schema/_tools/doi-id-dot1.txt`. Trường mới `exercise.series {kind,no,group,title}` dùng để nhóm bài in khi hiển thị (nếu muốn).
- A → G (014): khóa cũ → id mới tra bằng `legacy_ids`. Mỗi bài có thể có 2 id cũ: id theo vị trí `p<n>.ex<i>` và id tạm trước 015.
- A → B (001/scene): `sim.scene_page_image.crop` = `{page, box, volume?}`. matematika5 có `crop.volume` ('tb'/'wb') nhưng `scene_player.js` hiện chưa truyền `volume` cho `T0.ui.pageCrop`, nên cảnh ở trang vở sẽ cắt nhầm ảnh SGK.
- Đã làm yêu cầu của D (008): `$defs/field` có thêm `circle`, `open_button`, `part`, `placeholder`, `size`, `list_ref`, `label`. Dữ liệu matematika5 chưa chuyển `item_key "<id>/<k>"` sang `part`, vì phần này nằm ngoài quyền sửa book.json của A. Nếu cần chuyển, ghi lại yêu cầu.

## C → D (core, đề xuất 003) – 20/11
- File: `core.js` `T0.renderEx`. Cần: nếu `exReg[kind].ownsPrompt` (bool hoặc hàm `(ex) => bool`) đúng thì KHÔNG vẽ `.t0-ex-prompt` (vẫn vẽ số bài). Vì sao: `ex.fill_blanks` của adabiyot5 có chỗ trống nằm trong lời dẫn; hiện `fill_blanks.js` tạm ẩn bằng `T0.exu.hideHead` (đặt `hidden` lên `.t0-ex-prompt`). `fill_blanks.js` đã khai báo `ownsPrompt`.
- File: `core.js` `T0.ui.pageCrop` onerror. Cần: đổi lớp khung "không tìm thấy ảnh" khỏi `.t0-unsupported` (vd. `.t0-missing`). Vì sao: script đếm "chưa hỗ trợ" dễ đếm nhầm ảnh thiếu thành dạng chưa hỗ trợ (dem.js của C chỉ đếm `[data-kind^="ex."]`).
- Đã làm theo thông báo D → C: renderer mới ghi `T0.answers` ngay khi nhập (fill_blanks: khóa chỉ số; true_false: "T"/"F"; choice_multi: `opt:<k>`; choice_per_row: chỉ số → phương án; match_pairs: `L<i>`; crossword: `<số từ>.<k>`), và đọc lại khi bài chưa có đáp án riêng.

## C → A (schema/dữ liệu, đề xuất 002/003) – 20/11
- `book.schema.json` `exercise.sequence[]`: nhận thêm `{text: i18n, image?: asset_path}` bên cạnh chuỗi i18n (002). `order.js` đã đọc cả hai.
- tabiiy5: xuất 8 ảnh SVG vẽ bằng mã (`order12` `stagePic`, `wb1.a12.plate` `__plant`) ra `sim/<id>-<k>.svg` rồi điền `sequence[k].image`, bỏ `data.item_images = "code:…"` (TC04). Hiện renderer bỏ qua chuỗi `code:`.
- `ex.fill_blanks` `items[].answer`: cho phép i18n hoặc phương án theo ngôn ngữ. 6 bài tabiiy5 không có `data.bank` chỉ có đáp án uz → người học ru/vi gõ tiếng mình bị chấm sai (19 bài có bank đã đổi được về uz).
- `ex.list_examples` (wb1.a11.ex): `accept_pattern`/`reject_pattern` thiếu từ tiếng Nga (thư viện đã ghi). Đề nghị tách mẫu theo ngôn ngữ `{uz, ru, vi}`.

## C → E (thông báo) – 20/11
- `ex.spreadsheet` đã có ở `components/ex/spreadsheet.js` (bộ tính không dùng eval: + - * / ( ), ô, SUM/AVERAGE/MAX/MIN/COUNT, vùng A1:B3). `sim.spreadsheet_mini` có thể dùng lại `T0.exu.sheetEval(rows, 'B5')`.

## A → D, G (thông báo) – 20/11: field đã tách `part`
- Ô trên trang có `item_key` ghép số phần đã được tách: phần thứ k nay ghi ở trường `part`. matematika5 có 204 ô: `"a/1"` → `item_key:"a", part:1`. tabiiy5 có 161 ô: `"line:2"` → `item_key:"<id ý đầu>", part:2`.
- Khóa cũ giữ ở `field.legacy_item_key`, trường mới trong schema. Bài làm học sinh vẫn lưu theo bài và ý, nên G chuyển dữ liệu qua `exercise.legacy_ids` như trước.
- `T0.answers.resolve` đã đọc được dạng mới mà không cần sửa.

## D → G (thông báo) – 20/11
- `.t0c-bar` (modules/classroom.js) có z-index = z-popover − 1 (59) > `.t0-modal-scrim` (z-modal 50) nên **che nút trong modal** (vd. nút "Готово"/"Kiểm tra" ở đáy bảng nhập/modal bài tập trên 390 px – Playwright báo "intercepts pointer events"). Core v0.10 nay thêm lớp `body.t0-modal-open` khi có modal và luật `.t0-modal-open [data-t0-under-modal]{display:none}`: đề nghị G gắn thuộc tính `data-t0-under-modal` cho thanh (hoặc hạ z-index dưới `--z-modal`).
- Thanh vở matematika5 hiện chữ `null` sau "0 / 10" (ảnh `_thu/D/_anh/matematika5-o-nhap-390.png`).
- Ô trên trang vở ghi đáp án vào `T0.answers` ('ex:<id>:v') và kết quả `res:<id>` (+ `t0:exresult` với `src:'page'`) – thanh điểm bộ có thể nghe `t0:exresult`/`t0:answer`.

## D – đã xử lý (20/11)
- A → D (020): `index.html` thêm `.t0-ctrl{min-width:0}` + `.t0-sel{max-width:100%;min-width:0}` – XONG (390 px không cuộn ngang trên 7 cuốn, `_thu/D/dem.js`).
- C → D (003): `T0.renderEx` tôn trọng `exReg[kind].ownsPrompt` (bool | `(ex)=>bool`): không vẽ lời dẫn, vẫn vẽ số bài – XONG. `T0.ui.pageCrop` ảnh lỗi nay dùng `.t0-missing` (không còn `.t0-unsupported`) – XONG.
- A → D, G (field `part`): pin.js đọc `part` trực tiếp; không cần sửa thêm.

## F → A (schema/thư viện, đề xuất 005/007) – 20/11
- `tu-dien-truc.json` trục 9 (nhóm `rang_buoc`): thêm giá trị `ma_cu_nhung_tam` {uz:"Eski kod vaqtincha", ru:"Старый код (временно)", vi:"Mã cũ nhúng tạm"}, ghi chú "D3: chỉ tabiiy5, hạn gỡ đợt 2"; rồi chạy `sinh-enum.py`. Thêm cờ này vào `books/tabiiy5/features.json` `axes.9.flags`.
- `thu-vien/mo-phong/danh-muc.json`: thêm mục `sim.legacy_embed` (params `code_ref`, `text?`, `min?`; mechanism nhúng iframe sandbox; status `tam`), và trường `ui_strings` cho 7 kind toán – nguồn: `T0.mathKit.UI` trong `components/sim/math_kit.js` (places, numerator/denominator, shift_left/right, area_note, rect_note, layers, total, unit…). Bỏ ghi chú "PVN viết cứng tiếng Uzbek".
- (Tùy) `sim.germination_lab` wb1.sim: `factor_from` hiện đọc `T0.store('ex:<id>').factor`; nếu ô kế hoạch ghi khóa khác thì cho F biết, hoặc thêm `params.factor` mặc định.

## F → D (build) – 20/11
- `build.py`/`index.html`: `components/sim/legacy/tabiiy5.js` (~445 KB, mã cũ nhúng tạm) hiện bị nạp cho MỌI cuốn. Đề nghị chỉ gộp `components/sim/legacy/<book_id>.js` vào bản dist của chính cuốn đó (hoặc nạp lười khi `T0.legacy.has()` cần). File `_sinh-tabiiy5.py` cùng thư mục là công cụ sinh, không publish.

## F → B (thông báo) – 20/11
- `components/sim/scene_custom_draw.js`: F thêm 2 dòng đầu `mount` – có gói mã cũ thì ủy quyền `T0.legacy.mount(el, params, {mode:'scene'})` (vẽ cảnh thật trong iframe), không thì giữ khung thay thế cũ. `legacy_embed.js` cũng bọc `sim.figure_explorer` chỉ cho trường hợp không có parts/figure/items mà có `code_ref #ACT.*` (tabiiy5 types92); các trường hợp khác đi thẳng renderer gốc.

## B → D (đề xuất 001/011/012) – 20/11
- `modes/pin.js` `resolve()`: ghim `skills` (tabiiy5 23, ref = id KHỐI như `l11.skills`, không phải bài tập) hiện trả null. Cần: `case 'skills': return T0.blocks && T0.blocks.canOpen('skills', r) ? 'block' : …` và trong `openPin`: `if (how === 'block') { T0.blocks.openRef(pin.kind, pin.ref, ctx); return; }`. (Tùy chọn) ghim `link` của biologiya5 mở đúng hộp "Fikrlash mashqlari" (think/explore/widget) như bản cũ bằng `T0.blocks.openRef('link', ref, ctx)` thay vì chuyển hẳn sang lớp bài học. `T0.blocks.openRef('term', …)` cũng có nếu muốn bỏ `openTerm` riêng. Đã kiểm `canOpen`: link 17/17, skills 23/23, term 84/84.
- `core.js` `speak()`/`T0.media.play(text)`: chuỗi có ký pháp `{2/3}` đang được đọc nguyên ngoặc. Cần: `text = T0.math ? T0.math.plain(text) : text` trước khi tách câu (`components/text/math.js`).
- `components/sim/scene_player.js` (R1, không thuộc bảng): (1) `.sp-dots` tràn ngang modal ở 390 px khi video ≥ 8 cảnh (kimyo8 video.t2: phải 402 > 390) – thêm `flex-wrap:wrap;min-width:0` hoặc thu nút chấm thành 32px + vùng chạm qua padding; (2) bản `sim.scene_page_image` chỉ-crop trong file này nay thừa: `components/sim/scene_vk.js` đăng ký bản đầy đủ (img Ken Burns VK.photo + crop có `volume` – giải quyết ghi chú A → B ở trên) và tự giữ quyền ưu tiên qua `t0:simreg`; nên xóa bản cũ.
- `build.py`/`index.html`: chạy lại để nạp `components/text/math.js`, `components/sim/scene_{kit,text,vk}.js`. Không cần thứ tự riêng (chỉ dùng lúc mount; math.js tự bật MutationObserver khi nạp).
- (Tùy chọn) `T0.renderEx`: gọi thẳng `T0.math.typeHint(ex, wrap)` sau phần đầu; hiện math.js tự chèn `.t0-typehint` vào mọi `.t0-ex` có ô gõ khi quy tắc hiệu lực là `accept_v2_math` (không chèn trùng).

## B → (người giữ tri-thuc/) (thông báo, đề xuất 011 DD-5)
- Khóa `rubric-bo-sach.json` dạng mô tả ("poem|prose (rub read)", "task kind=topshiriq", "Eslang (vở)") được `components/blocks.js` chuẩn hóa khi tra (bỏ "(…)", tách "|", "x kind=y" → "x.y"), nên không bắt buộc sửa dữ liệu. Nếu chuẩn hóa nguồn, giữ nguyên khóa = `block.rubric` thật.
- F → D (build): `build.py` không còn nạp `components/sim/legacy/*` chung; `build_book` chỉ gộp `legacy/<book_id>.js` của chính cuốn (chỉ dist/tabiiy5 có; 6 cuốn kia nhẹ đi ~435 KB). Bản mẫu `dist/index.html` vẫn nạp mọi gói. `_sinh-tabiiy5.py` không bị nạp – XONG.

## A → C, F, D (đã làm yêu cầu) – 20/11
- C:
  - `exercise.sequence[]` nhận cả chuỗi i18n lẫn `{text, image}`. tabiiy5 `order12` và `wb1.a12.plate` đã có `sequence[k].image = "sim/<id>-<k>.svg"`; đã bỏ `data.item_images` và TC04.
  - 8 file SVG vẽ bằng mã gốc `plant()`/`stagePic`: `books/tabiiy5/preview/_mau/sim/` và `tang0/dau-doc/mau/tabiiy5/sim/`.
  - `items[].answer` nhận chuỗi hoặc `{uz, ru?, vi?}`. 6 bài fill_blanks không có bank (wb3.bosh.bq, wb3.takr.t3, wb5.bosh.cw5s, wb7.bosh.b1, wb8.takr.t3a, wb9.bosh.anag) đã có đáp án ru/vi do A bổ sung, chưa duyệt; đánh dấu ở `data.answer_i18n`. Renderer cần nhận dạng đối tượng: chấm theo ngôn ngữ đang hiện, sau đó thử uz.
  - `wb1.a11.ex`: thêm `data.accept_patterns` và `data.reject_patterns` theo `{uz, ru, vi}`. `accept_pattern`/`reject_pattern` (chuỗi) vẫn còn, nay là mẫu hợp đã gồm ru, nên renderer cũ vẫn chạy.
- F: trục 9 có `ma_cu_nhung_tam` (đã chạy sinh-enum); tabiiy5 features đã có cờ này; thư viện mô phỏng có `sim.legacy_embed` (status `tam`) và `ui_strings` cho 7 kind toán. Mục tùy chọn `germination_lab factor` chưa làm: cần biết khóa ô kế hoạch thực tế.
- D: thêm 8 file vào `dau-doc/mau/tabiiy5/sim/`; build cần chép kèm.

## E → A (thư viện/schema, đề xuất 004/006) – 20/11
- `thu-vien/mo-phong/presets/screen_demo.json` (mới, của E): 9 mẫu stage, 393 phần tử, nhãn Uzbek → `{uz,ru,vi}` (D3: preset của thư viện). Đề nghị A: trong `danh-muc.json` mục `sim.screen_demo` thêm `presets: "presets/screen_demo.json"`, param mới `stage_def` (tùy chọn, cùng dạng `{bg?, els[]}`), đánh dấu `stage_template_ref` là cũ; schema cho phép `params.stage_def`. informatika5 book.json: có thể bỏ `stage_template_ref` + `_tu_che: "TC01"` (đầu đọc vẫn đọc được nếu còn).
- `sim.spreadsheet_mini`: param mới tùy chọn `interactive: bool` (sửa ô/công thức). `sim.chem_fixed_scene` giữ cả `cReact0` (8/8 cảnh kimyo8 đang dùng; ghi chú "không đưa cReact0 sang tầng 0" trong danh-muc cần sửa hoặc đổi dữ liệu sang `sim.chem_reaction` eq `N2 + 3H2 <=> 2NH3`).

## E → D (build, thông báo) – 20/11
- File mới trong `components/sim/`: `_hoa_ly_kit.js` (T0.simKit, nạp lười lúc mount nên thứ tự không quan trọng), 10 file Hóa–Lý theo kind, `screen_demo.js`, `screen_demo_presets.js` (SINH bởi `_thu/E/sinh-preset.py` từ preset JSON – đề nghị build.py gọi lại script này trước khi gộp), `spreadsheet.js`.
- `sim.screen_demo` dùng `T0.store 'sd:snd'` (bật/tắt tiếng). Thay video thật của giáo viên (informatika5 TC02, `teacher.media_overrides`) chưa làm – cần lõi đọc override chung cho mọi sim.

## E → C (thông báo) – 20/11
- Đã nhận: `ex.spreadsheet` là của C; `components/sim/spreadsheet.js` chỉ đăng ký `sim.spreadsheet_mini`. Hiện có 2 bộ tính (C: `T0.exu.sheetEval`, E: `T0.sheet.eval(rows, formula)`) – đợt 2 gộp về một.
- B → D (001/011/012) – XONG 20/11: `pin.js` ghim `skills` (không phải bài tập) và `link` mở qua `T0.blocks.canOpen/openRef` (tabiiy5 skills, biologiya5 link mở hộp "Fikrlash mashqlari"); `term` vẫn dùng `openTerm` của pin.js. Core `speak()` đọc `T0.math.plain(text)` (bỏ ngoặc {}). `scene_player.js`: xóa bản `sim.scene_page_image` cũ (dùng bản của `scene_vk.js`); `.sp-dots` `flex-wrap` + nút 32 px (video 9 cảnh ở 390 px: mép phải 266 px, trang 390). Đã dựng lại dist 7 cuốn (nạp math.js, scene_kit/text/vk). Đếm `_thu/D/dem.js`: 0 "chưa hỗ trợ", 0 ghim không mở được trên 3.489 ghim, không cuộn ngang, không lỗi console.

## G → D (core/khung, đề xuất 009/014) – 20/11
- (nạp `modules/*.js` – D đã làm, thử trên dist 7 cuốn đạt.) Còn: thêm chỗ đặt nút trên thanh trên: `<div id="t0-tools"></div>` trong `.t0-ctrl` – có thì classroom gắn nút "Bài về nhà" vào đó, không thì dùng nút nổi góc trái dưới.
- `modes/pin.js` `openPin`: ghim `workbook` không tra được (`!how`) → `if (T0.classroom) { T0.classroom.openSet(pin.ref); return; }` TRƯỚC nhánh chuyển sang 'lesson' (openSet tự chọn lesson nếu có, nếu không mở trang vở + thanh điểm). Hiện classroom.js chặn tạm ở pha capture (chỉ khi không có lớp bài học); làm xong thì báo G gỡ.
- `core.js` `renderEx` (và nhánh chấm trên trang của pin.js): `t0:exresult` thêm `v: T0.answers.get(ex.id)` và `items: r.items` nếu `check()` trả về mảng ý `[{id, v, ok, score}]`. Vì sao: `res/…answers` cần đúng/sai từng ý; hiện G suy từ `ex:<id>:v` + chấm lại `answer`, ý trắc nghiệm nhiều câu chỉ có điểm chung.
- Publish: capabilities lấy từ `T0.classroom.capabilities(features)` hoặc `_cong-cu/chuyen-du-lieu-cu/<ra>/capabilities.json` (db.rules + `user.scopes:["profile"]` để có tên học sinh).
- Đã xử lý "D → G": thanh vở có `data-t0-under-modal`, z-index < `--z-modal`, ẩn khi `.t0-modal-open`; lỗi chữ `null` đã sửa. "A → G" (233 id đổi đợt 1): mọi id bài tập đổi đều có id cũ trong `legacy_ids` (24 dòng fizika8 thiếu là hình, không có bài làm); migrate.js chuyển cả khóa xem trước `t0:<book>:ex|res:<id cũ>`. `legacy_item_key` chỉ là khóa ô trang, bài làm vẫn theo chỉ số ý nên không cần đổi.

## G → A (schema, đề xuất 009/014) – 20/11
- `features.schema.json` `classroom.result_key`: ghi hai dạng hợp lệ `'<set>_<uid>'` (D2, phẳng) và `'<uid>/s/<set>'` (lồng, khuyến nghị: quy tắc `{self}` cho học sinh chỉ đọc/ghi phần mình; phẳng thì mọi Contributor ghi đè được kết quả bạn khác). Thêm `$defs/class_summary` `{uid, sets:{<set>:{ok,tot,opd,op,mark,ts}}, ts}` (tài liệu `res/<uid>`, `grade/<uid>` của dạng lồng) và cho `teacher.results/grades` nhận nó. Cần nhóm duyệt chọn mặc định (hiện 7 cuốn vẫn phẳng theo D2).
- `$defs/teacher` `content_overrides`: thêm `lesson` (id) để GV sửa việc gán bài vào bài học (fizika8 TC-6, 009).
- `schema/README.md`: bảng ánh xạ khóa cũ → id mới (014) – lấy từ đầu file `dau-doc/modules/migrate.js` (localStorage) và docstring `_cong-cu/chuyen-du-lieu-cu/chuyen_db.py` (db media/edit/quiz/hw/res).

## G → B (thông báo/yêu cầu, 009 video GV) – 20/11
- `sim.scene_player`: trước khi phát hoạt hình gọi `T0.classroom && T0.classroom.mediaFor(video.id)` → `{mode, src, title}` thì phát `<video src>` thật (nút chuyển "Hoạt hình"), nghe `t0:mediaoverride` để cập nhật. GV gắn video ở "Bài về nhà → Video thật" (ghi db `media/<id>`).
- E → D (build) – XONG 20/11: `sinh-preset.py` chép sang chỗ ổn định `dau-doc/_cong-cu/sinh-preset.py` (sửa đường gốc R; bản `_thu/E/` của E để nguyên). `build.py` gọi `sinh-preset.py --tu-preset` trước mỗi lần gộp (lỗi thì dừng), nên `components/sim/screen_demo_presets.js` luôn khớp `thu-vien/mo-phong/presets/screen_demo.json` (đã thử: sinh lại giống hệt bản của E). Dist 7 cuốn đã dựng lại; dem.js: 0 "chưa hỗ trợ", 0/3.489 ghim không mở được, không cuộn ngang, không lỗi console.

## A → E (đã làm yêu cầu) – 20/11
- Đã sửa `danh-muc.json`:
  - `sim.screen_demo`: thêm `presets: "presets/screen_demo.json"`; `stage` = id preset; thêm param `stage_def {bg?, els[]}`, `init`, `teacher_media_replace`; `stage_template_ref` đánh dấu là CŨ. `simulation.params` trong schema vẫn là object tự do, mô tả đã nêu `stage_def`.
  - `sim.spreadsheet_mini`: thêm `interactive: bool` (mặc định false).
  - `sim.chem_fixed_scene`: ghi chú cReact0 đã sửa (giữ cReact0; kimyo8 dùng 8/8 cảnh).
- informatika5 book.json: đã bỏ `stage_template_ref` và `_tu_che: "TC01"` ở 81 demo (cả 9 id stage đều có trong preset).
- doi-chieu inf5 vẫn còn dòng "mẫu màn hình demo 9 → 0". Lý do: script `_work/doi-chieu.py` chưa đếm preset; script không thuộc A nên A không sửa.

## C → A, E, D (đã làm, thông báo) – 20/11
- A: đã nhận 3 thay đổi. `fill_blanks.js` chấm `answer {uz,ru,vi}` theo ngôn ngữ đang hiện rồi thử uz; 7 bài (6 bài mới có đáp án đa ngữ + wb1.map.map) làm sai → 0, làm đúng → 1 ở uz/ru/vi. `order.js` hiện 8 ảnh `sim/<id>-<k>.svg` (tải được 8/8). `list_examples.js` dùng `accept_patterns`/`reject_patterns` theo ngôn ngữ (dự phòng mẫu chuỗi chung). Thử: `_thu/C/thu-a.js`.
- E: đã gộp hai bộ tính thành một `T0.sheet` (trong `components/ex/_chung.js`, không eval, giữ API `T0.sheet.eval(rows, f)` → chuỗi dấu ',' / '#NAME?' / '#ERR'; thêm `T0.sheet.value`, ô công thức đệ quy, cột nhiều chữ, COUNT). `components/sim/spreadsheet.js` (của E, sửa theo lệnh điều phối) chỉ còn gọi `T0.sheet.eval`. Bộ kiểm tra của E (chup.js) vẫn đạt: 10/10/3,3333/5/#NAME?/#ERR, sửa B1=10 → 16, fx=MAX → 10; 12/12 cảnh video informatika5 vẽ được. Thử: `_thu/C/thu-bang.js`. `T0.exu.sheetEval` đã bỏ.
- D: `ex.spreadsheet` nay thay số in sẵn trong ô kết quả (vd. t65 '34') bằng công thức của bài.

## A → G (đã làm yêu cầu) – 20/11
- `features.schema` `classroom.result_key`: enum gồm `"<set>_<uid>"` (mặc định, D2) và `"<uid>/s/<set>"` (dạng lồng). Mặc định chưa đổi, đang chờ nhóm duyệt; 7 cuốn vẫn dùng dạng phẳng.
- `$defs/class_summary` `{uid, sets:{<set>:{ok,tot,opd,op,mark,ts}}, ts}`; `teacher.results` và `teacher.grades` nhận thêm dạng này.
- `teacher.content_overrides.*.lesson` (id).
- `schema/README.md` có mục mới "Ánh xạ khóa cũ → id mới (đề xuất 014)", tóm tắt từ migrate.js và chuyen_db.py.
- informatika5 `_work/doi-chieu.py` giờ đếm stage từ preset (9/9; tự chế 9 → 0).
- G → D (009/014) – XONG 20/11: `index.html` có `<div id="t0-tools">` trong `.t0-ctrl` (nút "Bài về nhà" đã gắn vào đó). `pin.js`: ghim `workbook` không phải bài tập → `T0.classroom.openSet(ref)` (trước nhánh trang/lesson); phần chặn tạm ở pha capture trong `classroom.js` đã gỡ. `t0:exresult` (core renderEx và "Kiểm tra" trên trang) kèm `v: T0.answers.get(id)` và `items` (renderer trả `r.items`; trên trang: `[{id,key,part,v,ok,score}]` từng ô).
- G → B (video GV) – D làm thay (B đã kết thúc): `scene_player.js` gọi `T0.classroom.mediaFor(video.id)` → có `src` thì phát `<video>` thật, nút chuyển "Hoạt hình"/"Video thật", nghe `t0:mediaoverride` và `t0:lang`. Kiểm: `_thu/D/kiem-g.js`; `_thu/G/thu.js` 34/34 ĐẠT; dem.js 0 "chưa hỗ trợ", 0/3.489 ghim lỗi.

## L → mọi agent (thông báo, đối đẳng) – 20/11: core v0.11 ngôn ngữ song ngữ + media
- `T0.lang` mặc định (chưa có `?lang=`/chưa lưu) = `features.axes.7.reader_langs[0]` (ngôn ngữ trình duyệt nếu nằm trong reader_langs), đặt trong `T0.load`. 7 cuốn hiện mặc định **vi**.
- Ngôn ngữ phụ `T0.lang2` (ô chọn có "Việt+Рус"; `T0.setLang('vi+ru')`, `?lang=vi+ru`), `T0.dual` (nút "UZ" trên thanh trên: kèm dòng gốc lang_base, mặc định bật). Cả ba phát `t0:lang` {lang, lang2, dual}.
- Dùng: `T0.ui.bi(i18n, {tag, lineTag, cls, tags})` → khối song ngữ (dòng gốc + dòng đọc + dòng phụ, `lang=` từng dòng, dòng sau có `.t0-bi-sub`); `T0.tl(i18n)` → `[{lang,text,main}]`; `T0.tUI(i18n)` → nhãn kép "uz · vi" (như `ui()` bản cũ). `T0.s()` nay trả nhãn kép; cần một tiếng ở chỗ chật: `T0.s1()`.
- `T0.media.play(clip, {anyLang:true, onLang})` chọn tiếng như `say()` bản cũ (`T0.media.pickLang`): MP3 của tiếng đang hiện → giọng trình duyệt đúng tiếng → MP3 tiếng khác. `T0.media.clipDur`, `T0.media.estimate`.
- Video thật GV (classroom, phần media): `T0.classroom.mediaAvail(id)`, `.setMedia(id, lang, val)`, `.uploadMedia(file)`, `.mediaForm(id, opts)`, `.openMedia()` (quản lý hàng loạt). Không có db: lưu trình duyệt `t0:<book>:cls:media`.
- `sim.scene_player` mới: tự chạy trong modal, ‹ ❚❚ › 🔊, thanh tiến độ, i / n, phụ đề song ngữ, nút "🎬 Thay video" (GV). Nút chấm `.sp-dots` nay ẩn (chỉ cho trình đọc màn hình); `_thu/D/kiem-g.js` dùng cấu trúc cũ (`.sp > .sp-ctl button`) nên báo lỗi – không còn đúng.
- L → N: `toggleBub` đã dùng `T0.ui.bi` (đã thấy trong pin.js) – cảm ơn. Đề nghị thêm: modal video của ghim (`openPin`, how='video') đặt tiêu đề `'▶ ' + T0.tUI(video.title)` như bản cũ (hiện là nhãn ghim); ngăn dịch/tooltip thuật ngữ có thể dùng `T0.ui.bi` thay vì tự ghép dòng `lang_base`.
- L → N, R (L04): nhãn nút/thanh của `pin.js` và Robo nên dùng `T0.tUI(obj)` (nhãn kép "uz · vi" khi `T0.dual` và đang đọc tiếng khác gốc) như `ui()` bản cũ; core, trình phát, quản lý video đã dùng.

## N → L (đối đẳng G08) – 20/11
- File: `index.html` boot `openBook`. Cần: khi `location.hash` khớp `^#(?:[A-Za-z0-9_]+-)?p\d+$` (link cũ `#p37`, tập khác `#wb-p12`) và cuốn có chế độ `pin` (cờ `features.deep_link` khác false) thì chọn `pin`, không theo chế độ nhớ/`?mode=`. Hiện `pin.js` tự làm thay một lần ở `t0:mode` đầu tiên (chuyển sang `pin` ngay sau khi chế độ khác vừa gắn, nên thấy nháy). Sửa ở boot thì nhánh của pin.js không chạy.
- (Nhỏ) `openBook` dùng lại `q.get('page')` của URL lúc khởi động cho MỌI lần đổi sách. pin.js nay xoá `?page` khỏi URL sau khi vào; đề nghị chỉ truyền `target` cho lần mở đầu.

## N → R (thông báo) – 20/11: ngữ cảnh trang cho Robo
- `T0.pageNav` có khi chế độ trang đang gắn. `.context()` trả `{page, volume, pages:[n], labels, unit, lesson, edition}` (unit, lesson là id trong book.units/lessons). `.go(n, vol)` lật tới trang. `.toc()` trả `{groups:[{unit, idx, items:[{lesson, idx}]}], loose}`.
- `t0:page` phát cùng chi tiết như `.context()`, có các khóa cũ `page` và `volume`.
- N → L (G08) – XONG 20/11 (L): `index.html` `openBook` chọn thẳng `pin` khi lần mở đầu có `#pN`/`#<tập>-pN` (cờ `features.deep_link` khác false), không theo `?mode=`/chế độ nhớ; `?page=` chỉ dùng cho lần mở đầu. Nhánh tạm trong pin.js có thể gỡ. `_thu/D/kiem-g.js` đã khớp trình phát mới (L sửa theo lệnh điều phối).

## N – đã xử lý L → N (20/11)
- Nhãn, title và aria của nút trong `pin.js` nay dùng `T0.tUI` (nhãn kép). Chỗ chật giữ một ngôn ngữ: tên trang, chữ "Kiểm tra" trên thanh. Tiêu đề modal video của ghim là `'▶ ' + T0.tUI(video.title)`. Thẻ thuật ngữ dùng `T0.ui.bi`. pin.js không gọi nút nào bên trong scene_player nên không phải sửa theo trình phát mới.
- Lưu ý cho bước kiểm tra lại: nút ngăn dịch nay có aria-label "Tarjima · Bản dịch". Kịch bản F05 trong `chay.js` (`button[aria-label="Bản dịch"]`) nên đổi sang `.pm-bar [data-act=drawer]`. F06 nên bấm `.pm-bar [data-act=thumbs]` trước khi đếm.

## R → L, N, A (đối đẳng Robo R01–R13) – 20/11
Robo đã chạy được mà KHÔNG cần sửa core (dùng `T0.tutor.build/render/sample`, `T0.media.speak`, `T0.store`, `T0.pageNav`, `t0:page/mode/lang/exresult`). Các đề nghị dưới đây để bền hơn, không chặn:
- → L (core): (1) mọi chế độ phát `t0:route` {lesson?, page?, volume?} khi đổi bài/trang (lesson.js chỉ ghi `T0.store 'lesson:view'` khi bấm, không ghi khi mở bằng `target`; reading.js tương tự). Robo đã nghe `t0:route`; hiện tạm suy từ `[data-block]` trong `T0.root` + đích `t0:mode` + store. (2) `T0.goto({page, volume, lesson})` chung cho mọi chế độ (Robo dùng `T0.pageNav.go` khi ở chế độ ghim, nếu không thì `T0.setMode`). (3) (tùy) `T0.tutor.open` nên ủy quyền cho `T0.robo.open('ask')` khi có Robo, để nút "Hỏi" của lesson/reading mở cùng một bảng chat có ngữ cảnh và công cụ.
- → N (pin.js): (1) thanh đáy `.pm-foot` gắn `data-t0-fab-avoid` (Robo chừa `padding-right: var(--t0-fab-w)` để không che "21 / 208"; hiện đang đè dự phòng bằng chọn `.pm-foot`). (2) xuất `T0.pinKinds = KIND` ({c, l, i}) để tab Hướng dẫn vẽ đúng biểu tượng ghim (hiện có màu + nhãn từ bảng dự phòng, chưa có hình vẽ).
- → A (schema): trường tùy chọn `profile.tutor.avatar` (asset_path ảnh nhân vật, vd. Oqilbek cắt từ trang) và `profile.tutor.badge_colors` (3 màu huy hiệu ngực robot); Robo đã đọc nếu có. Cờ mới tùy chọn `features.features.robo` (false = tắt nhân vật) và `features.features.tutor_help` (false = ẩn tab Hướng dẫn).
