# Đối đẳng kimyo8: bản cũ và bản mới

So 54 tính năng/engine của bản cũ: **19 ngang · 14 kém · 18 thiếu · 3 hơn**. Đã bấm thử thật cả hai bản bằng Playwright ở 390 và 1280 px. Có 180 ảnh trong `_anh/`, số đo trong `do.json`. AI được giả lập giống nhau ở hai bản.

## Ba điểm người dùng nêu
- **Robo: thiếu.** Bản mới không có nhân vật Robo, lời chào, chat, đố nhanh, nhiệm vụ hay nhắc hạn. Chat chỉ mở được ở chế độ bài học, mà kimyo8 không có chế độ này. Chỉ phần gợi ý AI trong bài tập là ngang.
- **Tiếng Việt: dữ liệu đủ nhưng dùng kém.** Mở lên mặc định là tiếng Uzbek. Bong bóng, phụ đề và nhãn hình chỉ hiện một thứ tiếng, mất dòng uz gốc. Không có VI+RU. Ở mặc định, video không có thuyết minh tiếng Việt.
- **Engine: gần ngang.** Cả 19 loại cảnh video đều chạy được, không có khung "chưa hỗ trợ". cShell đơn giản hơn bản cũ. Trình phát kém hơn: không tự chạy, không có nút tắt tiếng.

## 10 chênh lệch nặng nhất
1. Không có nhân vật Robo (P0).
2. Không có chat AI theo trang (P0).
3. Mặc định uz (P0).
4. Không có MP3 tiếng Việt ở mặc định (P0).
5. Bong bóng mất dòng uz (P0).
6. Kết quả cũ không chuyển sang được vì khác URL (P0).
7. Thiếu đố nhanh, nhiệm vụ, nhắc hạn (P1).
8. Không có song ngữ, phụ đề chỉ một thứ tiếng (P1).
9. Thiếu mục lục chương, ảnh thu nhỏ, OCR tiếng Nga (P1).
10. Công cụ thay video của giáo viên và trình phát kém hơn (P1).

## Bản mới hơn bản cũ
Giao bài và xem kết quả cả lớp. Kéo thả trong bài sắp thứ tự. Phóng to trang, nút Aa, nghe bong bóng. Giao diện tiếng Việt trọn vẹn.

Nguyên nhân chính: đầu đọc thiếu renderer, các cờ `features` đã bật nhưng không được đọc, phép đo cũ chỉ đếm dữ liệu.

## Tiêu chí nghiệm thu "đối đẳng"
1. Lập danh mục từ mã chạy của bản cũ, không lập từ schema.
2. Mỗi dòng có ảnh và thao tác ở cả hai bản. Chỉ tính "ngang" khi bản mới cần số bước ≤ bản cũ.
3. Mỗi cờ `features` đang bật phải có một phép thử.
4. Thử ở thiết lập mặc định theo `reader_langs`.
5. Chặn thay bản nếu còn P0, còn mục "thiếu" ở nhóm robo/ngôn ngữ, hoặc kém + thiếu > 10 %.
6. Kết quả học sinh và video của giáo viên phải chuyển được sang URL mới.
