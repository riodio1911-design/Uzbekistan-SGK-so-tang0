# 031 – Lớp đọc văn ở mức âm tiết

**Ưu tiên:** P1 · **Độ khó:** vừa · **Phụ thuộc:** [030](030-khoi-am-chu.md) · **Số chỗ thiếu thô gộp vào:** 1

## Thay đổi gì
- `reading.granularity` thêm `syllable` (hiện theo câu); `sentence.syllables[{text, start, dur}]` – mốc thời gian mức âm tiết.
- Đầu đọc tô sáng từng âm tiết khi phát; chạm âm tiết nào nghe âm tiết đó; văn bản in có gạch nối ("Ma-di-na gul-lar-ni") giữ nguyên.
- Nhà máy media: căn chỉnh (forced alignment) mức âm tiết cho uz.

## Vì sao + bằng chứng
alifbe1_darslik C6 (truyện "Gulzorda" tách âm tiết toàn bài tr.56; bảng "In/It – i-ni/i-ti" tr.24; 33/56 trang có từ tách âm tiết). Lớp đọc văn hiện có (adabiyot5) chỉ ở mức câu (`doc_theo_cau`).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** adabiyot5
- **Loại sách mới:** alifbe1_darslik; tiếng mẹ đẻ lớp 1–2.
- **Mở khóa:** 33/56 trang mẫu alifbe1.
- **Nguồn đã nêu chỗ thiếu này:** alifbe1_darslik

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P1
- Phụ thuộc: [030](030-khoi-am-chu.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 131 | alifbe1_darslik | che_do_doc | doc_theo_am_tiet | Đọc theo âm tiết: văn bản in có gạch nối giữa âm tiết ('Ma-di-na gul-lar-ni…'), bảng âm tiết nhiều cột. Cần tô sáng từng âm tiết/từ khi phá… |
