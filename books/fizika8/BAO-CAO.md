# Báo cáo bước ④: fizika8

**Xong khi: ĐẠT.**

## Kiểm tra
- `book.json` (3,9 MB) và `features.json` hợp lệ theo schema 0.9.0.
- 5 `ex.*` và 11 `sim.*` đều có trong thư viện. Mọi giá trị trục có trong `tu-dien-truc.json`.
- 980/980 ghim và 3.602 tham chiếu nội bộ trỏ đúng. Không còn id theo vị trí.
- Gia sư: điền thử 12 lời nhắc bằng profile của cuốn, 0 lỗi. `kiem-tra-loi-nhac.py`: ĐẠT.
- Playwright: 8 ảnh 390×844 ở `preview/_anh/`, 0 lỗi console, không cuộn ngang.

## Đối chiếu
`doi-chieu.json`: 50 dòng, lệch 0.
- Trang: 176. Vùng dịch: 1.182. Ghim: 980.
- Bài trên trang: 482 (510 ý: 254 đáp số, 256 tự luận). Lời giải: 510.
- Trắc nghiệm: 60 bộ, 300 câu. Hoạt động: 37 order, 22 sort.
- Hình: 198, với 916 điểm.
- Chủ đề: 181. Video: 181, gồm 969 cảnh. Clip audio vi: 969.
- OCR RU: 2.142 đoạn. Thuật ngữ: 721.

## Tự chế
Không có mục nào phải tự chế. `tu-che.md` ghi:
- Khóa trạng thái học sinh cũ.
- Quy ước id `m<N>`/`test`/`g<k>`.
- `page_px`.
- Cờ chất lượng OCR.
- Cách gán bài vào bài học (suy ra).
- **Đầu đọc còn thiếu renderer** cho `ex.order` (37 bài) và 9 mô phỏng (650/969 cảnh).

## Rủi ro
- `pages_ru/p157.jpg` chỉ 14 KB và OCR trang này rỗng: nhiều khả năng ảnh hỏng.
- Ngân sách: gói chính sau khi tách RU ≈ 86 MB, thêm audio uz/ru 64 kbps ≈ 158 MB, tổng ≈ 244 MB. Trên mục tiêu 230 MB, dưới 256 MB.
- Xem trước: 357 file tham chiếu, publish nhiều lượt.
- Artifact đồng hành `ru_pages` chưa có URL.
