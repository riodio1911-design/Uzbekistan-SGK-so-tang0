# 056 – Phương án trắc nghiệm và cột nối là hình

**Ưu tiên:** P1 · **Độ khó:** thấp · **Phụ thuộc:** Không · **Số chỗ thiếu thô gộp vào:** 2

## Thay đổi gì
- `exercise.options[]` và `exercise_item.options[]` nhận `{text?: i18n, image?: asset_path | page_crop}`; tương tự `left[]`/`right[]` của `ex.match_pairs`. D2 đã thêm `cards[].image` cho thẻ; mở rộng cùng kiểu.
- Renderer `choice_single`, `choice_multi`, `match_pairs` hiện lưới tranh khi có `image`.

## Vì sao + bằng chứng
chizmachilik8 C6 (5 hình chiếu ↔ 5 khối tr.55; khung dây ↔ dimetri tr.85; hình chiếu thứ ba tr.72); ingliz2_daftar C8 ("Circle the odd one out" 4 hàng tranh tr.8); musiqa5 C4 (đáp án là hình nhạc cụ). D2 R2.3 đã thêm `cards[].image`.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** biologiya5, tabiiy5
- **Loại sách mới:** chizmachilik8_darslik, ingliz2_daftar, musiqa5_darslik, alifbe1.
- **Nguồn đã nêu chỗ thiếu này:** chizmachilik8_darslik, ingliz2_daftar

## Tương thích ngược
Có. Chuỗi i18n cũ vẫn hợp lệ.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P1
- Phụ thuộc: Không

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 161 | chizmachilik8_darslik | schema | ex.choice_single/match_pairs có phương án là hình | Phương án và cột nối là hình cắt từ trang (chọn hình chiếu thứ ba đúng, nối hình chiếu với khối). Schema đã thêm cards[].image cho thẻ (D2-… |
| 229 | ingliz2_daftar | ex | ex.odd_one_out | Khoanh vật khác loại trong một hàng tranh – có thể gộp vào ex.choice_single với phương án là ảnh, nhưng cần ui 'hàng tranh + khoanh'. |
