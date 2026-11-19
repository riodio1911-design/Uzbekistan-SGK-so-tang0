# 014 – Chuyển dữ liệu chạy cũ (localStorage, db) sang id mới

**Ưu tiên:** P0 · **Độ khó:** vừa · **Phụ thuộc:** [015](015-quy-tac-id-ben-thong-nhat.md) · **Số chỗ thiếu thô gộp vào:** 7

## Thay đổi gì
- Schema: `exercise_item.legacy_ids` (mảng) cho khóa cũ ở cấp ý (`mat5.ans['n.i.j']`, `fiz8.ans`, `gul:ans:<lid>-b<i>-<k>`).
- Đầu đọc: bước chuyển chạy một lần khi mở bản mới: đọc khóa localStorage cũ (`mat5.ans`, `inf5.ans`, `kim8.ans`, `fiz8.ans`, `gul:done`, `gul:ans:*`) → ghi theo id mới → đẩy lên `res/` (D2 N3).
- Quy trình publish: đọc db của artifact cũ (`media/*`, `edit/*`, `quiz/*`) bằng ArtifactData rồi ghi sang artifact mới theo bảng ánh xạ (informatika5 `{url}`→`{mode:'url'}`; biologiya5 `q-l<n>-<i>`→`l<n>.test`…). Ghi bảng này vào README schema.
- Lấy `bytes`/`sha256` của ảnh trang khi chép server-side.

## Vì sao + bằng chứng
matematika5 TC4 (1.461 ý), fizika8 TC-1 (510 ý, 60 bộ quiz), kimyo8 TC-C1–C3, biologiya5 mục D, informatika5 TC02. Không có bước này thì thay cuốn sẽ mất bài làm và video GV đã gắn.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** matematika5, informatika5, tabiiy5, biologiya5, adabiyot5, kimyo8, fizika8
- **Loại sách mới:** Không (chỉ áp cho cuốn đã chạy).
- **Mở khóa:** Giữ bài làm và ghi đè GV của người dùng hiện tại.
- **Nguồn đã nêu chỗ thiếu này:** biologiya5, fizika8, informatika5, kimyo8, matematika5

## Tương thích ngược
Có. Thêm trường tùy chọn; quy trình chỉ đọc dữ liệu cũ.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P0
- Phụ thuộc: [015](015-quy-tac-id-ben-thong-nhat.md)

## Cần người quyết
Có cần giữ dữ liệu localStorage cũ không, hay chấp nhận làm lại? Đề xuất: giữ (chuyển một lần), vì đây là sách đang dùng.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 4 | matematika5 | id | TC4 exercise_item.legacy_index | Khóa lưu bài làm cũ theo vị trí ý mat5.ans["n.i.j"]; exercise_item không có chỗ ghi |
| 17 | informatika5 | quy_trinh | TC02 ánh xạ media_overrides | Video thật GV gắn ở db media/<demo> cần script chuyển {url}/{asset} sang teacher.media_overrides |
| 55 | biologiya5 | quy_trinh | D. ghi đè GV db edit/ + localStorage gul: | Ánh xạ khóa db edit/ và localStorage sang id mới khi publish |
| 88 | kimyo8 | quy_trinh | TC-C1 db media/ của artifact cũ | Video thật GV gắn nằm trên db cũ |
| 89 | kimyo8 | quy_trinh | TC-C2 localStorage kim8.ans, gul:done | Cần bước chuyển một lần sang id mới và res/ |
| 90 | kimyo8 | quy_trinh | TC-C3 bytes/sha256 ảnh trang | media.files[].bytes để trống |
| 95 | fizika8 | id | TC-1 exercise_item.legacy_ids | Khóa fiz8.ans n.i.j và gul:done q:<chủ đề> |
