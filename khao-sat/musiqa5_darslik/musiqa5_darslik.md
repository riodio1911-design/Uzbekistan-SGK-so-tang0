# musiqa5_darslik – Musiqa lớp 5 (trích trang in 28–82)

**Nổi bật:** nội dung chính nằm ngoài trang giấy: ~83 ô QR (40→122) dẫn tới bản thu và video biểu diễn. Có khoảng 10 bản nhạc khuông nhạc, có/không lời, có lời Karakalpak. Câu hỏi chủ yếu là cảm thụ. PDF là ảnh 100 ppi có watermark, không có lớp chữ, cần OCR.

**Tầng 0 thiếu:**
1. `block.type: music_score`: khuông nhạc MusicXML/ABC, phát được, tô sáng nốt và lời. Phải chép tay vì không nhận dạng nhạc được từ ảnh (tr. PDF 1, 19, 31, 45).
2. `media.music_recording` + `rights{}`: bản thu/video có số QR, metadata, bản quyền; nhà máy media không tự tạo được (tr. 2, 14, 36, 55).
3. `pin.kind: listen` + trình nghe danh sách theo chủ đề (tr. 4, 7, 8).
4. `ex.listen_identify` (nghe rồi chọn nhạc cụ/thể loại) và `ex.performance` (hát/múa theo nhạc đệm, ghi trực tiếp, GV chấm) (tr. 4, 7, 8, 55).
5. Bộ mục `listening_task`/`watching_task` và luật gia sư cho câu hỏi cảm thụ (AI không nghe được).

**Chế độ:** pin làm nền. Lớp "bài học" cần khối `music_score`. Nên thêm **chế độ nghe** (danh sách phát + bản nhạc chạy theo), dùng lại được cho Ingliz và Alifbe.

**Rủi ro:** bản quyền bản thu của nghệ sĩ còn sống. QR không giải mã được nên phải lấy danh sách từ NXB. Watermark. File chỉ là trích đoạn.
