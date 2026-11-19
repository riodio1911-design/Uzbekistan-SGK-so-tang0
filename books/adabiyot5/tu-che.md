# adabiyot5 – những gì tầng 0 v0.9.0 chưa biểu diễn được

Nguồn: `fix2/adabiyot5/index.html` (dữ liệu trích ở `_work/*.json`, mã đã lược bỏ dữ liệu ở `_work/code.html`). Script chuyển đổi: `_work/migrate.py`.
Lưu ý về dấu `_tu_che`: `block`, `scene`, `page` và phần lớn đối tượng trong book.schema có `additionalProperties: false`. Vì vậy chỉ gắn được dấu `"_tu_che"` ở chỗ có object tự do (`exercise.data`). Các chỗ còn lại ghi đúng vị trí trong book.json như dưới đây.

## A. Nội dung và dữ liệu

| Mã | Mô tả | Vị trí trong mã cũ | SL | Cách tạm xử lý trong book.json | Đề xuất cho tầng 0 |
|---|---|---|---|---|---|
| TC-01 | Thể loại của truyện văn xuôi (`genre`, chuỗi đa ngữ: “ertak. I qism”, “hikoya”, “Rivoyat”…) | `DATA.units[].blocks[t=prose].genre`, hiện trong `B.prose` | 9 | Để ở `block.note` (i18n). Danh sách: u3.1.5, u4.2.8, u5.1.3, u5.3.0, u7.1.3, u7.1.6, u7.1.11, u7.1.14, u9.1.4 | Thêm `block.genre: i18n` (hoặc `subtitle`). Mô tả `block.style` hiện ghi "prose.genre" nhưng đó là chuỗi đơn ngữ |
| TC-02 | Chú thích ảnh cảnh minh họa trong văn xuôi (`scenes[].cap`) | `blocks[t=prose].scenes[].cap`, hiện dưới `<figure>` | 9 | `ui_strings["_tu_che.scene_caption.<bid>.<i>"]` (i18n đầy đủ) | Thêm `caption: i18n` vào `block.scenes[]` |
| TC-03 | Phim tranh (`story()`): tranh cắt từ trang đổi theo chỉ số câu, phụ đề 3 thứ tiếng, audio từng câu, tự sang câu. GV thay bằng link hoặc video tải lên | `story()`, `playMedia()`, `mediaCard()` | 39 tác phẩm, 1.063 câu | Trải thành `videos[]` (`video.<bid>`, kind `clip`): mỗi câu là một cảnh, narration = bản chép câu (có `audio_ref`), visual = `sim.scene_page_image{crop}`. Ghim `story` trỏ tới video; block có `video_ref`. GV thay media qua `teacher.media_overrides` (đang rỗng) | Cho `sim.picture_story` một dạng tham số chính thức `{block_ref, autoplay}` để khỏi chép câu (+~0,4 MB). Đầu đọc cần renderer `sim.picture_story` |
| TC-04 | Ảnh đại diện gia sư Oqilbek (nút chat) cắt từ trang 3 (= hero của u1) | `fab.innerHTML=crop(DATA.units[0].meta.hero)` | 1 | Không lưu riêng. Suy ra được từ `units[0].hero` | Thêm `profile.tutor.avatar: page_crop|asset_path` |
| TC-05 | Chỗ trống `– …` tự sinh trên trang (regex BLANK, chỉ ở câu `na=1` có điểm chạm) | `svgFor()`, `pinsFor()`, khóa `<bid>.e<k>.<i>` | 2 câu / 10 chỗ trống | `ex.fill_blanks` `u2.1.23.e1`, `u4.2.14.e4` (`data._tu_che: "TC-05"`, `data.auto_blank_pattern`, `data.source_item`). `pages[].fields` type `gap` có hộp tính lại bằng công thức cũ (x0, y0, max(x1,520)) | Bước ④ đã sinh tĩnh. Nên chuẩn hóa `ex.fill_blanks.rows[{pre,post}]` ở cấp schema và bỏ chế độ tự sinh |
| TC-06 | Id neo tác phẩm của poem/prose (`b.id`), dùng cho nút nhảy `#w-<id>` | `blocks[].id` | 39 | Không có trường. Ánh xạ bid→id cũ: u1.1.3=u1p1-oynur, u2.1.1=u2-qushcha, u2.1.6=u2-vatan, u2.1.12=u2-yulduz, u2.1.15=u2-burgut, u2.1.19=u2-baliqcha, u3.1.5=u3p1-ertak, u3.2.1=u3p2-ertak-a, u3.2.2=u3p2-ertak-b, u3.2.3=u3p2-ertak-c, u4.1.3=u4p1-pahlavon, u4.1.7=u4p1-kamtarlik, u4.1.11=u4p1-savob, u4.1.17=u4p1-navoiy, u4.1.21=u4p1-ona, u4.2.1=u4p2-navoiy-vada, u4.2.8=u4p2-girgitton, u5.1.3=u5p1-boychechak, u5.2.0=u5p2-boychechak, u5.3.0=u5p2-hovlidagi-maydoncha, u6.1.3=u6-darsdan-song, u7.1.3=u7p1-ibnsino, u7.1.6=u7p1-non, u7.1.11=u7p1-vasiyat, u7.1.14=u7p1-yaxshilik, u8.1.2=u8-ohu, u8.1.8=u8-turnalar, u8.1.10=u8-ganicha, u9.1.4=u9p1-hikoya, u9.2.2..6=u9p2-hikoya-a..e, u10.1.3=u10-bulut, u10.1.8=u10-torgay, u10.1.12=u10-shudring, u10.1.18=u10-baliq-ovi, u10.1.22=u10-qishlogim | Thêm `block.legacy_ids` (hoặc `anchor`). Không có dữ liệu học sinh gắn với id này |
| TC-07 | Họ font của chữ trang dựng lại: style[0] = 0 Nunito, 1 Arimo, 2 Literata (Google Fonts). `fitFonts()` chọn độ đậm Nunito sao cho khớp `textLength` | CSS `.f0/.f1/.f2`, `fitFonts()` | 33 kiểu | `print_text.styles` giữ nguyên `[font, bold, italic, color]`. Bảng chỉ số font → họ font chưa có chỗ | Thêm `print_text.fonts: ["Nunito","Arimo","Literata"]`. Theo D2/U4 thì font là tệp woff2 đi kèm |
| TC-08 | Tọa độ trang dựng lại là 581.11×822.05, không phải 595×842 như bản trích ở `schema/vi-du` | `svgFor()` viewBox | – | Đã đặt `print_text.width/height = 581.11/822.05` (đúng mã) | Sửa `vi-du/adabiyot5.book-trich.json` (đang 595×842, chữ lệch khoảng 2,4 %) |
| TC-09 | Tên bài (lesson): dữ liệu cũ không có. Lesson = tiền tố bid `uN.K` | – | 15 | `lessons[].title` = tên đơn vị. `page_range` suy từ trang khối đầu tiên | Không cần đổi; ghi nhận |

## B. Đầu đọc thiếu (dau-doc v0.9.0, không sửa core)

| Mã | Thiếu | Ảnh hưởng với adabiyot5 |
|---|---|---|
| DD-1 | Renderer `ex.mark_done`, `ex.oral_recording`, `ex.fill_blanks` | 5 + 1 + 2 bài hiện "Chưa hỗ trợ" (trong chế độ bài học) |
| DD-2 | Không chế độ nào vẽ `pages[].fields` (`table_cell`, `write_lines`, `gap`) | 59 ô bảng, 14 ô dòng kẻ, 2 câu chỗ trống trên trang chưa nhập được tại chỗ; vẫn làm được trong bài học (bảng) |
| DD-3 | Chế độ trang gốc vẽ mọi ghim `text_anchor` thành chấm "missing" (ref là anchor, không phải clip) | 1.432 chấm trên trang (xem `preview/_anh/1-ghim-trang8.png`). Nên ẩn `text_anchor` khi trang có `text_lines`, hoặc phát clip theo `reading.anchors[].target` |
| DD-4 | Chế độ đọc văn chỉ đọc block `text/prose/poem`; bỏ qua `prompt` (pre/think/task) và câu hỏi trong bài tập | Các dòng pre/think/talk/task trên trang dựng lại không bấm nghe được; bản cũ có play cho các câu này |
| DD-5 | Nhãn mục: `rubric-data.js` dùng khóa `poem|prose (rub read)`, `task kind=topshiriq`; book dùng `poem`, `prose`, `task.topshiriq` | Nhãn "Zavqli mutolaa", "Topshiriq/Uyga vazifa/Ijodiy ish" không hiện. Nên chuẩn hóa khóa trong `tri-thuc/rubric-bo-sach.json` |
| DD-6 | Chưa có giao diện giáo viên: sửa/ẩn/thêm bộ quiz (db `quiz/<id>`, khóa trả lời `.v<v>`), thêm nút video (id `l…`), thay media phim tranh (asset ≤ 20 MB) | Schema có `teacher.content_overrides/media_overrides`; đầu đọc chưa ghi |
| DD-7 | Không có `sim.picture_story` | Đã thay bằng `videos[]` + `sim.scene_player` (TC-03) |

## C. Không chuyển (mã thừa theo kiểm kê)
- Nhánh `input:'draw'` + `initDraw()`: 0 khối dùng.
- Chế độ "ảnh trang + hotspot" (`paper()` khi mode≠html): HOT vẫn chuyển đủ thành anchors và ghim.
- Khóa UI không dùng (`unitsel`, `works`); cờ `window.__TEACH` (đã ghi ở `features.classroom.teacher_detect` của tầng 0).
- 158 tệp audio thừa ở gốc `audio/`: bản artifact hiện tại (1793933843-fea1) đã gỡ, danh sách còn 336 tệp.
- Chuỗi giao diện chung (bảng `UI`, khoảng 90 khóa) thuộc tầng 0. `ui_strings` chỉ giữ các chuỗi riêng của cuốn: `book`, `lead`, `foot`, `voice`, `kind.*`.
