# 034 – Cách nhập cho trẻ chưa biết gõ: bàn phím chữ có tiếng, viết tay, trả lời bằng chạm

**Ưu tiên:** P1 · **Độ khó:** vừa · **Phụ thuộc:** [008](008-o-nhap-tren-trang-vo.md), [030](030-khoi-am-chu.md) · **Số chỗ thiếu thô gộp vào:** 3

## Thay đổi gì
- Thành phần nhập mới của đầu đọc, dùng cho mọi ô `field.type = cell|input` khi `grade_band = 0-2`:
  - `input_mode: "letter_keyboard"`: bàn phím trên màn hình chỉ gồm chữ đã học (`alphabet_sequence`, 030), mỗi phím phát âm khi chạm, ô "o‘" là một phím;
  - `input_mode: "handwriting"`: ô viết tay trên dòng kẻ + nhận dạng chữ (chỉ để gợi ý; ngưỡng khoan dung);
  - `input_mode: "tap_choice"`: chọn chữ/tranh thay cho gõ.
- Trục 6 thêm `ban_phim_chu_tren_man_hinh`, `viet_tay_nhan_dang`.

## Vì sao + bằng chứng
alifbe1_daftar C2 ("Rasmlarni bo‘yang va nomlarini kataklarga yozing" tr.38; tr.47, 8, 34, 40: "nhập bằng bàn phím máy là không khả thi ở lớp 1"); alifbe1_darslik C10 (bàn phím chỉ chữ đã học); ingliz2_daftar C9 ("Write the words" dòng 4 vạch tr.13, 17, 33; "go_phim là cách nhập duy nhất có chấm"), R3.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** alifbe1_daftar, alifbe1_darslik, ingliz2_daftar.
- **Mở khóa:** Mọi ô viết của 2 vở cấp 0–2.
- **Nguồn đã nêu chỗ thiếu này:** alifbe1_daftar, ingliz2_daftar

## Tương thích ngược
Có. Mặc định vẫn là gõ phím.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P1
- Phụ thuộc: [008](008-o-nhap-tren-trang-vo.md), [030](030-khoi-am-chu.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 106 | alifbe1_daftar | dau_doc_renderer | ban_phim_chu_cai_co_tieng | Cách nhập chữ cho trẻ chưa biết gõ: rất nhiều bài yêu cầu 'yozing' – viết tên tranh vào hàng ô (một chữ một ô), viết âm tiết, xếp chữ thành… |
| 230 | ingliz2_daftar | dau_doc_renderer | viet_tay_nhan_dang | Ô viết tay (bút cảm ứng/ngón tay) trên dòng kẻ có nhận dạng chữ viết tay → chữ, để chấm điền từ cho trẻ chưa biết gõ phím. Hiện go_phim là … |
| 239 | ingliz2_daftar | quy_trinh | rui_ro[3] | Nhận dạng chữ viết tay và nét viết của trẻ 7–8 tuổi kém chính xác |
