# Báo cáo E. Thuật ngữ

**Đã làm.** Chạy script của 7 cuốn trong `vm` (DOM giả) để lấy dữ liệu thật, rồi tạo các file sau:
- `thuat-ngu.csv/.json`: 2701 thuật ngữ, lấy từ glossary, từ khoá, "Tayanch tushunchalar", chữ in đậm, hình khám phá, tên chương/bài.
- `rubric-bo-sach.json`: 39 khái niệm, gom từ 97 mục gốc.
- `cap-tuoi.md`, `README.md`.

**Tiêu chí "Xong khi": đạt.**
- 2701/2701 dòng có nguồn, không trùng id.
- Thuật ngữ trùng giữa các cuốn đã gộp, 27 dòng có nguồn từ ≥2 cuốn.
- 13 cặp cùng chữ uz nhưng khác nghĩa đã tách riêng.
- Độ phủ: uz 100 %, vi 100 %, ru 99,4 % (ở tabiiy5, ru của 127 mục lấy từ `RUDICT`), kaa 0 %.

**Cần quyết ở D2.**
1. Tên điểm hình (1302 dòng) giữ trong bảng chính hay tách thành "từ vựng hình"?
2. Tên chương/bài (228 dòng) có tính là thuật ngữ không?
3. Có duyệt bản dịch vi/ru trước khi dùng làm chuẩn không?
4. Trục 2 dùng bảng ánh xạ mở hay enum? (13/39 khái niệm chỉ có ở một cuốn.)
5. Có gộp `lesson_question` vào `think_prompt` không?

**Rủi ro.**
- Bảng nghiêng về Tin/Lý/Sinh; matematika5 chỉ có 42 dòng.
- Gộp/tách dựa vào trùng từ trong bản dịch. 27 dòng liên môn được đánh dấu `KIEM_TRA` (ví dụ *Kalit*).
- Dữ liệu cấp tuổi mới có 10–11 và 13–14.
