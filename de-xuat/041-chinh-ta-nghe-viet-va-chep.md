# 041 – Chính tả nghe – viết, chép lại, chính tả tranh

**Ưu tiên:** P2 · **Độ khó:** vừa · **Phụ thuộc:** [034](034-cach-nhap-cho-tre-chua-go.md), [062](062-loai-media-moi.md) · **Số chỗ thiếu thô gộp vào:** 5

## Thay đổi gì
- `ex.dictation`: `{mode: "listen_write|copy|picture", items[{audio_ref?, text, image?}]}`.
  - `listen_write`: máy đọc từ/câu (audio người hoặc TTS đã duyệt), ẩn chữ, HS viết/gõ; chấm so ký tự có tô lỗi (dấu câu, chữ hoa, o‘/g‘).
  - `copy`: chép từ sách vào ô; chấm như trên.
  - `picture`: nghe rồi chọn/vẽ tranh ("Silent picture dictation") → chấm theo lựa chọn hoặc GV.
- Dùng `accept_v2` nhưng bật chế độ nghiêm (không bỏ qua dấu câu) cho `copy`.

## Vì sao + bằng chứng
ingliz2_daftar C5 ("Spelling dictation. Harflab yozish diktanti" tr.14, 16, 20, 24, 30), M1; ingliz2_darslik C16 (tr.45, 81, 84); onatili3_darslik1 C4 (13 trang "ko‘chirib yozing"; tr.22, 50, 59 đặt dấu câu), M2 ("TTS uz phải đúng o‘/g‘, x/h").

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** ingliz2_daftar, ingliz2_darslik, onatili3_darslik1.
- **Nguồn đã nêu chỗ thiếu này:** ingliz2_daftar, ingliz2_darslik, onatili3_darslik1

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P2
- Phụ thuộc: [034](034-cach-nhap-cho-tre-chua-go.md), [062](062-loai-media-moi.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 226 | ingliz2_daftar | ex | spelling_dictation | Chính tả: giáo viên/máy đọc từ tiếng Anh, trẻ viết vào ô. Bản số: audio từng từ (giọng bản ngữ) + ô viết tay/gõ, chấm so khớp chính tả. |
| 234 | ingliz2_daftar | media | media_dac_thu[1] | Audio đọc từ cho Spelling dictation |
| 257 | ingliz2_darslik | ex | ex.picture_dictation | Chính tả tranh: nghe từ/câu rồi vẽ hoặc chọn tranh ('Silent picture dictation', 'Picture dictation', 'Running dictation'). |
| 295 | onatili3_darslik1 | ex | ex.copy_dictation | Chép/chính tả: (a) chép lại câu/từ từ sách vào ô (so ký tự, tô lỗi chính tả, coi trọng dấu câu và chữ hoa); (b) chính tả nghe – máy đọc (TT… |
| 305 | onatili3_darslik1 | media | media_dac_thu[2] | giọng đọc chính tả từng từ/câu cho bài chép chính tả (TTS uz phải đúng o‘/g‘, x/h) |
