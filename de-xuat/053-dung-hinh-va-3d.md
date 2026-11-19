# 053 – Hoạt hình dựng hình thước–compa và mô hình 3D có hình chiếu

**Ưu tiên:** P2 · **Độ khó:** cao · **Phụ thuộc:** [005](005-renderer-mo-phong-toan.md) · **Số chỗ thiếu thô gộp vào:** 4

## Thay đổi gì
- `sim.construction_steps`: dãy thao tác `{op: point|line|circle|arc|intersect|label, args, style: main|thin|hidden|axis}` → hoạt hình từng bước (tới/lui/chạy lại), giữ nhãn A, B, O, R như hình in; sinh bằng mã, không quay video.
- `sim.solid_projection_3d`: khối 3D xoay/thu phóng trong hệ ba mặt phẳng H/V/W, tia chiếu, bật/tắt từng hình chiếu, gập H và W về V ra epyur, nét khuất đứt, chuyển sang trục đo izometri/dimetri. Dữ liệu: lưới khối đơn giản (`mesh`) + kích thước.

## Vì sao + bằng chứng
chizmachilik8 C0 (song song cách 30 mm tr.28; chia góc vuông 7.2–7.5-chizma tr.31; girih tr.36; tr.38), C2 (12.2-chizma tr.45; 14.3–14.4 tr.50; 17.2–17.3 tr.53; 17.6 tr.55), M0, M1.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** matematika5
- **Loại sách mới:** chizmachilik8_darslik; Hình học lớp 6–9 (matematika5 có `sim.cuboid_volume`).
- **Mở khóa:** Phần lõi của Vẽ kỹ thuật (1/12 mẫu).
- **Nguồn đã nêu chỗ thiếu này:** chizmachilik8_darslik

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: cao
- Ưu tiên: P2
- Phụ thuộc: [005](005-renderer-mo-phong-toan.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 155 | chizmachilik8_darslik | sim | sim.construction_steps | Hoạt hình dựng hình bằng thước, êke, compa theo từng bước: đặt tâm, quay cung bán kính R, giao điểm 1, 2, nối đường; phân biệt nét phụ mảnh… |
| 157 | chizmachilik8_darslik | sim | sim.solid_projection_3d | Mô hình khối 3D xoay được (kéo để xoay, thu phóng) đặt trong hệ ba mặt phẳng H, V, W, có tia chiếu, bật/tắt từng hình chiếu, gập mặt H và W… |
| 166 | chizmachilik8_darslik | media | media_dac_thu[0] | hoạt hình dựng hình thước–compa theo bước (sinh bằng mã từ dãy thao tác, không cần quay video) |
| 167 | chizmachilik8_darslik | media | media_dac_thu[1] | mô hình 3D các khối và chi tiết trong 17–24§, 27–31§ (số lượng chưa đếm) có ba hình chiếu và hình trục đo |
