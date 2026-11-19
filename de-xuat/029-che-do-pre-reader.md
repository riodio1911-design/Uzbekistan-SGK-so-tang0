# 029 – Chế độ người học chưa biết đọc (pre_reader)

**Ưu tiên:** P1 · **Độ khó:** cao · **Phụ thuộc:** [030](030-khoi-am-chu.md), [034](034-cach-nhap-cho-tre-chua-go.md), [035](035-luat-gia-su-0-2.md), [062](062-loai-media-moi.md) · **Số chỗ thiếu thô gộp vào:** 6

## Thay đổi gì
- `features.layers.tien_doc` (bật mặc định khi `grade_band = 0-2` và môn là alifbe): mọi lời dặn bài, tên tranh, nút đều có audio, tự phát khi mở/chạm; giao diện chỉ dùng biểu tượng + tranh, không nút chữ; phản hồi đúng/sai bằng âm và hình (`media.sfx`).
- Biểu tượng bộ mục là cách duy nhất nhận biết loại việc: `rubric-bo-sach.json` thêm `icon` và `audio_label` cho từng khái niệm.
- Kiểm tra mới trong `kiem-tra.py`: với `tien_doc`, mọi `prompt`/`ui_strings` phải có `audio_ref` (`media.exercise_prompt_audio` đã có trong nhà máy).
- Trục 6: `doc_to_moi_loi_dan`; trục 9: `can_nguoi_lon_di_kem` khi còn chuỗi không audio.

## Vì sao + bằng chứng
alifbe1_darslik C0 (10 biểu tượng bộ mục tr.3; lời dặn "Rasmlarni nomlang…" tr.10 là chữ in, trẻ tiết 2 chưa biết chữ nào), M5, R5 ("nếu còn bất kỳ nút/hướng dẫn chỉ bằng chữ thì bản số không dùng được nếu thiếu người lớn"); alifbe1_daftar C10 (tr.34: lời dặn 2 câu), M2; ingliz2_darslik M4 (audio chỉ dẫn uz).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** alifbe1_darslik, alifbe1_daftar; phần đầu ingliz2 (trẻ chưa đọc thạo chỉ dẫn uz).
- **Mở khóa:** Loại sách lớp 1 (alifbe), 2/12 mẫu.
- **Nguồn đã nêu chỗ thiếu này:** alifbe1_daftar, alifbe1_darslik, ingliz2_darslik

## Tương thích ngược
Có. Lớp mới.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: cao
- Ưu tiên: P1
- Phụ thuộc: [030](030-khoi-am-chu.md), [034](034-cach-nhap-cho-tre-chua-go.md), [035](035-luat-gia-su-0-2.md), [062](062-loai-media-moi.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 114 | alifbe1_daftar | che_do_doc | pre_reader_mode | Như alifbe1_darslik: mọi lời dặn trong vở là câu chữ in dài ('Barcha N harflarini … bilan o‘chiring. So‘ng qolgan harflardan so‘z tuzib yoz… |
| 117 | alifbe1_daftar | media | media_dac_thu[2] | Audio đọc lời dặn bài, tên tranh, chữ/âm khi chạm phím (dùng chung media.phoneme_audio của sách) |
| 125 | alifbe1_darslik | che_do_doc | pre_reader_mode | Chế độ cho người CHƯA biết đọc: mọi lời dặn của bài (dòng chữ cạnh biểu tượng bộ mục) phải tự phát thành tiếng khi mở/chạm; giao diện chỉ d… |
| 146 | alifbe1_darslik | media | media_dac_thu[5] | Lời dặn bài tập bằng giọng nói cho MỌI ô bài (không có lời dặn nào chỉ ở dạng chữ) |
| 153 | alifbe1_darslik | quy_trinh | rui_ro[5] | Trẻ chưa biết đọc: nếu còn bất kỳ nút/hướng dẫn chỉ bằng chữ thì bản số không dùng được nếu thiếu người lớn |
| 262 | ingliz2_darslik | media | media_dac_thu[4] | Audio chỉ dẫn uz cho trẻ chưa đọc thạo |
