# Kiểm kê: Matematika 5 (AHA! Matematika, Toán lớp 5)

**Họ bộ máy:** A, tức là ghim trên ảnh trang gốc. Cuốn này gộp **SGK 176 trang và vở bài tập 221 trang** vào một trang (chuyển qua lại bằng `BK='tb'|'wb'`). Tổng cộng 400 file, 52,4 MB: ảnh trang 43,5 MB, MP3 tiếng Việt 7,4 MB, HTML 1,5 MB (dữ liệu JSON viết thẳng trong file, không có base64).

## Điểm đặc trưng
- **Vở bài tập điện tử:** có 917 ô nhập đặt thẳng trên ảnh trang vở (`window.WBI`) và chấm ngay khi nhập. Điểm tính theo thang 10 cho từng bộ trong 52 bộ (`WBS`).
- **Giao bài và kết quả lớp:** giáo viên giao bài và đặt hạn qua `db` (`hw/<set>`). Kết quả lưu ở `res/<set>_<uid>`, tên học sinh lấy bằng `user.profiles`, giáo viên nhận diện qua `canEdit()`.
- **Chấm tự động** khoảng 1.346 ý điền đáp số và 185 câu trắc nghiệm. Bộ chuẩn hoá xử lý được phân số, hỗn số, nhiều đáp án (`;`) và đáp án thay thế (`|`).
- **"Video" không dùng file video:** 38 chủ đề với 276 cảnh dựng từ dữ liệu. Lời thuyết minh có MP3 sprite tiếng Việt; tiếng Uzbek và tiếng Nga dùng TTS của trình duyệt.
- **33 mô hình SVG có tham số:** bảng giá trị theo hàng, dời chữ số khi nhân/chia 10/100/1000, phân số, nhân phân số bằng diện tích, diện tích tam giác, thể tích hình hộp, tỉ số.
- **Robo:** trò chuyện qua `sample` với các tool mở bài và nhắc việc; nút gợi ý cho từng ý bài tập chạy ở `modelTier:'quick'`.

## Nên đưa vào tầng 0
Trình xem trang có vùng dịch và ghim; ô nhập trên ảnh trang (WBI); bộ chấm `nrm/one/right`; kí pháp phân số `{a/b}`; trình chiếu video từ dữ liệu kèm `__AU`; thư viện mô hình `V()`; mẫu giao bài/kết quả lớp (`hw`/`res`); giao diện `ROBO_HOST`.

## Rủi ro
- **Mã chép từ cuốn khác:** Robo tìm các block `think`/`workbook` mà cuốn này không có. Từ điển RRU chứa chuỗi của cuốn khác. Có phần tử `#mini` không tồn tại và khoá `gul:done`.
- **Phông chữ:** CSS dùng Nunito và Baloo 2 nhưng không nạp.
- **Đáp án bằng chữ Uzbek:** một số đáp án là cụm chữ Uzbek, gây khó cho học sinh đọc tiếng Việt.
- **Câu tự luận:** 115 câu không chấm, giáo viên không xem được nội dung.
- **Viết cứng:** tổng số trang 172/217 được ghi cứng trong mã.
