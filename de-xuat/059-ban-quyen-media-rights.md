# 059 – Trường bản quyền rights{} và cổng chặn xuất bản

**Ưu tiên:** P1 · **Độ khó:** thấp · **Phụ thuộc:** Không · **Số chỗ thiếu thô gộp vào:** 13

## Thay đổi gì
- `$defs/rights = {owner, license: own|publisher_granted|cc_by|cc_by_sa|public_domain|unknown, source, expires?, attribution?: i18n, note?}`; gắn vào `media.files[]`, `figure`, `block.image`, `media_override`, bản thu (052), bản đồ (045), tư liệu dịch (050).
- `kiem-tra.py`: chặn publish khi có tệp `license = unknown` thuộc loại bắt buộc (bản thu nhạc, video ngoài, ảnh chân dung nghệ sĩ còn sống, bản đồ nền); chỉ cảnh báo với ảnh trang sách gốc (đã có thỏa thuận chung).
- Trục 9: `ban_quyen_chua_ro`.
- Video GV tự gắn (`teacher.media_overrides`, informatika5/kimyo8/adabiyot5): GV xác nhận quyền khi tải lên.

## Vì sao + bằng chứng
musiqa5 C7 (Sevara Nazarxon tr.55; Avaz Rajabov tr.38; opera/ballet tr.14), R0, R4; alifbe1_darslik R1 (QR qr.nvdt.uz – audio bản quyền Novda), R2; alifbe1_daftar R3; ingliz2_darslik R2; geografiya7_darslik R0 ("Xaritalar … A. Ibraimova tahriri"), M4; tarix7_darslik R0, M3; tarix7_metodika R3; onatili3_darslik1 R1. Ở 7 cuốn: video GV thay qua `media_overrides` (informatika5 TC02, kimyo8 TC-C1, adabiyot5 DD-6) chưa có thông tin quyền.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** informatika5, kimyo8, adabiyot5
- **Loại sách mới:** musiqa5, alifbe1 ×2, ingliz2 ×2, geografiya7, tarix7 ×2, onatili3_darslik1 – mọi sách có ảnh/âm thanh bên thứ ba.
- **Mở khóa:** Điều kiện để publish musiqa5, alifbe1, ingliz2.
- **Nguồn đã nêu chỗ thiếu này:** alifbe1_daftar, alifbe1_darslik, geografiya7_darslik, ingliz2_darslik, musiqa5_darslik, onatili3_darslik1, tarix7_darslik, tarix7_metodika

## Tương thích ngược
Có. Trường tùy chọn; chặn chỉ áp cho loại bắt buộc.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P1
- Phụ thuộc: Không

## Cần người quyết
Danh sách loại tệp bắt buộc có `rights` trước khi publish, và ai ký xác nhận? Đề xuất: bản thu nhạc, video ngoài, bản đồ nền, ảnh người còn sống; người xác nhận là đầu mối NXB của nhóm.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 122 | alifbe1_daftar | ban_quyen | rui_ro[3] | Tranh nét bản quyền Novda; tô màu cần vector hóa tranh (công sức lớn, dễ lỗi vùng hở) |
| 149 | alifbe1_darslik | ban_quyen | rui_ro[1] | QR trỏ về qr.nvdt.uz (Novda Edutainment): audio thuộc bản quyền NXB, không được tải về tự dùng; phải thu âm lại hoặc xin phép |
| 150 | alifbe1_darslik | ban_quyen | rui_ro[2] | Tranh minh họa bản quyền Novda; chữ cái lớn vẽ thành tranh không tách được khỏi hình |
| 192 | geografiya7_darslik | media | media_dac_thu[4] | chân dung nhà thám hiểm (Ibn Battuta, Livingstone, Vasco da Gama – tranh lịch sử) |
| 195 | geografiya7_darslik | ban_quyen | rui_ro[0] | Bản quyền bản đồ: 'Xaritalar … A. Ibraimova tahriri ostida' (tr.2) – bản đồ nền dùng lại trong bản số/tách vector cần xác nhận quyền; thay … |
| 265 | ingliz2_darslik | ban_quyen | rui_ro[2] | Bản quyền audio/bài hát (có thể là bài hát dân gian Anh hoặc do British Council sản xuất) |
| 276 | musiqa5_darslik | ban_quyen | ban_quyen_ban_thu | Ràng buộc mới: bản thu và video biểu diễn có bản quyền (nhạc sĩ, người biểu diễn, hãng thu), nhất là nghệ sĩ còn sống. Cần cờ chặn xuất bản… |
| 286 | musiqa5_darslik | ban_quyen | rui_ro[0] | bản quyền bản thu và video, nhất là nghệ sĩ còn sống (Sevara Nazarxon, Ravshan Namozov, Avaz Rajabov); tác phẩm của nhạc sĩ (A. Mansurov, X… |
| 290 | musiqa5_darslik | ban_quyen | rui_ro[4] | ảnh chân dung nghệ sĩ có bản quyền ảnh riêng |
| 309 | onatili3_darslik1 | ban_quyen | rui_ro[1] | Ảnh minh họa và thơ/truyện của tác giả còn bản quyền (Xudoyberdi To‘xtaboyev, Anvar Obidjon, Po‘lat Mo‘min…); tr.90 tác phẩm thuộc dự án IA… |
| 348 | tarix7_darslik | media | media_dac_thu[3] | tranh lịch sử vẽ lại (trận đánh, triều đình) – nhiều tranh hiện đại có tác giả |
| 350 | tarix7_darslik | ban_quyen | rui_ro[0] | bản quyền tranh minh hoạ lịch sử và ảnh hiện vật (nhiều ảnh chụp bảo tàng, tranh hiện đại; ví dụ tr.4, 78) |
| 375 | tarix7_metodika | ban_quyen | rui_ro[3] | tư liệu dịch cổ (Beruniy, Ibn Havqal, Narshaxiy) có bản quyền người dịch/biên soạn hiện đại |
