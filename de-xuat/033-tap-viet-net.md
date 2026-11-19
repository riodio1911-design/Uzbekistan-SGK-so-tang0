# 033 – Tập viết theo nét (tô chữ) và nền ô li / dòng kẻ

**Ưu tiên:** P2 · **Độ khó:** cao · **Phụ thuộc:** [008](008-o-nhap-tren-trang-vo.md), [034](034-cach-nhap-cho-tre-chua-go.md), [062](062-loai-media-moi.md) · **Số chỗ thiếu thô gộp vào:** 9

## Thay đổi gì
- `ex.letter_trace`: chữ mẫu có điểm bắt đầu (chấm đỏ), số thứ tự nét, mũi tên hướng; tô trên chữ mờ rồi tự viết; chấm so khớp hướng/thứ tự nét có ngưỡng khoan dung; GV duyệt (`giao_vien`) là căn cứ cuối.
- `page.writing_grid: {kind: "katak|four_line|technical", cell_mm, slant_deg?}` – nền canvas (ô li vuông của vở uz; dòng 4 vạch của vở en; lưới chữ kỹ thuật 75°).
- Dữ liệu nét chữ dùng chung `tang0/tri-thuc/net-chu/<bang_chu>.json`: 29 chữ uz Latin (gồm o‘ g‘ sh ch ng) hoa/thường, 26 chữ en; hoạt hình viết chữ sinh từ dữ liệu này.
- Font chữ kỹ thuật (GOST 2.304 / ISO 3098) cho mẫu chữ của chizmachilik8.

## Vì sao + bằng chứng
alifbe1_daftar C0 (tr.8, 13, 26, 34), C9 (nền lưới, chữ cao đúng 2 ô tr.8, 26), M0, R4 (không đánh giá được tư thế cầm bút), R5 (lớp chữ nét chấm vô dụng); ingliz2_daftar C0 (tr.4, 12–30), M2; chizmachilik8 C8 (tr.23–26), M3.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** alifbe1_daftar, ingliz2_daftar, chizmachilik8_darslik (chữ kỹ thuật).
- **Mở khóa:** Phần tô chữ của 2 vở cấp 0–2.
- **Nguồn đã nêu chỗ thiếu này:** alifbe1_daftar, chizmachilik8_darslik, ingliz2_daftar

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: cao
- Ưu tiên: P2
- Phụ thuộc: [008](008-o-nhap-tren-trang-vo.md), [034](034-cach-nhap-cho-tre-chua-go.md), [062](062-loai-media-moi.md)

## Cần người quyết
Có chấm tự động tập viết không, hay chỉ GV? Đề xuất: tự động chỉ để phản hồi tức thì (không vào điểm), điểm do GV.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 104 | alifbe1_daftar | ex | ex.letter_trace | Tô chữ theo mẫu: dòng 1 chữ mẫu có CHẤM ĐỎ ở điểm bắt đầu nét, các chữ sau là nét chấm xám để tô, dòng sau là nét đơn giản tách từ chữ (Z: … |
| 113 | alifbe1_daftar | schema | nen_o_li_vuong | Toàn bộ vở in trên nền giấy ô li vuông (katak); chữ tô và ô viết căn theo lưới. Bản số cần giữ lưới làm nền canvas tô/viết (tỉ lệ chữ so vớ… |
| 115 | alifbe1_daftar | media | media_dac_thu[0] | Dữ liệu nét chữ (stroke paths, điểm đầu, thứ tự, hướng) cho 29 chữ của bảng uz Latin (gồm o‘ g‘ sh ch ng), chữ in hoa/thường; hoạt hình viế… |
| 123 | alifbe1_daftar | quy_trinh | rui_ro[4] | Chấm tô chữ trên màn hình cảm ứng bằng ngón tay khác với cầm bút: không đánh giá được tư thế cầm bút, áp lực; cần ngưỡng khoan dung và GV d… |
| 124 | alifbe1_daftar | quy_trinh | rui_ro[5] | Lớp chữ của các dòng chữ tô (nét chấm) bị pdftotext đọc thành ký tự rời, không dùng được làm dữ liệu |
| 163 | chizmachilik8_darslik | ex | chu_ky_thuat_mau | Mẫu chữ kỹ thuật (shrift) có lưới tỉ lệ d, h, góc nghiêng 75°, Latin và Kirin; học sinh tập viết theo. Cần ô tập viết có lưới mờ (ex.sketch… |
| 169 | chizmachilik8_darslik | media | media_dac_thu[3] | font chữ kỹ thuật (GOST 2.304 / ISO 3098) cho mẫu chữ |
| 221 | ingliz2_daftar | ex | ex.trace_letters | Tập viết: tô theo chữ mờ trên dòng kẻ 4 vạch với số thứ tự nét và mũi tên hướng (A: nét 1,2,3), rồi tự viết. Chấm bằng so khớp hướng/thứ tự… |
| 235 | ingliz2_daftar | media | media_dac_thu[2] | Hoạt hình thứ tự nét chữ cái Aa–Zz (stroke order) |
