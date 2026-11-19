# Báo cáo bước ④ – adabiyot5

**Kết quả: ĐẠT tiêu chí "Xong khi".** `doi-chieu.json` có 50 dòng, tổng lệch 0.

**Số liệu (cũ = mới)**
- Cấu trúc: 98 trang, 4.187 dòng chữ, 10 đơn vị, 15 bài, 201 khối.
- Trên trang: 1.432 điểm chạm (anchors và ghim), 29 ghim quiz, 39 ghim phim tranh, 59 ô bảng, 14 ô dòng kẻ.
- Bài tập: 124 bài gồm 29 quiz (116 câu, 116 đáp án), 32 talk (143 câu), task text/table/none/record 19/18/5/1, think/pre 15, dòng kẻ 3, chỗ trống 2.
- Media: 39 phim tranh (1.063 cảnh); clip theo câu uz/vi/ru mỗi thứ tiếng 1.103; 139 tệp audio; ảnh pages/ và bg/ mỗi loại 98.
- Thuật ngữ: 56, id `term.*`.

**Tự chế (tu-che.md):** 9 mục nội dung, gồm 9 thể loại, 9 chú thích cảnh, 39 id neo, font in, tọa độ 581.11×822.05; và 7 mục đầu đọc thiếu.

**Kiểm tra**
- `_work/kiem-tra.py`: book/features hợp lệ schema 2020-12; ex.*/sim.* có trong thư viện; trục khớp từ điển; pins/fields/anchor hợp lệ; quy tắc D2 đạt.
- `_work/gia-su-thu.py`: 12 lời nhắc, 0 lỗi.
- Playwright `preview/chup.js`, 390×844: 5 ảnh, 0 lỗi console, không cuộn ngang.

**Rủi ro**
- Bài tập dùng id = bid cũ (`u2.1.8`), bền theo nghĩa khóa lưu cũ nhưng thực chất theo vị trí trong bài.
- Phim tranh chép câu vào videos[] (book.json 2,6 MB).
- Ghim text_anchor làm rối chế độ trang gốc.
- Publish cần 2 lần (335 tệp > 255).
