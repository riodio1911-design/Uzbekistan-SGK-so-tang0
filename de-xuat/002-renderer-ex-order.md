# 002 – Renderer ex.order (xếp thứ tự) và ảnh cho bước

**Ưu tiên:** P0 · **Độ khó:** thấp · **Phụ thuộc:** Không · **Số chỗ thiếu thô gộp vào:** 5

## Thay đổi gì
- `components/ex/order.js` theo `data_shape` của `ex.order` trong thư viện: nút lên/xuống + kéo thả, chấm `per_position` (mặc định D2), hiện lời giải theo `ex.aid.show_solution`.
- Schema: cho `exercise.sequence[]` nhận phần tử `{text: i18n, image?: asset_path}` (giữ dạng chuỗi i18n cũ) để thay 8 ảnh SVG vẽ bằng mã của tabiiy5 (`ACT.order12`, `__plant`) sau khi xuất ra `sim/<id>-<k>.svg`.

## Vì sao + bằng chứng
Cùng một dạng bài thiếu renderer ở 5 cuốn: informatika5 14 (TC-DD2, ảnh `11-model-p66.png`), tabiiy5 7, biologiya5 3 (TC02), kimyo8 19 bài / 110 bước (TC-A1: "5 cuốn đang cần dạng này"), fizika8 37 (TC-4). Tổng **80 bài**. Với kimyo8 đây là dạng bài duy nhất còn thiếu (384/403 bài đã chạy). tabiiy5 TC04: ảnh thẻ là SVG vẽ bằng mã.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** informatika5, tabiiy5, biologiya5, kimyo8, fizika8
- **Loại sách mới:** tarix7 (thứ tự sự kiện, mã hóa "2, 3, 1, 4" – đề xuất 058), ingliz2/alifbe1 (sắp xếp tranh).
- **Mở khóa:** 80 bài; kimyo8 lên 100 % bài tập.
- **Nguồn đã nêu chỗ thiếu này:** biologiya5, fizika8, informatika5, kimyo8, tabiiy5

## Tương thích ngược
Có. `sequence[]` vẫn nhận chuỗi i18n như cũ; dạng object là tùy chọn.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P0
- Phụ thuộc: Không

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 20 | informatika5 | dau_doc_renderer | TC-DD2 ex.order | Không có renderer xếp thứ tự |
| 29 | tabiiy5 | ex | TC04 ex.order sequence[].image | Ảnh thẻ là SVG vẽ bằng mã |
| 43 | biologiya5 | dau_doc_renderer | TC02a ex.order | Renderer xếp thứ tự |
| 74 | kimyo8 | dau_doc_renderer | TC-A1 ex.order | Renderer xếp thứ tự (lên/xuống, chấm từng vị trí) |
| 98 | fizika8 | dau_doc_renderer | TC-4a ex.order | Renderer xếp thứ tự |
