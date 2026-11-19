# 037 – Ngôn ngữ đích (en) tách khỏi ngôn ngữ giảng dạy; IPA; từ điển tranh

**Ưu tiên:** P1 · **Độ khó:** vừa · **Phụ thuộc:** Không · **Số chỗ thiếu thô gộp vào:** 5

## Thay đổi gì
- `$defs/lang` thêm `en` (và biến thể giọng `en-GB`/`en-US` ở cấp media); `prompts.languages` thêm `en`; trục 8 thêm `en`.
- `profile.target_lang` (ngôn ngữ đang học: KHÔNG dịch tự động nội dung chính, KHÔNG thay bằng bản dịch) và `profile.instruction_langs[]` (uz/ru – chỉ dẫn, nghĩa từ). Đầu đọc: nút đổi ngôn ngữ chỉ đổi phần chỉ dẫn; nội dung `target_lang` giữ nguyên.
- `glossary_entry.ipa`, `glossary_entry.en`, `glossary_entry.image`, `glossary_entry.pos` (từ loại); câu mẫu có `ipa`. Font có ký tự IPA (ɪ ʃ ʒ ð θ ˈ ˌ ː).
- Từ điển tranh = glossary có ảnh + audio en, dùng làm flashcard/ngân hàng từ cho bài tập.

## Vì sao + bằng chứng
ingliz2_darslik C0 (toàn bộ nội dung tiếng Anh tr.6; Wordlist English|Uzbek tr.106), C1 ("Listen and sing." / "Tinglang va kuylang." tr.6), C2 (IPA tr.94, 101, 106), C12 (thẻ từ tr.94–105), R5 ("cùng một sách tiếng Anh có thể có bản chỉ dẫn uz và ru"). informatika5 TC03: Glossariy có tên tiếng Anh. Schema hiện: `$defs/lang` = uz/ru/vi/kaa.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** informatika5
- **Loại sách mới:** ingliz2_darslik, ingliz2_daftar; sau này tiếng Nga như ngoại ngữ ở trường uz và ngược lại.
- **Mở khóa:** Loại sách ngoại ngữ (2/12 mẫu).
- **Nguồn đã nêu chỗ thiếu này:** ingliz2_darslik

## Tương thích ngược
Có. `target_lang` vắng mặt = như hiện nay.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P1
- Phụ thuộc: Không

## Cần người quyết
Bản vi (ngôn ngữ của nhóm duyệt) có dịch nội dung tiếng Anh không? Đề xuất: không dịch nội dung `target_lang`; chỉ dịch chỉ dẫn và ghi chú cho người duyệt trong ngăn dịch.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 241 | ingliz2_darslik | truc | en | Mã ngôn ngữ en (tiếng Anh) chưa có trong trục 8, book.schema $defs.lang (enum uz/ru/vi/kaa), prompts.languages. Cần thêm en (và biến thể en… |
| 242 | ingliz2_darslik | truc | ngon_ngu_dich_khac_ngon_ngu_giang_day | Tách hai vai trò: target_lang (ngôn ngữ đang học, KHÔNG được dịch tự động nội dung chính, KHÔNG thay bằng bản dịch) và instruction_lang (ng… |
| 243 | ingliz2_darslik | schema | phien_am_ipa | Phiên âm IPA cho từ và cả câu (trọng âm ˈ ˌ, ː), cần font IPA, trường ipa trong glossary/term và trong câu; chạm từ → nghe phát âm bản ngữ. |
| 253 | ingliz2_darslik | schema | tu_dien_tranh | Từ điển tranh theo Unit: thẻ {tranh, từ en, IPA, nghĩa uz, audio en} và thẻ câu mẫu; dùng làm flashcard / ngân hàng từ cho bài tập. term tr… |
| 268 | ingliz2_darslik | quy_trinh | rui_ro[5] | Đổi bản in uz/ru hiện có của đầu đọc không áp dụng – cùng một sách tiếng Anh có thể có bản chỉ dẫn uz và ru |
