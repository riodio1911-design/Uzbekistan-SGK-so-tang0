# 065 – Trang hồ sơ học sinh và mục phụ huynh

**Ưu tiên:** P2 · **Độ khó:** thấp · **Phụ thuộc:** [040](040-ghi-am-va-cham-noi.md) · **Số chỗ thiếu thô gộp vào:** 3

## Thay đổi gì
- `block.type = "profile_page"`: tên/lớp/trường lấy từ capability `user`, ô "My picture" là `ex.sketch`.
- `block.type = "parent_corner"` + `profile.audience` nhận `phu_huynh` cho lớp hiển thị (trục 7 đã có `phu_huynh`): hướng dẫn kèm con, bảng so sánh âm Anh–Uzbek có audio mẫu từng âm.

## Vì sao + bằng chứng
ingliz2_daftar C11 ("My name / My class / My school / My picture" tr.3); ingliz2_darslik C11 ("Parent's corner – Hurmatli ota-onalar!" + bảng âm tr.92–93), M2.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** ingliz2_daftar, ingliz2_darslik.
- **Nguồn đã nêu chỗ thiếu này:** ingliz2_daftar, ingliz2_darslik

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P2
- Phụ thuộc: [040](040-ghi-am-va-cham-noi.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 232 | ingliz2_daftar | block | trang_ca_nhan | Trang hồ sơ học sinh (tên, lớp, trường, ảnh tự vẽ) – bản số lấy từ user capability + ô vẽ. |
| 252 | ingliz2_darslik | block | parent_corner | Mục dành cho phụ huynh ở cuối sách (hướng dẫn kèm con, bảng âm Anh–Uzbek). Rubric chưa có khái niệm cho phụ huynh; đầu đọc có thể có chế độ… |
| 260 | ingliz2_darslik | media | media_dac_thu[2] | Clip mẫu từng âm IPA cho Parent's corner (tr. 92–93) |
