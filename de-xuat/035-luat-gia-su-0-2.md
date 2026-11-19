# 035 – Luật gia sư cấp 0–2 cho người chưa biết đọc và người mới học ngoại ngữ

**Ưu tiên:** P1 · **Độ khó:** vừa · **Phụ thuộc:** [029](029-che-do-pre-reader.md), [030](030-khoi-am-chu.md), [037](037-ngon-ngu-dich-en-va-ipa.md) · **Số chỗ thiếu thô gộp vào:** 1

## Thay đổi gì
`gia-su/prompts.json` `age_rules[grade_band=0-2]` (đang `duyet_d2`, `sources: []`) bổ sung:
- chỉ nói (đọc to), không yêu cầu trẻ gõ; nhận trả lời bằng giọng nói hoặc chạm tranh;
- phân biệt TOVUSH (âm, đọc /o/) và HARF (tên chữ);
- chỉ dùng chữ/từ đã học tới bài hiện tại (`alphabet_sequence`, vốn từ của Unit);
- với ngoại ngữ: câu ≤ 5–6 từ tiếng Anh, giải thích bằng uz khi trẻ bí, sửa lỗi bằng recast, đọc giọng en.
Gắn `sources` thật: alifbe1, ingliz2.

## Vì sao + bằng chứng
alifbe1_darslik C14 (luật 0-2 hiện chỉ quy định độ dài ≤ 40 từ và đọc to; "Tovush → Unli/Undosh" tr.13; "[o] tovushi" tách với "O o harfi" tr.15); ingliz2_darslik C15 ("I can say the ABC", "count 1–20" tr.46 giới hạn vốn từ; "endigina qadam qo‘ygan jajji bolajonlar" tr.3).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** alifbe1_darslik, alifbe1_daftar, ingliz2_darslik, ingliz2_daftar.
- **Nguồn đã nêu chỗ thiếu này:** alifbe1_darslik

## Tương thích ngược
Có. Chỉ thêm luật.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P1
- Phụ thuộc: [029](029-che-do-pre-reader.md), [030](030-khoi-am-chu.md), [037](037-ngon-ngu-dich-en-va-ipa.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 139 | alifbe1_darslik | gia_su | gia_su_0_2_tien_doc | Luật gia sư cấp 0-2 hiện chỉ quy định độ dài (≤40 từ) và đọc to mặc định. Thiếu: (1) chỉ nói, không yêu cầu trẻ gõ; nhận câu trả lời bằng g… |
