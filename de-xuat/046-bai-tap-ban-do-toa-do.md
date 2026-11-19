# 046 – Bài tập trên bản đồ và tọa độ: map_locate, map_blank, coordinate_read, dung sai

**Ưu tiên:** P1 · **Độ khó:** vừa · **Phụ thuộc:** [045](045-ban-do.md) · **Số chỗ thiếu thô gộp vào:** 8

## Thay đổi gì
- `ex.map_locate`: cho tên/tọa độ → chạm/đặt ghim; chấm theo vùng (polygon) hoặc bán kính km. Dùng cho "xaritadan ko‘rsating", "điểm cực của lục địa", "thành phố đánh dấu đỏ".
- `ex.map_blank` (bản đồ câm, `yozuvsiz xarita`): ghi tên vào vị trí, tô vùng, vẽ ranh giới/đới; chấm theo vùng cho nhãn/tô, `giao_vien` cho vẽ tự do.
- `ex.coordinate_read`: đọc/ghi cặp (vĩ độ B/N, kinh độ Đ/T) và ngược lại.
- Trục 5 thêm `dung_sai_so_don_vi`: dung sai ±độ, ±km theo tỉ lệ, chuẩn hóa ký hiệu bán cầu (shimoliy/janubiy kenglik, sharqiy/g‘arbiy uzunlik ↔ N/S/E/W, "11° j.k.", "-11") và đơn vị (km, cm, 1:500 000) – bổ sung cho `accept_v2_math`.

## Vì sao + bằng chứng
geografiya7_darslik C3 (tr.18, 159), C4 ("yozuvsiz xarita" ở 13 trang; tr.13, 27), C2 (tr.18, 47, 168), C7 (tr.16, 18), M1; geografiya7_metodika C7 (tr.112: 5 hoang mạc, 5 núi…; 20 giáo án dùng bản đồ câm); tarix7_darslik C3 (tr.8, 86, 139, 65); tarix7_metodika M2 (bản đồ trống tr.76).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** geografiya7_darslik, geografiya7_metodika, tarix7_darslik, tarix7_metodika.
- **Nguồn đã nêu chỗ thiếu này:** geografiya7_darslik, geografiya7_metodika, tarix7_darslik, tarix7_metodika

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P1
- Phụ thuộc: [045](045-ban-do.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 177 | geografiya7_darslik | ex | ex.coordinate_read | Đọc/ghi tọa độ địa lý của điểm trên lưới độ (vĩ độ B/N, kinh độ Đ/T) và ngược lại; chấm tự động có dung sai độ, chấp nhận nhiều cách viết (… |
| 178 | geografiya7_darslik | ex | ex.map_locate | Cho tọa độ hoặc tên → người học chạm/đặt ghim đúng vị trí trên bản đồ; chấm theo vùng (polygon) hoặc bán kính km. Cũng dùng cho 'tìm trên b… |
| 179 | geografiya7_darslik | ex | ex.map_draw_on_blank | Bản đồ câm (yozuvsiz xarita / kontur): người học ghi tên, tô vùng, vẽ ranh giới/đới lên bản đồ trống theo atlas. ex.sketch chỉ vẽ tự do, kh… |
| 182 | geografiya7_darslik | truc | dung_sai_toa_do_khoang_cach | Chấm theo dung sai độ (±1°), theo km (tỉ lệ), theo vùng trên bản đồ; chuẩn hóa ký hiệu bán cầu (shimoliy/janubiy kenglik, sharqiy/g‘arbiy u… |
| 189 | geografiya7_darslik | media | media_dac_thu[1] | bản đồ câm / bản đồ sơ đồ đánh số |
| 208 | geografiya7_metodika | ex | ex.map_draw_on_blank | Như SHS: GV giao ghi tên lên bản đồ câm (5 hoang mạc, 5 núi, 3 đồng bằng, 5 biển, dòng biển Úc); 'yozuvsiz xarita' là phương tiện dạy học ở… |
| 336 | tarix7_darslik | ex | ex.map_locate | Bài trên bản đồ: chỉ/chạm vùng hay thành phố (xaritadan ko‘rsating), tô màu bản đồ trống (yozuvsiz xarita), so bản đồ lịch sử với bản đồ hi… |
| 370 | tarix7_metodika | media | media_dac_thu[2] | bản đồ trống cho bài nhóm (tr.76) |
