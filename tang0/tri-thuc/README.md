# Tri thức dùng chung: thuật ngữ, bộ mục, cấp tuổi (tầng 0, v0.9 nháp)

Thư mục này là thành phần **E. Thuật ngữ** của bước ② Hợp nhất. Tất cả dữ liệu được trích thẳng từ mã HTML của 7 cuốn (`fix/…`, `fix2/tabiiy5`, `fix2/adabiyot5`), không có nội dung tự viết thêm.

## Các file

| File | Nội dung |
|---|---|
| `thuat-ngu.csv` | 2701 thuật ngữ, mỗi thuật ngữ một dòng. Cột: `id, uz, ru, vi, mon, lop_xuat_hien, nguon, ghi_chu` |
| `thuat-ngu.json` | Cùng 2701 mục, bản đầy đủ: định nghĩa 3 thứ tiếng, tên tiếng Anh, biến thể, `axes`, `sources[]` (cuốn, trang, mã gốc) |
| `rubric-bo-sach.json` | 39 khái niệm chung (trục 2), gom 97 mục gốc của 7 bộ sách |
| `cap-tuoi.md` | Hướng dẫn theo cấp tuổi, chỉ gồm số liệu đo được |
| `_scripts/` | `dump.js` chạy các `<script>` của cuốn trong `vm` có DOM giả rồi xuất biến dữ liệu; `build_terms.py`, `build_rubric.py`, `stats_age.py`; `peek.py` |
| `_dump/` | `stats_terms.json`, `age_stats.json` (số liệu của README và cap-tuoi). Dữ liệu trích trung gian đã xoá, chạy lại `dump.js` để tạo lại |

Cách chạy lại:
1. Trong `_scripts/`, chạy `node dump.js <index.html> ../_dump/<cuon>.json <tên biến…>`. Lệnh cụ thể cho từng cuốn xem ở cuối file này.
2. Trong `_dump/`, chạy `python3 -I ../_scripts/build_terms.py`, rồi `build_rubric.py`, rồi `stats_age.py`.

## Nguồn thuật ngữ (`ghi_chu` → `loai=`)

| loai | Lấy từ | Cuốn |
|---|---|---|
| `glossary` | `BOOK.chapters[].glossary` (tabiiy5); `BOOK.glossary` + `PG.T(k=gw)` để lấy ru (biologiya5); `DATA.units[].gloss` (adabiyot5); trang Glossariy 130–175 trong `PG.tr` (informatika5) | 4 cuốn |
| `keyword` | khối `keywords` (biologiya5); dòng "Kalit so‘zlar. X: định nghĩa." trong `PG.tr` (informatika5) | 2 |
| `key_concept` | dòng "Tayanch tushunchalar: a, b, c." trong `PG.tr` | kimyo8 |
| `bold` | chữ in đậm `**…**` trong khối bài học, ghép uz↔vi theo thứ tự. Chỉ ghép khi số chỗ in đậm hai bên bằng nhau: 71/71 đoạn khớp | tabiiy5 |
| `fig_item` / `fig_label` | tên điểm của hình khám phá (`fig.items[].name`, `figure.xp.items`) và nhãn hình (`figure.labels`) | biologiya5, kimyo8, fizika8 |
| `chapter_title` / `lesson_title` / `unit_title` | `CH`, `TP[].title` (chỉ lấy chủ đề bài học: bỏ `kind` book/intro/summary, bỏ tiền tố "N-§."), `BOOK.chapters/lessons`, `DATA.units[].meta` | 7 |

Quy tắc gộp và tách:
- **Gộp** khi chữ uz giống nhau sau chuẩn hoá: chữ thường, thống nhất dấu nháy `ʻ ‘ ’ ʼ`, bỏ ngoặc kép « », bỏ dấu câu ở hai đầu. Đồng thời bản dịch phải cùng nghĩa, nghĩa là có ít nhất một từ vi chung (so không dấu, bỏ từ hư) hoặc một gốc từ ru chung. Khi gộp, cột `nguon` nối nguồn của mọi lần xuất hiện, `vi_khac=` giữ các bản dịch vi khác.
- **Tách** khi cùng chữ uz nhưng bản dịch không có chung từ vi nào và không có chung gốc từ ru nào, hoặc khi hai mục Glossariy có tên tiếng Anh khác nhau. Mục tách ra mang hậu tố `__<môn>` và ghi `dong_am_tach_nghia=N`. Có 13 cặp: *urug‘* (hạt / chi phân loại), *shox* (cành / sừng), *qisqichlar* (càng cua / chốt nối), *hodisa* (hiện tượng / sự kiện-Event), *dastur* (Application / Program), *obyekt* (Entity / Object), *raqamli* (Digital / Numeric)…
- Dạng in đậm có biến cách (ví dụ "hayot siklini") được gộp vào thuật ngữ gốc của cùng cuốn khi bản dịch vi giống hệt. 32 dạng in đậm không có mục gốc vẫn được giữ thành dòng riêng, chữ uz để nguyên dạng như trong bài.
- Tên điểm hình bị loại khi chỉ là ký hiệu (R₃, "d) 4 ∥ 12") hoặc là câu mô tả có dấu ":". Đã loại 78 tên: kimyo8 38, fizika8 35, biologiya5 5. Nhãn liệt kê "a) ", "4. " ở đầu tên được cắt bỏ.

## Thống kê

**Số dòng theo cuốn** (một dòng có thể thuộc nhiều cuốn; 27 dòng dùng chung từ 2 cuốn trở lên):

| Cuốn | Dòng | Thành phần (theo loại chính của dòng) |
|---|---|---|
| informatika5 | 871 | glossary 809, keyword 29, tên bài/chương 33 |
| fizika8 | 721 | fig_item 657, tên bài/chương 55, khác 9 |
| biologiya5 | 485 | fig_item 352, keyword 66, glossary 37, fig_label 11, tên 18, bold 1 |
| kimyo8 | 400 | fig_item 303, key_concept 49, tên 43, khác 5 |
| tabiiy5 | 145 | glossary 85, bold 33, tên 27 |
| adabiyot5 | 66 | glossary 56, tên đơn vị 10 |
| matematika5 | 42 | chỉ tên chương/bài (sách không có bảng thuật ngữ hay từ khoá) |

**Theo môn:** informatics 871 · physics 721 · biology 485 · chemistry 400 · natural_science 145 · literature 66 · mathematics 42. **Theo lớp:** lớp 5 có 1604 dòng, lớp 8 có 1112; 15 dòng có mặt ở cả hai lớp.

Có 1012 mục kèm định nghĩa và 808 mục kèm tên tiếng Anh (Glossariy của informatika5).

**Độ phủ 3 thứ tiếng:**

| | uz | vi | ru |
|---|---|---|---|
| Toàn bộ (2701) | 100 % | 100 % | 99,4 % (2685) |
| tabiiy5 (145) | 100 % | 100 % | 89 % (129). 127 mục lấy ru từ từ điển `RUDICT`, không có trong dữ liệu bài; 16 mục chữ in đậm không tra được |
| 6 cuốn còn lại | 100 % | 100 % | 100 % (ru có sẵn trong dữ liệu) |
| `kaa` (Karakalpak) | 0 % | | Chưa cuốn nào có |

Lưu ý về chất lượng:
- Cột vi/ru là **bản dịch đi kèm sách số, chưa qua người bản ngữ duyệt**. Chân trang adabiyot5 có ghi rõ điều này.
- Ở informatika5 có 18 mục mà vi/ru bị lặp ngoặc, ví dụ "Hộp thư đến (Inbox) (Inbox)". Lỗi này có sẵn trong dữ liệu gốc và được giữ nguyên.
- Có 27 dòng gộp liên môn được đánh dấu `KIEM_TRA_nghia_lien_mon`, ví dụ *Kalit*: Khoá/Key ở Tin, công tắc ở Lý; *Element*: phần tử/pin.

## Bộ mục (`rubric-bo-sach.json`)

- 39 khái niệm, mỗi khái niệm có `members[]` gồm `book`, `code`, `label{uz,vi,ru}`, `origin` (`ban_in` hoặc `them_khi_so_hoa`), `count` và `where`.
- Nguồn có độ tin cậy cao nhất là các **trang giải thích mục do chính sách in**: matematika5 tr.1–2 (cả SGK và vở), informatika5 tr.5, ký hiệu quy ước ở kimyo8 tr.2 và fizika8 tr.2. Các sách dựng lại khối (tabiiy5, biologiya5, adabiyot5) lấy nhãn từ hằng `UI` và từ `title` của khối.
- Khái niệm có mặt nhiều cuốn nhất: `knowledge_check` có ở 7/7 cuốn, nhưng 5 cuốn là do bản số thêm vào; `lesson_video` 6/7, toàn bộ do bản số thêm; `think_prompt` 5/7, cùng nhãn "O‘ylab ko‘ring"; `glossary` 4/7; `review` 4/7.
- 13 trên 39 khái niệm chỉ có ở một cuốn. Bộ mục gắn với từng bộ sách và từng nhà xuất bản, nên trục 2 cần được thiết kế như một **bảng ánh xạ mở rộng được**, không nên là enum cứng.

## Đã chốt ở D2 (18/11/2026)
1. Tên điểm hình (1.302 dòng): **giữ trong bảng chính** (agent áp dụng chọn, tương thích ngược), lọc được bằng `kinds`/`loai=fig_item`; chưa tách file "từ vựng hình".
2. Tên chương/bài (228 dòng): **giữ**, đánh dấu `loai=chapter_title|lesson_title` để lọc.
3. Bản dịch vi/ru: **phải qua người bản ngữ duyệt** trước khi dùng làm chuẩn; tới lúc đó coi là "chưa duyệt" (cờ `ban_dich_chua_duyet`).
4. Trục 2: **bảng ánh xạ mở rộng được** (theo đề xuất; đã thể hiện ở `tu-dien-truc.json` nhóm `khai_niem`).
5. `lesson_question` **không gộp** vào `think_prompt` (agent áp dụng chọn: giữ tách, gộp sau không mất dữ liệu).
6. Glossary trong sách số dùng id thuật ngữ ở đây (`term.<slug>`) làm id bền; thêm `forms[]` (dạng biến tố) và `audio_ref` (book.schema v0.9.0).

## Đề xuất bổ sung (chưa cuốn nào có, nên không đưa vào danh mục chính)

1. Cột `kaa` cho thuật ngữ Karakalpak. Hiện 0 %.
2. Glossary cho matematika5. Sách in không có, nhưng có thể rút ra từ các vùng dịch ngắn lặp lại như "asos/đáy", "balandlik/chiều cao".
3. Liên kết thuật ngữ với audio phát âm. Hiện chỉ biologiya5 có ~71 MB `fx-*.mp3` cho điểm hình, nhưng không có mã nào phát.
4. Trường `level` / khái niệm tiên quyết giữa các lớp, ví dụ *azot* ở lớp 5 và lớp 8, để đầu đọc nhắc lại thuật ngữ đã học.
5. Quy tắc cho cấp tuổi 0–9 và cho sách giáo viên. Cần ít nhất một cuốn mẫu cho mỗi cấp (xem cuối `cap-tuoi.md`).

## Lệnh trích dữ liệu đã dùng

```
node dump.js fix2/tabiiy5/index.html  ../_dump/tabiiy5.json   window.BOOK HOT window.RUDICT window.VIDEOS window.WB
node dump.js fix/biologiya5/index.html ../_dump/biologiya5.json window.BOOK window.PG window.RUDICT window.VIDEOS RUB
node dump.js fix2/adabiyot5/index.html ../_dump/adabiyot5.json DATA HOT
node dump.js fix/<matematika5|informatika5|kimyo8|fizika8>/index.html ../_dump/<cuon>.json window.PG window.TP CH window.WBP window.DM window.RUTXT
node dump.js … UI KNAME (tabiiy5_ui) · UI RUB (biologiya5_ui)
```
