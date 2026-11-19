# 062 – Loại media.* mới cho nhà máy media

**Ưu tiên:** P1 · **Độ khó:** vừa · **Phụ thuộc:** [059](059-ban-quyen-media-rights.md), [061](061-nguon-goc-tu-nxb.md) · **Số chỗ thiếu thô gộp vào:** 14

## Thay đổi gì
`nha-may-media/danh-muc-loai-media.json` (hiện 13 loại) thêm:
| id | dùng cho | nguồn |
|---|---|---|
| `media.phoneme_audio` | âm tách rời, tên chữ, âm tiết, từ (giọng người; TTS uz đọc sai âm vị) | alifbe1 ×2 |
| `media.native_speech_en` | từ/câu/chỉ dẫn tiếng Anh bản ngữ en-GB, nhiều giọng | ingliz2 ×2 |
| `media.dialogue_multi_voice` | hội thoại nhiều nhân vật (trẻ, người lớn, con vật) | ingliz2_darslik |
| `media.song` | bài hát/chant có nhạc + bản minus | ingliz2, musiqa5 |
| `media.music_recording`, `media.instrument_sample` | bản thu nhập khẩu (không sinh), mẫu âm sắc | musiqa5 (052) |
| `media.listening_text` | bài nghe audiomatn (giọng người, có thể nhiều giọng) | onatili3 ×2 |
| `media.expressive_reading` | đọc diễn cảm thơ mẫu, tez aytish | onatili3, alifbe1 |
| `media.stroke_animation` | hoạt hình thứ tự nét chữ, sinh từ dữ liệu nét (033) | alifbe1_daftar, ingliz2_daftar |
| `media.construction_animation` | dựng hình thước–compa sinh bằng mã (053) | chizmachilik8 |
| `media.env_sfx` | âm thanh môi trường/con vật cho bài "tovush" | alifbe1_darslik |
| `media.mouth_video` | video miệng phát âm (môi/lưỡi) – tùy chọn | alifbe1_darslik |
| `media.proper_noun_audio` | đọc đúng tên riêng Ả Rập–Ba Tư–Sogd | tarix7_darslik |
- Mặc định lập phiếu cho `figures[].points[].desc` (F7, đang không lập) để sinh lại lời đọc 400 điểm hình của biologiya5.
- Cờ `voice_policy: human_required` cho `phoneme_audio`, `native_speech_en`, `expressive_reading`: cấm TTS.

## Vì sao + bằng chứng
alifbe1_darslik C5, M0, M1, M3, M4, M6, R3; alifbe1_daftar M3; ingliz2_darslik C13, M0, R3; ingliz2_daftar M0–M2; musiqa5 M0–M3; onatili3_darslik1 M1, M3; onatili3_metodika M1; chizmachilik8 M0, M2; tarix7_darslik M4; biologiya5 TC08 (1.200 khóa fx mất file).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** biologiya5
- **Loại sách mới:** alifbe1 ×2, ingliz2 ×2, musiqa5, onatili3 ×2, chizmachilik8, tarix7_darslik.
- **Nguồn đã nêu chỗ thiếu này:** alifbe1_daftar, alifbe1_darslik, biologiya5, chizmachilik8_darslik, ingliz2_darslik, onatili3_darslik1, onatili3_metodika, tarix7_darslik

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P1
- Phụ thuộc: [059](059-ban-quyen-media-rights.md), [061](061-nguon-goc-tu-nxb.md)

## Cần người quyết
Chính sách giọng: loại nào bắt buộc giọng người? Đề xuất: âm vị uz, phát âm en mẫu, đọc diễn cảm thơ – bắt buộc người; còn lại TTS có duyệt CER như D2.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 53 | biologiya5 | media | TC08 lời đọc điểm hình fx | 1.200 khóa audio điểm hình mất file; nhà máy chưa lập phiếu cho figures[].points[].desc (F7) |
| 118 | alifbe1_daftar | media | media_dac_thu[3] | Âm thanh thưởng (sfx) khi tô đúng/dán nhãn |
| 144 | alifbe1_darslik | media | media_dac_thu[3] | Audio thơ, câu đố, tez aytish đọc mẫu |
| 145 | alifbe1_darslik | media | media_dac_thu[4] | Âm thanh môi trường/con vật (gió, đồng hồ, cú, ngựa, chim, ếch) cho bài 'tovush' tiết 4 |
| 147 | alifbe1_darslik | media | media_dac_thu[6] | Có thể cần video miệng phát âm (môi/lưỡi) minh họa khung 'Yodda saqlang' |
| 151 | alifbe1_darslik | quy_trinh | rui_ro[3] | Giọng: speechSynthesis gần như không có giọng uz; TTS uz đọc sai âm vị tách rời → phải thu âm người, chi phí lớn |
| 168 | chizmachilik8_darslik | media | media_dac_thu[2] | video thao tác với dụng cụ thật (cầm êke, đặt compa, tư thế ngồi) cho 1–3§, nếu muốn |
| 254 | ingliz2_darslik | media | audio_ban_ngu_en | Nguồn audio tiếng Anh bản ngữ (giọng người, ưu tiên en-GB) cho: chỉ dẫn hoạt động nghe, từ, câu, hội thoại nhiều giọng (trẻ em, người lớn, … |
| 258 | ingliz2_darslik | media | media_dac_thu[0] | Phát âm tiếng Anh bản ngữ (từ, câu, hội thoại nhiều giọng) – nguồn gốc là 'Multimedia resursi', không có trong PDF |
| 266 | ingliz2_darslik | quy_trinh | rui_ro[3] | Giọng TTS cho phát âm mẫu có thể sai trọng âm → cần người bản ngữ duyệt |
| 304 | onatili3_darslik1 | media | media_dac_thu[1] | đọc diễn cảm thơ mẫu (tr.8, 20–21, 36, 50) bằng giọng người bản ngữ |
| 306 | onatili3_darslik1 | media | media_dac_thu[3] | phát âm minh họa khác biệt talaffuz/imlo (tr.20) |
| 325 | onatili3_metodika | media | media_dac_thu[1] | âm thanh mẫu (tiếng sáo nay – tr.155) |
| 349 | tarix7_darslik | media | media_dac_thu[4] | thu âm đọc tên riêng/thuật ngữ Ả Rập–Ba Tư–Sogd đúng |
