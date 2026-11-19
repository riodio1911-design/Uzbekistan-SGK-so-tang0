# 050 – Tư liệu gốc, phân tích nguồn, thẻ nhân vật, ảnh hiện vật

**Ưu tiên:** P1 · **Độ khó:** thấp · **Phụ thuộc:** [059](059-ban-quyen-media-rights.md) · **Số chỗ thiếu thô gộp vào:** 7

## Thay đổi gì
- `block.type = "source"`: `{kind: primary|secondary|chrestomathy, author, work, translator?, text: i18n, margin_notes[{term, note}], footnotes[]}`; hiển thị nền giấy cói; dùng cho cả đoạn trích ngắn trong SHS và văn bản dài trong SGV (`source_document`).
- `ex.source_analysis`: gắn với một `source`, câu hỏi theo tầng (nội dung → tác giả/mục đích → độ tin cậy/so sánh); chấm AI gợi ý + GV.
- `block.type = "person_card"` (mở rộng `tieu_su_tac_gia`): tên, năm–nơi sinh/mất, danh hiệu, tác phẩm, di sản.
- `figure.artifact: {date, place_found, material, museum?}` cho ảnh hiện vật (tiền xu, lăng, bích họa, bản thảo).
- Thẻ dữ kiện ngắn trên nền cuộn giấy → khái niệm bộ mục `fact_scroll` (063).

## Vì sao + bằng chứng
tarix7_darslik C0 ("Manbalarda" tr.78; Narshaxiy tr.88; Prokopiy tr.23), C1 (tr.78, 23), C6 (Ibn Sino tr.186; Beruniy tr.185), C7 (tr.47, 129, 148), C9 (22 trang có tanga; tr.86, 188), M2; tarix7_metodika C6 (xrestomatiya tr.2; chú thích tr.42–43; cột chú giải tr.48–49), R3 (bản quyền người dịch). adabiyot5 dùng `tieu_su_tac_gia`.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** adabiyot5
- **Loại sách mới:** tarix7_darslik, tarix7_metodika; Văn (tiểu sử tác giả – `tieu_su_tac_gia` đã có).
- **Mở khóa:** Đơn vị dạy chính của môn Sử.
- **Nguồn đã nêu chỗ thiếu này:** tarix7_darslik, tarix7_metodika

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P1
- Phụ thuộc: [059](059-ban-quyen-media-rights.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 333 | tarix7_darslik | block | trich_dan_nguon_goc | Khối tư liệu gốc: đoạn trích nguồn sơ cấp/thứ cấp có ghi tác giả – tác phẩm (Narshaxiy «Buxoro tarixi», Prokopiy Kesariyskiy, Tolstov, Sagd… |
| 334 | tarix7_darslik | ex | ex.source_analysis | Bài phân tích nguồn: gắn với một trich_dan_nguon_goc, câu hỏi theo tầng (nguồn nói gì → tác giả là ai/vì sao viết → đánh giá độ tin cậy, so… |
| 339 | tarix7_darslik | block | the_nhan_vat_lich_su | Thẻ nhân vật lịch sử: tên đầy đủ, năm sinh–mất, nơi sinh–mất, danh hiệu (Shayx ar-rais…), tác phẩm, di sản ngày nay (tên miệng núi lửa Mặt … |
| 340 | tarix7_darslik | truc | fact_scroll | Thẻ dữ kiện/trích dẫn ngắn trên nền cuộn giấy cói, không có tên mục; nội dung là một dữ kiện hoặc câu nói ngắn của học giả. Cần một khái ni… |
| 342 | tarix7_darslik | schema | anh_hien_vat | Ảnh hiện vật/di tích (tiền xu, lăng mộ, bích hoạ, bản thảo) là tư liệu vật chất được hỏi đến ("tư liệu vật chất" trong SGV tr.38). Có thể d… |
| 347 | tarix7_darslik | media | media_dac_thu[2] | ảnh hiện vật: tiền xu, lăng, bích hoạ Afrosiyob, bản thảo |
| 361 | tarix7_metodika | block | source_document | Khối tư liệu lịch sử dài cho GV (hợp tuyển 'xrestomatiya'): tiêu đề, thân văn bản, chú giải thuật ngữ trong lề (Jayxun — Amudaryoning arabc… |
