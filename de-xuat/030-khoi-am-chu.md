# 030 – Khối âm – chữ: sơ đồ âm, dải chữ đã học, bảng chạm nghe, rebus

**Ưu tiên:** P1 · **Độ khó:** vừa · **Phụ thuộc:** [062](062-loai-media-moi.md) · **Số chỗ thiếu thô gộp vào:** 8

## Thay đổi gì
- `block.type = "sound_scheme"`: `{word, sounds[{ph, kind: unli|undosh, highlight?}], syllable_breaks[]}` – ô đỏ nguyên âm, ô xanh phụ âm, vạch chia âm tiết.
- `book.alphabet_sequence[]` + `lesson.introduces_letters[]` → dải "chữ đã học" ở lề, và giới hạn từ được dùng trong gia sư/bài tập (035).
- `block.type = "tap_grid"`: bảng chữ/âm tiết/từ, mỗi ô chạm là nghe (`audio_ref`), có chế độ "nghe – chạm ô đúng" chấm tự động; mũi tên hướng đọc.
- Token ảnh nội dòng trong `i18n`: `[[img:<asset>|<từ>]]` (rebus) có audio của từ được thay.
- Loại media mới `media.phoneme_audio` (âm tách rời, tên chữ, âm tiết, từ – giọng người).

## Vì sao + bằng chứng
alifbe1_darslik C1 (chú giải ô đỏ/xanh/vạch tr.3; sơ đồ "anjir", "banan" tr.13; tr.14–15), C4 (dải chữ tr.16→56), C15 (bảng "O o O" có mũi tên tr.15; bảng âm tiết tr.22, 46), C11 (rebus tr.28, 18, 22), C5 + M0–M1 + R3 ("TTS uz đọc sai âm vị tách rời"); alifbe1_daftar C8.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** alifbe1_darslik, alifbe1_daftar; ingliz2 (bảng chữ ABC, Parent's corner).
- **Mở khóa:** Phần lõi của sách tập đọc lớp 1.
- **Nguồn đã nêu chỗ thiếu này:** alifbe1_daftar, alifbe1_darslik

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P1
- Phụ thuộc: [062](062-loai-media-moi.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 112 | alifbe1_daftar | ex | ex.sound_scheme | Như ở sách giáo khoa: chọn từ/tranh khớp sơ đồ âm tiết, tô ô âm đầu đúng màu, đếm âm tiết bằng cách tô số ngôi sao. Dùng chung đề xuất bloc… |
| 126 | alifbe1_darslik | block | sound_scheme | Sơ đồ âm của từ (tovush chizmasi): hàng ô vuông, mỗi ô một ÂM (không phải một chữ), ô đỏ = nguyên âm, ô xanh = phụ âm, vạch dọc chia âm tiế… |
| 129 | alifbe1_darslik | schema | letter_progress_strip | Dải chữ đã học ở lề phải mỗi trang chẵn: bảng nguyên âm (khung đỏ) và phụ âm (khung xanh) đầy dần theo từng chữ mới. Cần trạng thái toàn cu… |
| 130 | alifbe1_darslik | media | media.phoneme_audio | Bộ audio âm vị – âm tiết – từ: đọc ÂM tách riêng ('O-o-o', [t] không kèm nguyên âm), tên chữ, từng ô trong bảng âm tiết (on, ont, o-na…), t… |
| 136 | alifbe1_darslik | block | rebus_text | Văn bản có tranh thay chữ (rebus) và ô trống ứng với tranh: câu 'O-lim, [quả táo] ni ol'. block text cần token ảnh nội dòng có audio từ đượ… |
| 140 | alifbe1_darslik | block | cham_o_nghe_am | Bảng đọc chữ/âm tiết tương tác: mỗi ô (chữ hoa/thường trong bảng có mũi tên hướng đọc, âm tiết, từ) chạm là nghe; có chế độ 'giáo viên đọc … |
| 141 | alifbe1_darslik | media | media_dac_thu[0] | Audio âm vị tách rời ([o], [t]…) và tên chữ, giọng người bản ngữ uz – không thay được bằng TTS |
| 142 | alifbe1_darslik | media | media_dac_thu[1] | Audio từng âm tiết/từ trong bảng đọc (hàng trăm clip ngắn, dùng chung toàn bộ sách cấp 1) |
