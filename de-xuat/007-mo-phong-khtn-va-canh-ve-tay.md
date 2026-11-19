# 007 – Mô phỏng KHTN tabiiy5/biologiya5 và 88 cảnh vẽ tay

**Ưu tiên:** P0 · **Độ khó:** cao · **Phụ thuộc:** Không · **Số chỗ thiếu thô gộp vào:** 4

## Thay đổi gì
Hai bước:
1. **Tạm (để thay được cuốn sớm):** thành phần `sim.legacy_embed` của đầu đọc chạy hàm cũ theo `params.code_ref` (sandbox, chữ lấy từ `params.text` đã đa ngữ). Hoặc ghi video bằng nhà máy media (`media.sim_recording_mp4`) cho 88 cảnh `sim.scene_custom_draw`.
2. **Chuẩn:** tách nốt số liệu (bảng RES, tọa độ, ngưỡng) ra `params` rồi viết renderer cho 24 kind: 22 kind tabiiy5 (`germination_lab` … `satellite_uses`, 26 bản), `sim.predict_check`, `sim.virtual_microscope` (biologiya5). Cảnh vẽ tay chuyển sang JSON/SVG theo khung (D2 M2).

## Vì sao + bằng chứng
tabiiy5 TC01 (27 mô phỏng, logic còn ở `ACT.*`), TC02 (88/136 cảnh `draw(p,s,L)`), "Đầu đọc thiếu" (22 kind). biologiya5 TC02 (2 mô phỏng). `components/sim/scene_custom_draw.js` hiện chỉ vẽ "khung thay thế trung thực".

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** tabiiy5, biologiya5
- **Loại sách mới:** KHTN/Sinh/Địa lớp 4–7 (germination, seasons, earth_orbit dùng lại cho đề xuất 045).
- **Mở khóa:** 28 mô phỏng tương tác + 88 cảnh.
- **Nguồn đã nêu chỗ thiếu này:** biologiya5, tabiiy5

## Tương thích ngược
Có. `code_ref` giữ nguyên; bước 2 thay `params` bằng bản đầy đủ hơn, không xóa trường cũ.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: cao
- Ưu tiên: P0
- Phụ thuộc: Không

## Cần người quyết
Có chấp nhận chạy mã cũ (`sim.legacy_embed`) hoặc video ghi sẵn để thay tabiiy5 trước khi có renderer chuẩn không? Đề xuất: có, gắn cờ trục 9 mới `ma_cu_nhung_tam`, hạn gỡ ở đợt 2.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 26 | tabiiy5 | sim | TC01 logic mô phỏng còn trong mã | 26 ACT + 1 WB sim: params chỉ có chữ, logic vẽ ở code_ref |
| 27 | tabiiy5 | sim | TC02 cảnh vẽ tay draw(p,s,L) | Cảnh video vẽ bằng hàm, gán sim.scene_custom_draw + code_ref |
| 37 | tabiiy5 | dau_doc_renderer | 22 kind mô phỏng | germination_lab … satellite_uses không có renderer |
| 45 | biologiya5 | dau_doc_renderer | TC02c sim.predict_check, sim.virtual_microscope | Hai mô phỏng chưa có renderer |
