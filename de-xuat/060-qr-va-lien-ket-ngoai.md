# 060 – Mã QR trên trang: ánh xạ sang media nội bộ hoặc liên kết ngoài

**Ưu tiên:** P1 · **Độ khó:** thấp · **Phụ thuộc:** [059](059-ban-quyen-media-rights.md) · **Số chỗ thiếu thô gộp vào:** 7

## Thay đổi gì
- `page.qr[] = {no, bbox: box, target: {kind: internal|external, media_ref?|url?}, checked_at?, status?: ok|dead|unknown}`.
- Đầu đọc: che ô QR bằng ghim; `internal` → phát media trong gói; `external` → `pin.kind = "link"` mở tab mới (Google Maps, phim tư liệu).
- `media.external_video`: `{url, provider, title, rights}`; công cụ kiểm link định kỳ; chính sách khi link chết (ẩn ghim + báo GV).
- Quy trình: QR ở ảnh 100 ppi không giải mã được → lấy danh sách link/tệp từ NXB (061).

## Vì sao + bằng chứng
alifbe1_darslik C13 (28 QR → qr.nvdt.uz/q/209–236; tr.15, 24, 28, 55); musiqa5 C8 (giải mã thất bại ở 200 dpi tr.2; QR có số tr.7, 27, 51), R1; tarix7_metodika C10 (QR phim tr.202–210, 173, 181), M0, R2 (link chết, bản quyền bên thứ ba); onatili3_darslik1 C11 (QR → Google Maps tr.6).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** alifbe1_darslik, musiqa5_darslik, tarix7_metodika, onatili3_darslik1.
- **Nguồn đã nêu chỗ thiếu này:** alifbe1_darslik, musiqa5_darslik, onatili3_darslik1, tarix7_metodika

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P1
- Phụ thuộc: [059](059-ban-quyen-media-rights.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 138 | alifbe1_darslik | schema | qr_media_map | Trang in có 28 mã QR đánh số (1–28 trong mẫu) trỏ ra qr.nvdt.uz/q/209–236 (audio phát âm mỗi chữ + truyện nghe). Schema chưa có nơi khai bá… |
| 277 | musiqa5_darslik | ban_quyen | qr_trong_ban_in | Bản in có QR dẫn đến tài nguyên ngoài. Cần bảng ánh xạ QR→media; ở ảnh 100 ppi QR không giải mã được (cv2.QRCodeDetector trả rỗng), phải lấ… |
| 287 | musiqa5_darslik | ban_quyen | rui_ro[1] | QR không đọc được từ ảnh 100 ppi: phụ thuộc NXB cung cấp danh sách bản thu |
| 302 | onatili3_darslik1 | schema | lien_ket_ngoai_qr | Mã QR trên trang dẫn ra Google Maps – cần ghim liên kết ngoài (mở tab mới), không phải nội dung trong gói. |
| 365 | tarix7_metodika | media | qr_video_ngoai | Mã QR in trỏ tới phim tư liệu bên ngoài; mục tiêu đánh giá yêu cầu xem phim rồi làm bài độc lập. Cần media.external_video (url, nguồn, kiểm… |
| 368 | tarix7_metodika | media | media_dac_thu[0] | mã QR → phim tư liệu bên ngoài (tr.202–210) |
| 374 | tarix7_metodika | ban_quyen | rui_ro[2] | link QR có thể chết, phim có bản quyền bên thứ ba |
