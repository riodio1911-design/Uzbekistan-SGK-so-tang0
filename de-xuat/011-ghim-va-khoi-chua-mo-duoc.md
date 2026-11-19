# 011 – Ghim và khối chưa mở được, khóa bộ mục lệch

**Ưu tiên:** P0 · **Độ khó:** thấp · **Phụ thuộc:** [009](009-giao-dien-vo-giao-bai-ket-qua-lop.md) · **Số chỗ thiếu thô gộp vào:** 5

## Thay đổi gì
- `modes/pin.js` `resolve()` thêm `link` (ref là id bài → mở lớp bài học hoặc các khối think/explore/widget), `skills`, `term` (mở thẻ thuật ngữ). Bỏ nhánh `kind: 'lesson'` không có trong enum.
- `components/blocks.js` vẽ `blocks[].steps` và nút `video_ref` trong khối text.
- Chuẩn hóa khóa trong `tri-thuc/rubric-bo-sach.json` / `rubric-data.js` theo `block.type` + `task_kind` thật của book (`poem`, `prose`, `task.topshiriq`).

## Vì sao + bằng chứng
tabiiy5: ghim `skills` 23, `term` 84 không xử lý; biologiya5 TC03 (17 ghim link), TC04a (steps 15 khối, video 49 khối); adabiyot5 DD-5 (nhãn "Zavqli mutolaa", "Topshiriq/Uyga vazifa/Ijodiy ish" không hiện). Đối chiếu: `grep case` trong `pin.js` không có `link`, `skills`, `term`.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** tabiiy5, biologiya5, adabiyot5, matematika5
- **Loại sách mới:** Mọi sách.
- **Mở khóa:** 124 ghim + 64 khối + nhãn bộ mục của adabiyot5.
- **Nguồn đã nêu chỗ thiếu này:** adabiyot5, biologiya5, tabiiy5

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P0
- Phụ thuộc: [009](009-giao-dien-vo-giao-bai-ket-qua-lop.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 40 | tabiiy5 | dau_doc_renderer | ghim skills/term | resolve() trong modes/pin.js không xử lý |
| 41 | tabiiy5 | dau_doc_renderer | ghim workbook | Ghim workbook chuyển sang chế độ bài học thay vì mở vở |
| 47 | biologiya5 | dau_doc_renderer | TC03 ghim link | Ghim ≣ "Fikrlash mashqlari" kind link không được resolve |
| 48 | biologiya5 | dau_doc_renderer | TC04a steps + video_ref trong khối text | R.text không vẽ steps và nút "Video izoh" |
| 69 | adabiyot5 | dau_doc_renderer | DD-5 khóa bộ mục lệch | rubric-data.js dùng "poem/prose (rub read)", book dùng poem/prose/task.topshiriq |
