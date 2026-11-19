# alifbe1_darslik – Alifbe lớp 1 (Novda 2026)

**Đặc tính nổi bật:** đây là cuốn đầu tiên mà người học **chưa đọc được chữ**. Nội dung xoay quanh âm và chữ: mỗi chữ học trong 2 trang, có sơ đồ âm (ô đỏ cho nguyên âm, ô xanh cho phụ âm, vạch chia âm tiết), bảng âm tiết, văn bản in tách âm tiết ("Ma-di-na gul-lar-ni") và dải chữ đã học đầy dần ở lề. Trong bản in có 28 mã QR trỏ về audio của nhà xuất bản. PDF là bản mẫu, có lớp chữ, gồm 56/88 trang và dừng ở chữ G.

**Năm chỗ tầng 0 thiếu quan trọng nhất:**
1. `pre_reader_mode`: mọi lời dặn và mọi ghim đều phải có tiếng và tự phát. Giao diện chỉ dùng biểu tượng và tranh. Trẻ trả lời bằng chạm hoặc giọng nói, không phải gõ.
2. `media.phoneme_audio`: âm vị tách rời, âm tiết và từ, đọc bằng giọng người uz. Không dùng TTS được.
3. Block `sound_scheme` và `ex.sound_scheme`, `ex.syllable_split`, `ex.sentence_scheme`.
4. `letter_progress_strip`: trạng thái "chữ đã học" cho cả cuốn. Nó vẽ dải chữ và giới hạn bài luyện cùng gia sư trong các chữ đã học.
5. Luật gia sư 0-2 cho trẻ tiền đọc: chỉ nói, phân biệt tovush với harf, dùng chữ đã học, có lời dặn cho phụ huynh. Kèm `ex.oral_pronunciation`: ghi âm bằng micro, giáo viên chấm.

**Chế độ:** dùng trang gốc + ghim làm nền, bật thêm **chế độ mới "tiền đọc" (pre_reader)**. Lớp reading cần mở rộng thành `doc_theo_am_tiet` (tô sáng theo âm tiết). Chế độ lesson không cần thiết.

**Rủi ro:** bản quyền audio và tranh của Novda (qr.nvdt.uz). Thiếu giọng TTS uz. Nhận dạng giọng trẻ em uz chưa tin được.
