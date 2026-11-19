# Tầng 0 · Schema (v0.9.0 – D2 đã chốt 18/11/2026)

Thành phần A của bước ② Hợp nhất. Gồm hai lược đồ JSON Schema 2020-12, bảng ánh xạ từ mã gốc của 7 cuốn sang lược đồ, và các file ví dụ có dữ liệu thật lấy từ mã.

| File | Nội dung |
|---|---|
| `book.schema.json` | Nội dung một cuốn: `profile`, `asset_sources`, `grading_defaults`, `units`, `lessons` (+ `blocks`), `pages` (ảnh trang theo bản in, `tr`, `pins`, `fields`, `text_lines`, `ocr`), `print_text`, `reading`, `exercises`, `simulations`, `videos`, `figures`, `workbook_sets`, `media`, `glossary`, `teacher`, `ui_strings`, `translation_memory` |
| `features.schema.json` | Hồ sơ đặc tính một cuốn theo 9 trục, cùng các lớp bật thêm, capabilities và tính năng |
| `bang-anh-xa.csv` | `book, ma_goc, schema_path, ghi_chu`: 178 dòng, phủ 132/132 mã gốc (loại khối + cấu trúc dữ liệu) của 7 bản kiểm kê |
| `vi-du/<cuon>.features.json` | 7 hồ sơ đặc tính |
| `vi-du/{kimyo8,tabiiy5,adabiyot5}.book-trich.json` | Trích dữ liệu thật của 3 họ: ghim (kimyo8 tr. 21 và 37, bài t4), bài học (tabiiy5 bài 1.1 "Gul", trang 9–10, vở tr. 1), đọc văn (adabiyot5 đơn vị 2, trang 8) |
| `kiem-tra.py` | Kiểm tra hợp lệ, độ phủ bảng ánh xạ, tham chiếu nội bộ, đối chiếu id với thư viện bài tập / mô phỏng |
| `_tools/` | Script sinh ví dụ và bảng ánh xạ: `make_trich.py` đọc HTML ở `fix/`, `fix2/`; `make_features.py`; `make_map.py` |

Chạy kiểm tra: `python3 -I kiem-tra.py`. Sinh lại ví dụ: `python3 -I _tools/make_trich.py <R> .` (với `<R>` là gốc scratchpad).

## Nguyên tắc thiết kế

1. **Chế độ nền là "trang gốc + ghim" (D1).** Chỉ có `profile` và `pages` là bắt buộc. Một cuốn họ A (matematika5, informatika5, kimyo8, fizika8) chỉ cần `pages[].tr/pins`, cùng `exercises`, `videos` và `figures` để ghim trỏ tới.
2. **Lớp "bài học"** là `lessons[].blocks`, bật bằng `features.layers.bai_hoc`. **Lớp "đọc văn"** gồm `reading` cùng các khối `poem`/`prose` với câu kiểu `sentence`, bật bằng `layers.doc_van`. Hai lớp này dùng chung trang, bài tập và media với chế độ nền, không phải bộ máy riêng.
3. **Khối tách hai trục.** `block.type` là dạng nội dung (trục 3), có 13 giá trị chung: text, list, prompt, image, figure, video, simulation, exercise, poem, prose, table, procedure, workbook_link. `block.rubric` giữ nguyên tên mục gốc của bộ sách (trục 2): `objectives`, `think`, `pre`, `talk`… Vì vậy `think` của tabiiy5, `think` của biologiya5 và `pre` của adabiyot5 cùng là `type: prompt` nhưng giữ được rubric riêng.
4. **Bài tập và mô phỏng không có enum cứng.** `kind` dùng pattern `^ex\.` / `^sim\.`; giá trị hợp lệ lấy từ `thu-vien/bai-tap/danh-muc.json` và `thu-vien/mo-phong/danh-muc.json`. Các ví dụ đã đối chiếu: 22/22 id `ex.*` và 4/4 id `sim.*` đều có trong hai danh mục.
5. **Video hoạt hình dựng bằng mã** được lưu là `videos[].scenes[]`, mỗi cảnh gồm `{title, narration, visual}`, trong đó `visual` là một `sim.*`. Ví dụ: `v.k='img'` thành `sim.scene_page_image`, `cShell` thành `sim.atom_shells`, hàm `draw()` vẽ tay thành `sim.scene_custom_draw` (tham số hoá ở bước ④). Cả video do `sim.scene_player` phát.
6. **Một kiểu chuỗi đa ngữ.** `i18n` = `{uz (bắt buộc), ru, vi, kaa}`. `sentence` = `i18n` + `audio_ref` + `no_read`, dùng ở mọi chỗ có thể đọc to. Dấu nội dòng được giữ nguyên: `**đậm**` (tabiiy5) và `{tử/mẫu}` (matematika5).
7. **Một kiểu audio.** Ba định dạng gốc là `AUDIO.vi[k]=[file,start,dur]` (A), `SPRITE['<id>-<lang>']` (tabiiy5/biologiya5) và `SPR[lang][f][a]` (adabiyot5). Cả ba gộp thành `media.clips[id][lang] = {file, start, dur, source_hash, text_path}`. `source_hash` là `sha256:` của chuỗi nguồn (UTF-8, NFC); nhà máy media so hash để biết audio nào đã cũ.
8. **Toạ độ** tính theo % ảnh trang, `box = [x,y,w,h]`. Riêng lớp chữ thật (`text_lines`) giữ hệ toạ độ PDF và khai báo trong `print_text.width/height`.
9. **Lớp giáo viên** (`teacher`) gom các ghi đè dùng chung qua db: `media/` (`__VM`), `edit/` (biologiya5), `quiz/` (adabiyot5), `hw/` và `res/` (matematika5). Trạng thái học sinh có một hình dạng chung, `$defs/learner_state`, dùng cho cả localStorage hiện nay lẫn `res/` trên db.
10. **Giao bài + kết quả lớp cho cả 7 cuốn (D2).** Theo mẫu matematika5: GV (`user.canEdit` hoặc `window.__TEACH`) ghi `hw/<bộ>` = `$defs/assignment` `{on, due}`; học sinh đẩy `res/<bộ>_<uid>` = `$defs/class_result` `{set, uid, ok, tot, opd, op, mark, answers, ts}` (debounce 1,5 s); bảng "Kết quả cả lớp" đọc `res` theo `set`, tên lấy từ `user.profiles`; GV chấm câu mở ghi `grade/<bộ>_<uid>` = `$defs/teacher_grade`. Cấu hình ở `features.classroom`; `features.schema` buộc có `classroom` + capability `db`, `user` khi bật `results_to_db`/`teacher_assign`.
11. **Tài nguyên ở nguồn khác (D2).** `asset_sources.<nguồn>` khai báo artifact đồng hành (vd. ảnh trang bản in Nga); đường dẫn `@<nguồn>/pages_ru/p021.jpg` (`$defs/asset_path`) được đầu đọc giải qua `T0.asset()` (có `url` thì ghép, chưa có thì dùng `fallback_base`).
12. **Chấm đáp án ngắn (D2).** Mặc định `accept_v2`: mọi dấu nháy đổi về ‘. `grading_defaults.short_answer_rule` (cả cuốn) hoặc `exercise.grading.rule` có thể chọn `accept_v2_math` (thêm bước toán của nrm_v1, vẫn đổi dấu nháy về ‘); `nrm_v1` chỉ còn là bí danh.

## Ký hiệu `schema_path` trong bang-anh-xa.csv

- `book:/pages/*/tr`: đường dẫn trong bản ghi theo `book.schema.json`; `*` là một phần tử mảng hoặc một khoá bất kỳ.
- `book:$defs/learner_state`: một định nghĩa dùng chung.
- Một mã gốc có thể có nhiều dòng, ví dụ `window.PG` tách ra `pages`, `pages/*/tr`, `pages/*/pins`, `exercises`. `kiem-tra.py` xác nhận mọi đường dẫn đều tồn tại trong schema.
- Các cấu trúc chỉ có lúc chạy (`ROBO_HOST`, `ROBO`) được ánh xạ về `book:/profile` kèm ghi chú: ngữ cảnh gia sư được dựng lại từ profile + trang, không lưu riêng.

## Gộp trùng và tách

- `PG.tr` (4 cuốn A) = trang in của biologiya5/adabiyot5 ở mức vùng chữ, gộp thành `pages[].tr`. Lớp chữ thật (`PG.pg` biologiya5, `LN_.pg` adabiyot5) gộp thành `pages[].text_lines` + `print_text`.
- Ghim: `PG.pin`, `HOT` (tabiiy5), ghim `wb` sinh từ `WBS`, `PG.figs` và `PG.end` (biologiya5), `GEO.anch` gộp thành `pages[].pins` với 15 giá trị `kind`. `HOT` của adabiyot5 **cùng tên nhưng khác nghĩa** (điểm chạm nối dòng chữ với câu), nên tách ra `reading.anchors`, mỗi anchor có thêm một ghim `kind: text_anchor`.
- Ô nhập trên trang: `WBI`, `WBGEO` (`b` là ô, `l` là dòng `[x1,y,x2]`), `GEO.tbl`, `GEO.wl` gộp thành `pages[].fields`.
- Khám phá hình: `PG.fig` (kimyo8/fizika8) và `figure.xp` (biologiya5) gộp thành `figures[]`. `mountFlower` là một mô phỏng `sim.figure_explorer`.
- Thuật ngữ: `BOOK.glossary` dạng mảng (tabiiy5/biologiya5) và `gloss{w,d,tr}` (adabiyot5) gộp thành `glossary[]`.
- `window.DM`: ở informatika5 là 81 kịch bản, ánh xạ thành `simulations` `sim.screen_demo`. Ở kimyo8/fizika8 nó là `{}` rỗng, ghi "bỏ".
- `RUDICT` + getter `Object.prototype.ru` thành `translation_memory`, chỉ dùng khi nhập liệu. D2: giữ trường (tùy chọn) để tương thích; bước ④ ưu tiên đổ bản dịch `ru` vào từng chuỗi.

## Quy ước id (D2: id bền)

- Id lấy theo mã gốc khi mã có: `t4`, `l11`, `key11`, `a11`, `v1`, `u2.1.3` (bid). Không có thì lấy từ số in trên sách: bài `p21.q5` (trang 21, bài số 5), hình `p37.rasm4`; thuật ngữ dùng id của `tri-thuc/thuat-ngu.json` (`term.gul`). **Không dùng chỉ số vị trí** (`ex0`, `fig0`, `g.ch1.0`); id cũ ghi vào `legacy_ids` để chuyển dữ liệu học sinh. `kiem-tra.py` mục 7 chặn id theo vị trí.
- Khối tabiiy5 có id `l11-<i>` và audio `l11-b<i>`, đúng với tham chiếu trong `HOT` (`quiz → l11-9`). Bài học của adabiyot5 tạm đặt `u2.1`, tức phần 1 của đơn vị 2, suy từ tiền tố của `bid`.
- Trong ví dụ có tham chiếu trỏ ra ngoài phần trích (kimyo8: `video.i4`, `t8.quiz`…; tabiiy5: `v2`). `kiem-tra.py` liệt kê các tham chiếu này nhưng không tính là lỗi.

## Đề xuất bổ sung (chưa cuốn nào có, nên không đưa vào danh mục chính)

- **Dữ liệu sách giáo viên**: kế hoạch bài, phân bổ tiết, đáp án và gợi ý chấm dành cho giáo viên. Hiện `profile.audience: giao_vien` đã có giá trị nhưng chưa có khối nội dung tương ứng.
- **Trạng thái duyệt bản dịch theo chuỗi**, ví dụ `reviewed_by` / `machine` cho từng ngôn ngữ. Hiện chỉ có cờ cấp cuốn (adabiyot5 ghi "chưa duyệt").
- ~~Giao bài + kết quả lớp cho mọi cuốn~~ – đã chốt ở D2 (mục 10 ở trên).
- **Văn bản thay thế (alt) cho ảnh và vùng cắt**, phục vụ trợ năng; chưa cuốn nào có.
- **Phiên bản nội dung** (`content_version`) để đối chiếu với `source_hash` của media.
- **Karakalpak (`kaa`)**: đã có chỗ trong `i18n`, chưa có dữ liệu.

## Đã chốt ở D2 (18/11/2026) – chi tiết ở `quyet-dinh/D2.md`

1. Chủ đề `TP` (b0/i*/t*/s*): **giữ** `lessons[]` có `kind` intro/lesson/summary, không tách `topics`.
2. `exercises[]`: **giữ** các trường chung ở cấp schema + `data` cho phần riêng của kind; thêm `cell_options`, `cards[].image`, `grading`, `audio_ref`, `legacy_ids`.
3. **Duyệt** 13 `block.type` và 15 `pin.kind`.
4. Giá trị trục: **giữ** quy ước của `tu-dien-truc.json` (snake_case tiếng Việt không dấu cho giá trị do tầng 0 đặt; tiếng Anh cho khóa, `ex.*`, capability, khóa `features`).
5. `grade_band`: **theo lớp** (cấp lớp), như từ điển trục.
6. `translation_memory`: **giữ** (tùy chọn).
7. Thêm theo đề xuất các agent: `profile.subject_id/country/country_code/tutor`, `clip.render_hash`, `media.files.kind=subtitle`, `$defs/media_lang` (có `zxx`), `audio_ref` cho thuật ngữ/bài tập, `glossary.forms[]`, `text_lines[7]` = `anchor_id`, `ai_feedback.role` theo id `prompts.json`, `asset_sources`, `grading_defaults`, lớp giáo viên `assignment/class_result/teacher_grade`.

## Giới hạn đã biết

- Mới kiểm tra trên phần trích (3 cuốn, 1–3 trang mỗi cuốn), chưa chuyển trọn một cuốn nào.
- Nguồn giọng của audio (người hay máy) chỉ rõ ở adabiyot5 (TTS); các cuốn khác ghi `unknown` / `mp3_khong_ro`.
- Chưa biết chính xác clip khối của tabiiy5 (`l11-b0`…) đọc những chữ nào, nên các clip này có `text_path` (trỏ tới khối) nhưng không có `source_hash`.
