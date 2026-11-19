# 012 – Dựng ký pháp toán nội dòng và dòng hướng dẫn gõ

**Ưu tiên:** P0 · **Độ khó:** thấp · **Phụ thuộc:** Không · **Số chỗ thiếu thô gộp vào:** 2

## Thay đổi gì
- Đầu đọc dựng `{tử/mẫu}` (đã ghi trong mô tả `$defs/i18n`) thành phân số ở mọi chỗ hiện chuỗi: trang dịch, bài tập, cảnh, gia sư. Mã gốc: hàm `M()` của matematika5.
- Modal bài tập hiện `ui_strings.type` ("Phân số gõ 2/3, hỗn số gõ 1 2/3") khi `grading` là `accept_v2_math`.

## Vì sao + bằng chứng
matematika5 DT4 (≈6.300 chỗ hiện nguyên `{2/3}`), DT5 (học sinh không biết cách gõ). kimyo8 TC-A2: cảnh `lines` có đánh dấu phân số.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** matematika5, kimyo8
- **Loại sách mới:** Toán/Lý/Hóa mọi lớp.
- **Mở khóa:** ≈6.300 chỗ hiển thị sai.
- **Nguồn đã nêu chỗ thiếu này:** matematika5

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P0
- Phụ thuộc: Không

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 12 | matematika5 | dau_doc_renderer | DT4 ký pháp phân số {a/b} | Đầu đọc không dựng phân số, hiện nguyên "{2/3}" |
| 13 | matematika5 | dau_doc_renderer | DT5 dòng hướng dẫn gõ | Modal bài tập không hiện ui_strings.type ("Phân số gõ 2/3…") |
