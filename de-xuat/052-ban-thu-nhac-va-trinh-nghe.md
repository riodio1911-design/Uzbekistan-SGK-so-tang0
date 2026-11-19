# 052 – media.music_recording, ghim "nghe" và trình phát danh sách

**Ưu tiên:** P2 · **Độ khó:** vừa · **Phụ thuộc:** [059](059-ban-quyen-media-rights.md), [060](060-qr-va-lien-ket-ngoai.md), [061](061-nguon-goc-tu-nxb.md) · **Số chỗ thiếu thô gộp vào:** 5

## Thay đổi gì
- Nhà máy media: loại `media.music_recording` (không sinh bằng TTS; nhập tệp có giấy phép): metadata `{work, composer, lyricist, performer, instruments[], genre, qr_no, rights}`; và `media.instrument_sample` (mẫu âm sắc từng nhạc cụ để chạm nghe trên bảng hình).
- `pin.kind = "listen"`: một ô có thể có nhiều bản thu, giữ số thứ tự gốc theo QR (40→122); trình nghe theo chủ đề (danh sách, tua, lặp đoạn, tốc độ). `pin.kind = "audio"` hiện chỉ dành cho thuyết minh.
- Video trích đoạn opera/ballet: `media.external_video` hoặc tệp có giấy phép (060).

## Vì sao + bằng chứng
musiqa5 C2 (QR 40–42 tr.2; 56–59 opera/ballet tr.14; 95–98 sato, dutor tr.36; 121–122 tr.55), C3 (4 ô QR cạnh nhau tr.7; 3 ô tr.8, tr.4), M0 (≈83 bản thu), M1, M2.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** musiqa5_darslik; alifbe1 (âm thanh môi trường), ingliz2 (bài hát).
- **Mở khóa:** ≈83 bản thu của đoạn trích musiqa5.
- **Nguồn đã nêu chỗ thiếu này:** musiqa5_darslik

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P2
- Phụ thuộc: [059](059-ban-quyen-media-rights.md), [060](060-qr-va-lien-ket-ngoai.md), [061](061-nguon-goc-tu-nxb.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 271 | musiqa5_darslik | media | media.music_recording | Loại media mới: bản thu tác phẩm (dân ca, nhạc không lời, aria, ca khúc), có số thứ tự gốc theo QR (40→122), metadata tác phẩm/nhạc sĩ/lời/… |
| 272 | musiqa5_darslik | che_do_doc | pin.kind=listen + trình phát danh sách bản thu | Ghim 'nghe' thay ô QR trên trang ảnh: một ô có thể có nhiều bản thu, có số thứ tự gốc; trình nghe theo chủ đề (danh sách phát, tua, lặp đoạ… |
| 281 | musiqa5_darslik | media | media_dac_thu[0] | khoảng 83 bản thu nghe/xem theo QR (số 40→122 trong đoạn trích): dân ca không lời, nhạc cụ dân tộc (sato, dutor có tên ở trang PDF 36; hình… |
| 282 | musiqa5_darslik | media | media_dac_thu[1] | video trích đoạn opera/ballet Uzbekistan (QR 56–59) |
| 283 | musiqa5_darslik | media | media_dac_thu[2] | mẫu âm sắc từng nhạc cụ để chạm nghe trên bảng hình (trang PDF 7, 8) |
