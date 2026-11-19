# 038 – Khối bài nghe không in (audiomatn) có điểm dừng câu hỏi

**Ưu tiên:** P1 · **Độ khó:** vừa · **Phụ thuộc:** [059](059-ban-quyen-media-rights.md), [061](061-nguon-goc-tu-nxb.md), [062](062-loai-media-moi.md) · **Số chỗ thiếu thô gộp vào:** 6

## Thay đổi gì
- `block.type = "listening"`: `{audio_ref, transcript?: i18n (ẩn tới khi làm xong), max_plays?: int, cues[{t, exercise_ref|prompt}], mode: "stop_and_ask|after"}`; bài tập gắn sau dùng `ex.*` có sẵn (T/N, chọn, điền phiếu).
- `media` hỗ trợ mốc thời gian câu hỏi (`cues`), không chỉ `sentence_audio`.
- Bộ mục mới `listening_task` (063).
- Trục 9: cờ `thieu_nguon_audio_goc` khi bài nghe chưa có tệp/chép lời; đầu đọc hiện "chưa có bản nghe" thay vì ẩn bài.

## Vì sao + bằng chứng
onatili3_darslik1 C0 (biểu tượng "audiomatnni tinglang" tr.2; tr.6 + 9 câu hỏi; tr.15–16 bảng T/N), M0 (12 bài nghe, không chép lời), R0; onatili3_metodika C4 ("1-usul … ba’zan to‘xtab … 2-usul … to‘liq" tr.8), M0; ingliz2_darslik C14 (biểu tượng CD, không số track tr.6, 45), ingliz2_daftar M0 + R2 (kịch bản nghe không in); alifbe1_darslik M2 (truyện "Tinglang" ở QR NXB); musiqa5 C6.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** ingliz2_darslik, ingliz2_daftar, onatili3_darslik1, onatili3_metodika, alifbe1_darslik ("Tinglang"), musiqa5 ("Tinglang").
- **Mở khóa:** 12 bài nghe onatili3 + các hoạt động CD của ingliz2.
- **Nguồn đã nêu chỗ thiếu này:** alifbe1_darslik, ingliz2_daftar, onatili3_darslik1, onatili3_metodika

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P1
- Phụ thuộc: [059](059-ban-quyen-media-rights.md), [061](061-nguon-goc-tu-nxb.md), [062](062-loai-media-moi.md)

## Cần người quyết
Khi NXB không cấp audio/chép lời: tự soạn và thu lại hay bỏ bài? Đề xuất: đánh dấu `thieu_nguon_audio_goc`, chờ 061; không tự soạn nội dung nghe thay sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 143 | alifbe1_darslik | media | media_dac_thu[2] | Audio truyện nghe 'Tinglang' (Oltin tarvuz, Ikki do‘st, Mitti quyon…) – hiện ở QR nhà xuất bản |
| 233 | ingliz2_daftar | media | media_dac_thu[0] | Audio bài nghe của Progress check và 'Listen and…' (giọng Anh bản ngữ; kịch bản không in trong vở) |
| 291 | onatili3_darslik1 | block | bai_nghe_audiomatn | Bài nghe (audiomatn) là văn bản KHÔNG in trên trang: HS nghe rồi trả lời câu hỏi/T-N/điền phiếu. Cần loại khối "listening" (audio + câu hỏi… |
| 303 | onatili3_darslik1 | media | media_dac_thu[0] | 12 bài nghe audiomatn (giọng đọc người, có thể có hội thoại) – không có trong PDF, không có chép lời |
| 318 | onatili3_metodika | media | audio_dung_hoi | Trình phát bài nghe có điểm dừng gắn câu hỏi: 'cách 1 – dừng giữa chừng hỏi câu ở tr.6; cách 2 – nghe hết rồi hỏi'; cho phép phát lại 1–2 l… |
| 324 | onatili3_metodika | media | media_dac_thu[0] | các audiomatn mà giáo án yêu cầu phát (không có chép lời trong sách GV) |
