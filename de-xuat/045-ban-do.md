# 045 – Bản đồ: khối bản đồ nhiều lớp, sim.map_view, bản đồ lịch sử theo thời gian, địa danh đa ngữ

**Ưu tiên:** P1 · **Độ khó:** cao · **Phụ thuộc:** [059](059-ban-quyen-media-rights.md), [061](061-nguon-goc-tu-nxb.md) · **Số chỗ thiếu thô gộp vào:** 15

## Thay đổi gì
- `block.type = "map"` / `figure.kind = "map"`: nền vector nhiều lớp `layers[{id, title, kind: relief|climate|minerals|zones|route|territory|labels, src}]`, chú giải ("SHARTLI BELGILAR") chạm được, lưới kinh–vĩ, tỉ lệ (số/chữ/thước).
- `sim.map_view`: phóng/kéo, bật/tắt lớp, chạm ký hiệu để tô sáng, tọa độ dưới con trỏ, thước đo theo tỉ lệ.
- `sim.historical_map_time`: thanh trượt thế kỷ, lãnh thổ các triều đại hiện/ẩn, so biên giới hiện đại (Turk xoqonligi → Somoniylar → Qoraxoniylar → Xorazmshohlar).
- `tang0/tri-thuc/dia-danh.json`: địa danh `place.<slug>` đa ngữ (uz Latin ↔ ru ↔ vi ↔ tên quốc tế), dùng cho nhãn bản đồ và gia sư.
- Mở rộng (P2): `sim.seasons`/`sim.earth_orbit` (đã có, tabiiy5) thêm chế độ "chọn điểm → ngày Mặt Trời ở thiên đỉnh" và lưới độ trên địa cầu; ảnh vệ tinh làm dữ liệu bài.
- Media: bản đồ vector (Natural Earth hoặc bản NXB có giấy phép).

## Vì sao + bằng chứng
geografiya7_darslik C0 (bản đồ thế giới + tuyến Kolumb tr.12; đới khí hậu tr.29; châu Phi tr.50), C1 (thước tỉ lệ tr.16; đọc tọa độ tr.18; 20 ký hiệu khoáng sản tr.53), C9 (ảnh vệ tinh tr.74), C10 (tr.74), C11 (~150 nhãn tr.53), M0, M3, M6, R1 (Nam Cực "(Brit.)", "(Ros. Fed.)" tr.111); tarix7_darslik C2 (tr.25, 88, 129; 20 trang bản đồ), C10 (4 bản đồ cùng vùng các thời điểm; "Zamonaviy xarita bilan taqqoslang" tr.87), M0, R1; geografiya7_metodika M0; onatili3_darslik1 M4.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** tabiiy5
- **Loại sách mới:** geografiya7_darslik, geografiya7_metodika, tarix7_darslik, tarix7_metodika; onatili3_darslik1 (bản đồ Uzbekistan tr.31–32).
- **Mở khóa:** Địa lý và Sử (4/12 mẫu).
- **Nguồn đã nêu chỗ thiếu này:** geografiya7_darslik, geografiya7_metodika, onatili3_darslik1, tarix7_darslik

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: cao
- Ưu tiên: P1
- Phụ thuộc: [059](059-ban-quyen-media-rights.md), [061](061-nguon-goc-tu-nxb.md)

## Cần người quyết
Nguồn bản đồ nền: xin bản NXB (A. Ibraimova tahriri) hay dùng bản đồ mở (lệch ký hiệu so với bản in)? Ranh giới nhạy cảm theo chuẩn nào? Đề xuất: xin NXB; nếu không, bản đồ mở + ghi chú "không phải bản in"; ranh giới theo bản đồ chính thức của Uzbekistan.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 175 | geografiya7_darslik | block | ban_do | Bản đồ địa lý là một loại nội dung riêng: bản đồ tự nhiên, chuyên đề (khí hậu, khoáng sản, đới tự nhiên), sơ đồ hành trình nhà thám hiểm, c… |
| 176 | geografiya7_darslik | sim | ban_do_tuong_tac | Trình xem bản đồ: phóng/kéo, bật/tắt lớp (độ cao, khí hậu, khoáng sản, tuyến hành trình), chạm ký hiệu chú giải để tô sáng, hiện tọa độ kin… |
| 184 | geografiya7_darslik | media | anh_ve_tinh | Ảnh vệ tinh Trái Đất và ảnh vùng tự nhiên dùng làm dữ liệu bài tập (xác định mùa theo ranh giới sáng–tối). |
| 185 | geografiya7_darslik | sim | sim.globe_sun_angle | Địa cầu 3D + góc chiếu Mặt Trời theo ngày (chí tuyến, xuân/thu phân) – sim.seasons/sim.earth_orbit đã gần, cần thêm chế độ 'chọn điểm → ngà… |
| 186 | geografiya7_darslik | schema | ten_dia_danh_da_ngu | Bộ địa danh đa ngữ (uz Latin ↔ ru ↔ vi ↔ tên quốc tế), ví dụ 'Sahroi Kabir' = Sahara, 'Nyu York', 'Kanberra', 'Hamdo‘stlik dengizi'. Bản đồ… |
| 188 | geografiya7_darslik | media | media_dac_thu[0] | bản đồ vector nhiều lớp (tự nhiên, khí hậu, khoáng sản, đới tự nhiên, hành trình thám hiểm) |
| 191 | geografiya7_darslik | media | media_dac_thu[3] | ảnh vệ tinh |
| 194 | geografiya7_darslik | media | media_dac_thu[6] | có thể thêm: địa cầu 3D, hoạt hình hành trình |
| 196 | geografiya7_darslik | quy_trinh | rui_ro[1] | Ranh giới chính trị/địa danh nhạy cảm (Nam Cực có ghi chú trạm theo nước: '(Brit.)', '(Ros. Fed.)' tr.111). |
| 211 | geografiya7_metodika | media | media_dac_thu[0] | bản đồ (in lại từ SHS, nền trang trí lề là bản đồ) |
| 307 | onatili3_darslik1 | media | media_dac_thu[4] | bản đồ (Mustaqillik maydoni tr.6 qua QR, bản đồ Uzbekistan tr.31–32) |
| 335 | tarix7_darslik | media | ban_do_lich_su | Bản đồ lịch sử: lãnh thổ một nhà nước/triều đại ở một thời điểm, có thủ đô, thành phố, vùng, biển, ranh giới chia đôi (Tây/Đông Turk xoqonl… |
| 343 | tarix7_darslik | sim | sim.historical_map_time | Mô phỏng bản đồ theo thời gian: thanh trượt thế kỷ, lãnh thổ các triều đại hiện/ẩn, so với biên giới hiện đại. Dùng chung các bản đồ của cả… |
| 345 | tarix7_darslik | media | media_dac_thu[0] | bản đồ lịch sử (vector để có lớp vùng, chạm được) |
| 351 | tarix7_darslik | quy_trinh | rui_ro[1] | bản đồ lịch sử: ranh giới là diễn giải, nhạy cảm chính trị khi so với biên giới hiện đại |
