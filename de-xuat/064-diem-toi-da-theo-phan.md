# 064 – Điểm tối đa theo phần trong bài kiểm tra (Progress check)

**Ưu tiên:** P2 · **Độ khó:** thấp · **Phụ thuộc:** [009](009-giao-dien-vo-giao-bai-ket-qua-lop.md) · **Số chỗ thiếu thô gộp vào:** 1

## Thay đổi gì
- `exercise.max_points` và `series.kind = "test"` với `sections[{exercise_refs, max_points}]`; tổng điểm hiện như ô in ("/10", "/8").
- Bảng kết quả GV (009) hiện điểm theo phần. Khác `diem_thang_10_theo_bo` (thang 10 cố định của matematika5).

## Vì sao + bằng chứng
ingliz2_daftar C6 (Progress check 2: /10, /8, /6 tr.45; PC1: /5, /10, /10, /5 tr.36; PC5: /8, /12 tr.72). matematika5 dùng thang 10 theo bộ (trục 5).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** ingliz2_daftar; bài kiểm tra chương của mọi sách.
- **Nguồn đã nêu chỗ thiếu này:** ingliz2_daftar

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P2
- Phụ thuộc: [009](009-giao-dien-vo-giao-bai-ket-qua-lop.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 227 | ingliz2_daftar | truc | diem_thanh_phan_progress_check | Bài kiểm tra có điểm tối đa riêng từng phần in sẵn (ô chéo '/10', '/8', '/6', '/5') và tổng; khác 'diem_thang_10_theo_bo'. Cần trường max_p… |
