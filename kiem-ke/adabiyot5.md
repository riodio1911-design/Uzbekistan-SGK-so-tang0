# Kiểm kê: Adabiyot 5 (Văn học lớp 5, Phần I)

**Bộ máy:** lai A+B+C. Có 2 chế độ hiển thị. Chế độ `html` (mặc định) dựng lại 98 trang: ảnh nền đã xoá chữ (`bg/`), trên đó vẽ lại chữ bằng SVG lấy từ `LN_` (lấy từ PDF), nối với 1432 điểm chạm `HOT`. Chế độ `adapt` là cột đọc chuyển thể theo khối (`DATA.units[].blocks`, 201 khối, 10 đơn vị).

**Đặc trưng nhất:**
- Văn bản 3 thứ tiếng đặt dòng dưới dòng (716 câu uz/vi/ru). Audio TTS đọc theo từng câu cho cả 3 thứ tiếng: tệp audio gộp được cắt theo mốc thời gian trong `SPR`, phát bằng Web Audio.
- Trên trang in có ghim: ô bảng (`GEO.tbl`), textarea phủ lên dòng kẻ (`GEO.wl`), chỗ trống `– …` điền thẳng trên trang, cùng ghim quiz và ghim phim tranh.
- "Phim tranh": ghép tranh cắt từ trang với phụ đề và audio. Giáo viên có thể thay bằng link hoặc video tải lên (`assets`).
- Gia sư Oqilbek (`sample`, đọc `BOOK_PROFILE`) nhận xét 143 câu thảo luận và 19 bài tự luận, và có khung chat. 116 câu trắc nghiệm do người làm thêm (gắn nhãn "không có trong sách"), chấm tự động. Giáo viên sửa được qua db `quiz`.

**Nên đưa vào tầng 0:** mô hình câu `{uz,vi,ru,f,a,na}` + `SPR`; trình phát theo câu (`playClip/playList`); bộ dựng trang `svgFor`+`pinsFor`+`GEO`; `crop()`; `story()`; gia sư `feedback/chat`; ghi đè giáo viên `applyOvr/commit` (lưu vào db, không có db thì lưu localStorage); sổ từ `setGloss/glossify`; bảng UI 3 thứ tiếng + `rub()`.

**Rủi ro:**
- Tổng file đi kèm khoảng 219 MB (ước tính), gần mức 256 MB/phiên bản. Trong đó 158 file `audio/*.mp3` ở thư mục gốc (~45 MB) mã không dùng tới, có thể xoá.
- Bài làm chỉ lưu trong localStorage, giáo viên không thu được.
- Mã gọi `use('user')` nhưng khai báo khi xuất bản không có `user`, nên chế độ giáo viên có thể không bật được (không chắc).
- Mã thừa: nhánh `draw`, nhánh trang ảnh + hotspot gần như không vào được, khóa UI `unitsel`/`works`/`voice` không dùng, cờ `window.__TEACH`.
- Giọng đọc là giọng máy, bản dịch chưa qua người bản ngữ duyệt.
