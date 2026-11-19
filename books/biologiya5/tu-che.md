# biologiya5 – những gì tầng 0 v0.9.0 chưa biểu diễn được (bước ④)

Không tự chế thành phần mới trong tầng 0. **Về dấu `_tu_che`:** gần như mọi object trong `book.schema.json` đặt `additionalProperties: false`, nên không gắn được `"_tu_che"` vào đúng chỗ (điểm hình, khối, ghim). Chỉ `exercise.data`, `simulation.params` và `scene.visual.params` là object tự do. Vì vậy mỗi mục dưới đây ghi **đường dẫn JSON** của chỗ bị ảnh hưởng thay cho dấu.

Số đếm khớp với `doi-chieu.json` (cột `tu_che`).

## A. Đầu đọc thiếu (dữ liệu đã có đủ trong book.json)

| Mã | Mô tả | Vị trí mã cũ | Số lượng | Xử lý tạm trong book.json | Đề xuất cho tầng 0 |
|---|---|---|---|---|---|
| TC01 | **Trang in chữ sống ở chế độ nền.** `modes/pin.js` chỉ nhận trang có `images`, và chỉ coi vùng dịch là khớp khi bản in trùng `lang_base`. biologiya5 chỉ có ảnh nền bản Nga đã xoá chữ thân (`pages[].background`). Chữ nằm ở `text_lines`; 12 trang có ảnh trắng giữ chỗ. Kết quả: chế độ "Trang" không hiện, nên bản xem trước mở lớp bài học | `drawPage`, `pageLegend`, `viewPages`, `pg/` | 96 trang · 14.467 dòng · 1.025 vùng dịch · 301 ghim | `pages[].background`, `text_lines`, `split_paragraphs`, `tr`, `pins`; `print_text`; `profile.edition.layout_from = ru` | Chế độ pin nhận trang có `background` + `text_lines` (dùng lại bộ vẽ SVG của `modes/reading.js` dòng ~431). Coi tọa độ khớp với `profile.edition.layout_from` (không chỉ `lang_base`). Chuyển uz/ru trong cùng hộp như `drawPage(uzm)` |
| TC02 | Dạng bài/mô phỏng chưa có renderer (hiện "chưa hỗ trợ") | GACT order, figq, ACT.redi3, ACT.micro3, VK | ex.order 3 · ex.label_reveal 8 · ex.choice_per_row 1 · sim.predict_check 1 · sim.virtual_microscope 1 · cảnh sim.scene_cards 80 / scene_explain 85 / scene_page_image 35 / scene_icon_grid 13 (cả 213 cảnh của 67 video) | Dữ liệu đầy đủ theo `data_shape`/`params` của thư viện | Viết 4 renderer ex/sim + 4 renderer cảnh VK (mã gốc là `window.VK` trong cuốn cũ) |
| TC03 | Ghim ≣ "Fikrlash mashqlari" mở hộp gồm think + explore + widget của bài. `pin.js` chỉ xử lý `kind: 'lesson'` (giá trị này không có trong enum), còn `link` không được resolve | `drawPage` (`.ppin.l`), `thinkDlg` | 17 (l15 không có tiêu đề `i=-1`, mã cũ cũng không có ghim) | `pins[] {kind:'link', ref:'l<n>'}` | `pin.js`: `link` + ref là id bài thì chuyển sang lớp bài học (hoặc mở các khối `think/explore/widget`) |
| TC04a | `R.text` không vẽ `steps` (danh sách đánh số trong khối learn) và `video_ref` (nút "Video izoh") | renderBlock0 `learn` | steps 15 khối · clip 49 khối | `blocks[].steps`, `blocks[].video_ref` | Thêm vào `components/blocks.js` |

## B. Schema chưa có chỗ (mất thông tin nhỏ)

| Mã | Mô tả | Vị trí mã cũ | Số lượng | Xử lý tạm | Đề xuất |
|---|---|---|---|---|---|
| TC04 | Cờ nguồn của điểm khám phá hình: `src: book` (có trong sách) hoặc `added` (người soạn thêm). `figure.points[]` không có trường này | `figure.xp.items[].src` | 400 điểm, trong đó 89 `added` | Bỏ cờ. Danh sách điểm `added` (số thứ tự từ 1) ở cuối file này | Thêm `points[].source: book\|added` (hoặc `supplementary: true`, như `exercise.supplementary`) |
| TC05 | Tỉ lệ khung ảnh `ar` của khối hình/ảnh phụ | `figure.ar`, `pic.ar` | 83 + 10 | Bỏ (suy được từ kích thước ảnh) | `figure.aspect` / `block.aspect` (tùy chọn) |
| TC06 | `need` của thí nghiệm là danh sách; `block.need` chỉ là một chuỗi i18n | `lab.need[]` | 10 khối | Nối các mục bằng "; " | Cho `need` nhận mảng `sentence` |
| TC07 | `PG.fr` lưu phần đoạn vắt trang dưới dạng **tỉ lệ** (0.581); schema yêu cầu số nguyên | `PG.fr` | 70 trang | Đổi sang **chỉ số từ** của bản uz (`round(tỉ lệ × số từ)`). Cách tách giống hệt `drawPage`, không mất thông tin | Ghi rõ đơn vị "chỉ số từ của lang_base" trong mô tả `split_paragraphs` |

## C. Không chuyển, có lý do (mã thừa / dữ liệu chết)

| Mã | Mô tả | Số lượng | Lý do |
|---|---|---|---|
| TC08 | Khóa SPRITE `fx#-#-{uz,ru,vi}` (lời đọc 400 điểm hình) và 8 file `fx-*.mp3` | 1.200 khóa · 8 file (~71 MB) | Không có trong artifact hiện hành (244 file, đã liệt kê bằng công cụ Artifact); `fxOpen` không bao giờ phát. Ánh xạ khớp 100% (fx<n>-<j> ↔ hình n, điểm j), nên muốn có lại thì nhà máy media sinh từ `figures[].points[].desc` (F7: hiện chưa lập phiếu) rồi gắn `desc.audio_ref` |
| TC09 | `RUDICT` + getter `Object.prototype.ru` | 3.236 mục | Theo D2 S6: đã đổ `ru` thẳng vào 35 thuật ngữ (term + definition, qua `ruOf`). Các mục còn lại là chuỗi giao diện của bộ máy cũ hoặc của cuốn khác. Lưu ý: vài bản ru lệch nghĩa so với uz (vd. Antotsian: uz "đỏ", ru "бурый" = nâu), cần duyệt (T3) |
| TC10 | 32/34 hàm `ACT` chép từ tabiiy5; `V.v1–v6` vẽ hoa bị ghi đè; `VIDEO_HELPERS.flower/PARTS/mountFlower`; renderer `objectives/robot/problem/career/skills/workbook/flower`; `window.WB`, route `#wbN`; tiền tố `gul:` | 32 ACT + phần còn lại | Không khối nào gọi (kiem-ke `ma_thua_hoac_loi`) |

## D. Dữ liệu lúc chạy (không có trong mã, chỉ ghi ánh xạ khóa)

- Ghi đè GV ở db `edit/`: `q-l<n>-<i>` → `l<n>.test`; `t-l<n>-<i>` → khối `l<n>-<i>` (think); `x-<n>` → hình `p<trang>.rasm<n>`; `m-<video>` → `teacher.media_overrides.<video>`; `hidden` (`b-l<n>-<i>`, id video) → `content_overrides.*.hidden`. Các id cũ đã ghi vào `legacy_ids` để script chuyển dữ liệu db ánh xạ được. `teacher.content_overrides = {}` vì dữ liệu nằm trên db, không nằm trong mã.
- Bài làm của học sinh ở localStorage: `gul:ans:<lid>-b<i>-<k>`, `…-q<k>`, `…-b<i>-c<n>` (ô bảng), `gul:done` → `legacy_ids` của từng bài tập; ô bảng ở `exercise.data.legacy_cell_key`.

## Điểm hình `added` (TC04)
p10.rasm3: 2,4; p10.rasm4: 2,6; p11.rasm5: 2; p11.rasm6: 2,3,7; p13.rasm8: 5; p14.rasm9: 7; p15.rasm10: 2,3; p21.rasm14: 2,3,7,8; p24.rasm17: 2; p27.rasm18: 2; p27.rasm19: 4; p28.rasm20: 2,3,5; p29.rasm21: 1,3; p32.rasm24: 2,3,5; p33.rasm25: 2,3,4; p37.rasm27: 4,5,6,7; p40.rasm29: 1,3,4; p41.rasm30: 3,7; p41.rasm31: 1,3; p42.rasm32: 1,3; p44.rasm35: 2; p44.rasm36: 6; p45.rasm38: 2; p48.rasm42: 2; p50.rasm43: 6; p55.rasm46: 2; p55.rasm47: 3,4; p56.rasm49: 2; p56.rasm50: 1,3; p57.rasm52: 4; p58.rasm53: 2,3; p63.rasm56: 2,6; p65.rasm60: 2; p65.rasm61: 3; p69.rasm64: 6; p70.rasm65: 2,3; p71.rasm66: 2,3; p71.rasm67: 2,3; p72.rasm68: 2,3; p72.rasm69: 1,2; p76.rasm72: 5,6; p82.rasm75: 1,2,3,4,5,6; p84.rasm76: 2,4; p84.rasm77: 3; p88.rasm78: 2; p88.rasm79: 2; p88.rasm80: 2; p88.rasm81: 4; p89.rasm83: 2,4
