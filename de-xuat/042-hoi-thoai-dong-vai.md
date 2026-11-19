# 042 – Khối hội thoại (bong bóng thoại) và đóng vai với gia sư

**Ưu tiên:** P1 · **Độ khó:** vừa · **Phụ thuộc:** [037](037-ngon-ngu-dich-en-va-ipa.md), [040](040-ghi-am-va-cham-noi.md) · **Số chỗ thiếu thô gộp vào:** 2

## Thay đổi gì
- `block.type = "dialogue"`: `turns[{speaker, speaker_crop?: page_crop, text: i18n|zxx, audio_ref, order}]`; audio theo lượt; hiện được cả dạng truyện tranh (khung + bong bóng đánh số ①②③).
- Chế độ đóng vai: HS chọn vai, máy/gia sư nói vai kia, chờ HS nói (micro, 040) hoặc chạm câu.
- `gia-su/prompts.json` vai trò mới `role_play` (dùng `subject_rules.foreign_language_target`).

## Vì sao + bằng chứng
ingliz2_darslik C4 (biểu tượng "dialogik nutq" tr.2; truyện tranh 4 khung tr.45; Susambil bong bóng ①②③ tr.88), C8 ("Work in pairs. Play 'Can I have …?'" tr.44; tr.89).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** ingliz2_darslik; sau này mọi sách ngôn ngữ (onatili3 "Og‘zaki nutq").
- **Nguồn đã nêu chỗ thiếu này:** ingliz2_darslik

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P1
- Phụ thuộc: [037](037-ngon-ngu-dich-en-va-ipa.md), [040](040-ghi-am-va-cham-noi.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 245 | ingliz2_darslik | block | hoi_thoai_bong_thoai | Khối hội thoại: lượt thoại có người nói (nhân vật trên tranh), thứ tự lượt (①②③), audio theo lượt, chế độ đóng vai (học sinh nói một vai, m… |
| 249 | ingliz2_darslik | gia_su | dong_vai_hoi_thoai | Đóng vai: trẻ chọn vai trong hội thoại/trò chơi nói; gia sư/máy nói vai còn lại bằng tiếng Anh, chờ trẻ nói (mic) hoặc chạm câu. Thay thế c… |
