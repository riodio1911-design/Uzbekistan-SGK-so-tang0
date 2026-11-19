# 015 – Quy tắc id bền thống nhất và trường exercise.series

**Ưu tiên:** P0 · **Độ khó:** thấp · **Phụ thuộc:** Không · **Số chỗ thiếu thô gộp vào:** 8

## Thay đổi gì
- Schema `exercise` thêm `series: {kind: "main|mashq|test|amaliy|misol|warmup|other", no?: int, title?: i18n}` (nhóm bài in).
- README schema chốt một quy tắc id cho mọi cuốn:
  - `p<trang>[.<series>].q<số>`; series token: `m<N>` (N-mashq), `test`, `amaliy`, `g<k>` (nhóm thứ k không có tên);
  - slug số in: `★`→`star`, `*`→`s`, `–`/`-`→`_`, `1-misol`→`1_misol`, `T1`→`t1`;
  - hình không số: `p<n>.rasm_<slug 3 từ đầu chú thích uz>`, không đổi khi sửa chú thích;
  - khối/tác phẩm: `block.anchor` (xem 019).
- `kiem-tra.py` mục 7 kiểm thêm: id trùng sau khi slug, id có hậu tố kiểu `-2`, `_2`, `b`.

## Vì sao + bằng chứng
4 cuốn tự chọn 4 cách khác nhau cho cùng một vấn đề: matematika5 TC5 `p14.q1-2` (21 bài), TC6 `qstar` (83); informatika5 hậu tố `b`; kimyo8 TC-B1 `p151.q1_2` (9), TC-B2 hình không số (43/74), TC-B3 slug (33); fizika8 TC-2 `m<N>/test/g<k>` (54 lần trùng). adabiyot5: id = bid theo vị trí (124 bài). Id là khóa lưu bài làm (`res/`) nên phải chốt trước khi publish.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** matematika5, informatika5, tabiiy5, biologiya5, adabiyot5, kimyo8, fizika8
- **Loại sách mới:** Mọi sách: tarix7 metodika có "TEST" theo bài, ingliz2 "Progress check", chizmachilik8 "Nazorat ishi".
- **Nguồn đã nêu chỗ thiếu này:** adabiyot5, fizika8, informatika5, kimyo8, matematika5

## Tương thích ngược
Có điều kiện: id đã sinh ở bước ④ của m5, inf5, kim8 phải sinh lại; id cũ vào `legacy_ids` nên không mất dữ liệu (chưa cuốn nào publish bản mới).

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P0
- Phụ thuộc: Không

## Cần người quyết
Chốt token series và slug (bảng trên). Đề xuất: theo fizika8 (`m<N>`, `test`, `g<k>`) vì gỡ phần lớn 54 lần trùng bằng tên dãy in, chỉ còn 16 bài phải dùng `g<k>`.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 5 | matematika5 | id | TC5 id khi trùng số in | Hai bài cùng số in trên một trang; tạm đặt p<n>.q<số>-2 |
| 6 | matematika5 | id | TC6 token số "★" | Số bài "★" (khởi động) chưa có quy ước; tạm p<n>.qstar |
| 25 | informatika5 | id | hậu tố trùng số "b" | Trùng số trong cùng trang → hậu tố b (khác m5, kimyo8, fizika8) |
| 72 | adabiyot5 | id | id bài = bid theo vị trí | Bài tập dùng id = bid cũ (u2.1.8), thực chất theo vị trí trong bài |
| 85 | kimyo8 | id | TC-B1 hai bài cùng số in | Tạm p151.q1_2; đề xuất tiền tố nhóm in |
| 86 | kimyo8 | id | TC-B2 hình không số in | Tạm p<n>.rasm_<3 từ chú thích> |
| 87 | kimyo8 | id | TC-B3 số in không phải số | 1-misol, ★, 1–3, T1, 1-v → slug ASCII |
| 96 | fizika8 | id | TC-2 nhiều dãy số trên một trang | Quy ước tạm m<N>/test/g<k>; đề xuất exercise.series |
