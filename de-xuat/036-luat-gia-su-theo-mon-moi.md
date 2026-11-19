# 036 – subject_rules mới cho 5 môn: tiếng mẹ đẻ, Sử, Vẽ kỹ thuật, Nhạc, Ngoại ngữ

**Ưu tiên:** P2 · **Độ khó:** vừa · **Phụ thuộc:** [035](035-luat-gia-su-0-2.md) · **Số chỗ thiếu thô gộp vào:** 6

## Thay đổi gì
`gia-su/prompts.json.subject_rules` (hiện có 3: `math_notation`, `ict_steps`, `formula_units_safety`) thêm:
- `uz_orthography`: giải thích bằng quy tắc chính tả của sách (x/h, b/p và d/t cuối từ, qo‘sh/qator undosh, bosh harf, -lar/-ni/-ning), dùng thuật ngữ sách (ega, kesim, so‘roq), không sửa hộ toàn bài;
- `history_neutral`: phân biệt dữ kiện với diễn giải, chỉ trích nguồn có trong sách, không bịa năm/tên, thận trọng với chủ đề tôn giáo và nội dung lý tưởng hóa dân tộc;
- `drawing_tutor`: không vẽ hộ/không đưa hình chiếu hoàn chỉnh, gợi ý theo bước (mặt chính, khối cơ bản, đường gióng), nhận xét ảnh bài nộp theo tiêu chí (cần capability xem ảnh);
- `music_listening`: AI không nghe được bản thu → dùng metadata bản thu làm ngữ cảnh, không phán đúng/sai về cảm xúc;
- `foreign_language_target`: trả lời bằng ngôn ngữ đích ở mức vốn từ đã học (nối 037).

## Vì sao + bằng chứng
onatili3_darslik1 C8 (kitob/kitop tr.16; talaffuz/yozuv tr.20; khung quy tắc tr.131–138); tarix7_darslik C11 (Islom, hadis, mazhab tr.140–146; "faxr va iftixor" tr.3; nguồn trái chiều về Muqanna tr.78), R2; chizmachilik8 C10 (tr.72, 89); musiqa5 C11 ("Har bir kuyning kayfiyatini aniqlang" tr.2; tr.36); ingliz2_darslik C15.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** onatili3_darslik1, tarix7_darslik, chizmachilik8_darslik, musiqa5_darslik, ingliz2_darslik.
- **Nguồn đã nêu chỗ thiếu này:** chizmachilik8_darslik, ingliz2_darslik, musiqa5_darslik, onatili3_darslik1, tarix7_darslik

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P2
- Phụ thuộc: [035](035-luat-gia-su-0-2.md)

## Cần người quyết
Với Sử (tôn giáo, dân tộc): gia sư được trả lời ngoài nội dung sách không? Đề xuất: không – chỉ trong phạm vi sách, câu ngoài phạm vi chuyển cho GV.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 165 | chizmachilik8_darslik | gia_su | gia_su.drawing_tutor_rule | Luật gia sư cho môn vẽ: không vẽ hộ hay đưa hình chiếu hoàn chỉnh, gợi ý theo bước (xác định mặt chính, khối cơ bản, đường gióng); khi có ả… |
| 256 | ingliz2_darslik | gia_su | gia_su_ngoai_ngu_0_2 | Luật gia sư cho môn ngoại ngữ: nói tiếng Anh rất đơn giản (chỉ từ vựng/mẫu câu đã học đến Unit hiện tại), câu ≤ 5–6 từ, giải thích bằng uz … |
| 280 | musiqa5_darslik | gia_su | gia_su.music_listening_role | Gia sư AI không nghe được bản thu. Cần vai trò/luật cho câu hỏi cảm thụ âm nhạc: nhận metadata bản thu (tác phẩm, nhạc cụ, nhịp độ, giọng) … |
| 299 | onatili3_darslik1 | gia_su | uz_orthography_rule | Luật gia sư cho môn tiếng mẹ đẻ Uzbek: giải thích bằng quy tắc chính tả của sách (x/h, b/p và d/t cuối từ, qo‘sh/qator undosh, bosh harf, -… |
| 344 | tarix7_darslik | gia_su | gia_su_su_hoc_trung_lap | Luật gia sư riêng cho môn Sử: phân biệt dữ kiện với diễn giải, trích đúng nguồn của sách, không bịa năm/tên; cẩn trọng với chủ đề tôn giáo … |
| 352 | tarix7_darslik | quy_trinh | rui_ro[2] | nội dung tôn giáo và tự hào dân tộc: gia sư AI phải bám sách, không tự diễn giải |
