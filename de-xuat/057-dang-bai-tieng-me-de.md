# 057 – Dạng bài tiếng mẹ đẻ: chọn từ trong văn bản, sửa lỗi, chữ cái, viết có khung, tốc độ đọc

**Ưu tiên:** P1 · **Độ khó:** vừa · **Phụ thuộc:** [003](003-renderer-16-dang-bai-con-lai.md) · **Số chỗ thiếu thô gộp vào:** 6

## Thay đổi gì
Thêm vào thư viện bài tập:
- `ex.select_in_text`: chạm chọn/gắn nhãn TỪ ngay trong câu/đoạn (từ có x/h, -lar, qo‘sh undosh; câu hỏi ngữ pháp kim?/nima?/nima qildi? cho từ gạch; ega/kesim). Chấm tự động theo tập từ đúng.
- `ex.proofread`: đoạn có từ sai; chạm từ sai và gõ dạng đúng, hoặc chép lại cả đoạn; chấm từng từ, kèm ghi chú quy tắc.
- `ex.letter_tiles`: xếp chữ bị đảo thành từ (fraiak → Afrika), chạm khe chia âm tiết (te-le-skop), chỉ cụm phụ âm.
- `ex.word_from_letters`: lập từ từ chữ cho sẵn, đáp án MỞ, chấm theo từ điển từ hợp lệ uz (`tri-thuc/tu-dien-uz.json` – mới) + đếm số từ.
- `ex.guided_writing`: viết thư/truyện với danh sách mục bắt buộc + câu mở gợi ý; AI/GV nhận xét theo từng mục; vòng "GV đánh dấu lỗi → HS viết lại".
- `ex.reading_fluency`: đo số từ/phút trên một đoạn (ghi âm 040 hoặc HS tự bấm giờ).
(Học thuộc thơ = `ex.oral_recording` mode `recite`, xem 040.)

## Vì sao + bằng chứng
onatili3_darslik1 C1 (tr.19, 109, 135), C2 (okeyan, foyizi… tr.52; tr.136), C3 (v-u-n-d-e-r-k-i-n-d tr.16; daumroya tr.33), C7 (thư 4 mục tr.22, 52; viết lại tr.99), C10 ("bir daqiqada nechta so‘z" tr.15–16); alifbe1_daftar C6 ("bilimdonlik" tr.29; O T A N I L tr.17; tr.43). adabiyot5 có `ex.open_response` cho viết tự do, chưa có khung mục.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** adabiyot5
- **Loại sách mới:** onatili3_darslik1, onatili3_metodika, alifbe1_daftar; tiếng Nga/Karakalpak như tiếng mẹ đẻ.
- **Mở khóa:** Phần lớn bài của onatili3_darslik1.
- **Nguồn đã nêu chỗ thiếu này:** alifbe1_daftar, onatili3_darslik1

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P1
- Phụ thuộc: [003](003-renderer-16-dang-bai-con-lai.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 110 | alifbe1_daftar | ex | ex.word_from_letters | Lập từ từ các chữ/âm tiết cho sẵn với đáp án MỞ (bất kỳ từ có nghĩa): 'bilimdonlik' → từ mới; ghép chữ O T A N I L. Cần chấm theo từ điển t… |
| 292 | onatili3_darslik1 | ex | ex.word_select_in_text | Chạm chọn/gắn nhãn TỪ ngay trong câu/đoạn văn: tìm từ có chữ x/h, từ có -lar, từ qo‘sh undosh; đặt câu hỏi ngữ pháp (kim? nima? qanday? nim… |
| 293 | onatili3_darslik1 | ex | ex.proofread_text | Sửa lỗi chính tả trong đoạn văn: đoạn có từ sai (có/không tô đậm), HS chạm từ sai và gõ dạng đúng hoặc chép lại cả đoạn không lỗi; chấm the… |
| 294 | onatili3_darslik1 | ex | ex.letter_tiles | Thao tác trên CHỮ CÁI/ÂM TIẾT: (a) xếp lại chữ cái bị đảo thành từ (fraiak → Afrika), (b) chia từ thành âm tiết (te-le-skop) bằng chạm khe … |
| 298 | onatili3_darslik1 | ex | ex.guided_writing | Viết có khung: thư/truyện/đoạn văn với danh sách mục bắt buộc (mở thư, lý do, câu hỏi, kết thư; hoặc mở bài–nhân vật–sự việc–kết) + câu mở … |
| 301 | onatili3_darslik1 | ex | ex.reading_fluency | Đo tốc độ đọc (số từ/phút) trên một đoạn văn – chuẩn kỹ năng đọc tiểu học. |
