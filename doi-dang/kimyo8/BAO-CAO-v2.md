# Đối đẳng kimyo8, lần 2 (sau đợt sửa R/L/N)

Đo lại toàn bộ 54 tính năng/engine với tiêu chí giữ nguyên như v1. Bản mới chạy ở thiết lập mặc định, không thêm `?lang=`. Kết quả gồm 180 ảnh (`_anh/v2/`) và số đo (`_anh/v2/do.json`). Ba phép đo được làm lại bằng `do-them-v2.js`: âm thanh mặc định, bong bóng khi sang bài, bài tự luận.

| | v1 | v2 |
|---|---|---|
| ngang | 19 | 47 |
| hơn | 3 | 6 |
| kém | 14 | 1 |
| thiếu | 18 | 0 |

So với v1: 31 mục tốt lên, 23 mục giữ nguyên, 0 mục xấu đi.

## Kết luận: ĐẠT tiêu chí thay bản
- Không còn mục P0.
- Nhóm Robo và nhóm ngôn ngữ không còn mục "thiếu".
- Kém + thiếu = 1/54 (1,9 %), dưới ngưỡng 10 %. Mục kém duy nhất là B06 và không tính chặn.

## Ba điểm người dùng nêu
- **Robo: ngang.** Có robot nổi, tư thế và lời chào. Bong bóng xuất hiện khi sang bài mới. Có chat theo ngữ cảnh trang, 4 câu gợi ý, đố nhanh (thêm nút "Câu khác"), nhiệm vụ, nhắc hạn kèm badge, giờ học và hướng dẫn. Kịch bản cũ chạy lại được nguyên vẹn vì giữ tên lớp `.rb-*`.
- **Tiếng Việt: ngang.** Mặc định là vi. Bong bóng, phụ đề và nhãn hình hiện uz + vi, có thêm chế độ Việt+Рус. Video ở mặc định phát `vi_1.mp3`.
- **Engine: ngang.** Cả 19 loại cảnh đều chạy. cShell được vẽ lại, đạt 146 phần tử so với 139 của bản cũ. Trình phát tự chạy, có ‹ ❚❚ › 🔊 và hiện i/n. Giáo viên thay được video ngay trong trình phát và có công cụ quản lý hàng loạt.

## Bản mới hơn bản cũ
- Giao bài và xem kết quả cả lớp.
- Kéo thả trong bài sắp thứ tự.
- Ngăn dịch giữ mở khi lật trang, có đề bài và nút Mở.
- Bong bóng sang bài có thêm "+ Nhắc bài tập".
- Đố nhanh có nút "Câu khác".
- Phóng to trang, nút Aa.

## Còn lại (không chặn)
- **B06:** chuyển kết quả cũ. Xử lý bằng cách phát hành vào URL cũ (9aUM…). `migrate.js` và `robo.js` sẽ tự nhập `kim8.ans`, `gul:done`, `robo.kim:*`.
- Việc gọi công cụ AI (open_lesson, add_reminder, list_reminders) chưa thử với AI thật, vì AI giả lập không gọi công cụ.
- Hướng dẫn: biểu tượng ghim mới có màu, chưa có hình.
- Ở 390 px, ô mục lục bị cắt chữ và thanh công cụ cao 3 hàng (bản cũ cao 4 hàng).
- Video thật trên db `media/*` của artifact cũ cần chép khi phát hành.
