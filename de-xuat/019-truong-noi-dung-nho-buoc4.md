# 019 – Trường nội dung nhỏ còn thiếu từ bước ④

**Ưu tiên:** P1 · **Độ khó:** thấp · **Phụ thuộc:** [017](017-truong-mo-rong-x.md) · **Số chỗ thiếu thô gộp vào:** 10

## Thay đổi gì
Thêm vào `book.schema.json` (đều tùy chọn):
- `block.genre: i18n` (thể loại văn xuôi); `block.scenes[].caption: i18n`; `block.anchor: string` (id neo tác phẩm, `#w-<id>`); `block.need` nhận cả mảng `sentence`.
- `figure.points[].source: "book|added"` (điểm do người soạn thêm).
- `glossary_entry.kind: "glossary|keyword"`, `glossary_entry.en` (nối với 037).
- `profile.tutor.avatar: page_crop | asset_path`.
- `ex.sort_bins.after_check: blocks[]` (nội dung mở ra sau Kiểm tra).
- `ex.fill_blanks.rows[{pre, post, answer}]` chuẩn ở cấp schema; bỏ sinh chỗ trống bằng regex lúc chạy.
- `clip.text` hoặc quy tắc `narration_compose` (cách ghép title+paras+steps+note) để Đóng gói tính lại `text_hash`.

## Vì sao + bằng chứng
adabiyot5 TC-01 (9 thể loại), TC-02 (9 chú thích), TC-06 (39 id neo), TC-04 (avatar), TC-05 (2 câu / 10 chỗ trống tự sinh); biologiya5 TC04 (400 điểm, 89 `added`), TC06 (10 khối); informatika5 TC03 (838 thuật ngữ, có tên tiếng Anh); tabiiy5 TC03 (1 bài), TC06 (145 clip × 3).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** informatika5, tabiiy5, biologiya5, adabiyot5
- **Loại sách mới:** tarix7 (thể loại tư liệu), ingliz2 (glossary en), mọi sách có thí nghiệm.
- **Mở khóa:** Đưa 9+9+39+89 mục đang nằm ngoài schema vào đúng chỗ.
- **Nguồn đã nêu chỗ thiếu này:** adabiyot5, biologiya5, informatika5, tabiiy5

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P1
- Phụ thuộc: [017](017-truong-mo-rong-x.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 18 | informatika5 | schema | TC03 glossary_entry.kind + en | Glossariy có tên tiếng Anh; cần phân biệt glossary/keyword |
| 28 | tabiiy5 | ex | TC03 ex.sort_bins.after_check | Khối thông tin mở ra sau khi Kiểm tra |
| 31 | tabiiy5 | media | TC06 narration_compose | Văn bản thuyết minh clip là chuỗi ghép, cần quy định cách ghép để tính lại text_hash |
| 49 | biologiya5 | schema | TC04 figure.points[].source | Cờ book/added của điểm khám phá hình |
| 51 | biologiya5 | schema | TC06 block.need dạng mảng | need của thí nghiệm là danh sách, schema chỉ nhận một chuỗi |
| 57 | adabiyot5 | schema | TC-01 block.genre | Thể loại truyện tạm để ở block.note |
| 58 | adabiyot5 | schema | TC-02 block.scenes[].caption | Chú thích ảnh cảnh tạm để ở ui_strings["_tu_che…"] |
| 60 | adabiyot5 | gia_su | TC-04 profile.tutor.avatar | Ảnh đại diện Oqilbek cắt từ trang |
| 61 | adabiyot5 | ex | TC-05 chỗ trống tự sinh | Regex BLANK tự sinh chỗ trống; nên chuẩn hóa ex.fill_blanks.rows[{pre,post}] |
| 62 | adabiyot5 | id | TC-06 block.anchor / legacy_ids | Id neo tác phẩm (#w-<id>) không có trường |
