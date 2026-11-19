# Hướng dẫn theo cấp tuổi (rút từ 7 cuốn hiện có) — v0.9 nháp

Chỉ ghi điều đo được hoặc thấy trực tiếp trong dữ liệu và mã của 7 cuốn. Số liệu do `_scripts/stats_age.py` tính, kết quả lưu ở `_dump/age_stats.json`.

**Giới hạn dữ liệu.** 7 cuốn chỉ thuộc **2 cấp tuổi** của trục 7:
- **10–11 tuổi (lớp 5):** matematika5, informatika5, tabiiy5, biologiya5, adabiyot5.
- **13–14 tuổi (lớp 8):** kimyo8, fizika8.

Hồ sơ trục 7 dùng mốc 0–2, 3–4, 5–7, 8–9, 10–11 và giáo viên. Mốc 13–14 của lớp 8 nằm ngoài các mốc này. Với lớp 0–4, lớp 9–11 và sách giáo viên thì **chưa có dữ liệu**, nên tài liệu này không đưa ra quy tắc cho các cấp đó (xem "Chỗ trống" ở cuối).

## 1. Độ dài câu (số từ mỗi câu, trung bình / trung vị / phân vị 90)

Câu được tách theo dấu `. ! ? …`, câu dưới 2 từ thì bỏ. Tiếng Uzbek là ngôn ngữ chắp dính, nên mỗi câu có ít từ. Tiếng Việt đếm theo âm tiết, nên mỗi câu có nhiều từ hơn. Vì thế chỉ so sánh trong cùng một thứ tiếng.

| Cuốn (lớp) | Văn bản chính, uz | Văn bản chính, vi | Lời thuyết minh video, uz | Câu hỏi trắc nghiệm, uz |
|---|---|---|---|---|
| matematika5 (5) | 7,4 / 6 / 13 (vùng dịch) | 9,5 / 8 / 18 | 7,8 / 7 / 12 | 6,8 / 6 / 10 |
| informatika5 (5) | 8,8 / 8 / 17 (vùng dịch) | 16,2 / 15 / 29 | 8,2 / 8 / 13 | 6,1 / 6 / 9 |
| tabiiy5 (5) | 10,6 / 10 / 17 (khối learn) | 15,7 / 15 / 24 | — | 5,0 / 5 / 7 |
| biologiya5 (5) | 9,4 / 8 / 15 (khối learn) | 16,4 / 15 / 26 | — | 6,4 / 6 / 9 |
| adabiyot5 (5) | 7,6 / 6 / 14 (văn xuôi) | 13,4 / 11,5 / 25 | — | 6,1 / 6 / 8 |
| kimyo8 (8) | 10,0 / 9 / 17 (vùng dịch) | 13,2 / 13 / 23 | 10,7 / 10 / 17 | 7,1 / 7 / 11 |
| fizika8 (8) | 8,6 / 8 / 16 (vùng dịch)* | 14,2 / 13 / 26 | 9,2 / 9 / 15 | 6,6 / 6 / 11 |

\* Ở fizika8 có 569/1182 vùng dịch để trống `uz`, chỉ có vi/ru, nên số liệu uz của cuốn này chỉ dựa trên 772 câu.

Những gì thấy được:
- **Câu hỏi trắc nghiệm ngắn hơn văn bản chính ở cả 7 cuốn.** Trung vị là 5–7 từ uz, phân vị 90 không quá 11 từ. Lớp 5 và lớp 8 gần như ngang nhau.
- **Lời thuyết minh video do bản số viết thêm:** lớp 5 có trung vị 7–8 từ uz mỗi câu, lớp 8 là 9–10 từ. Bản tiếng Việt cũng theo chiều đó: lớp 5 khoảng 10–12 âm tiết, lớp 8 khoảng 14–15.
- Trung vị câu văn bản gốc ở lớp 5 là 6–10 từ uz, ở lớp 8 là 8–9. Hai cấp khác nhau không rõ, vì độ dài câu phụ thuộc vào môn nhiều hơn vào lớp. Văn học và Toán có câu ngắn nhất, Khoa học tự nhiên dài nhất.
- Phân vị 90 của bản dịch tiếng Việt lên tới 24–29 âm tiết ở informatika5, biologiya5 và fizika8. Bản dịch đang dài hơn nhiều so với lời thuyết minh viết riêng cho bản số.

## 2. Số phương án trắc nghiệm

| Cuốn | 3 phương án | 4 phương án |
|---|---|---|
| tabiiy5, biologiya5, adabiyot5 (lớp 5) | 100 % (81 / 90 / 116 câu) | 0 |
| informatika5 (lớp 5) | 66 | 74 |
| matematika5 (lớp 5) | 38 | 147 |
| kimyo8 (lớp 8) | 74 | 146 |
| fizika8 (lớp 8) | 111 | 189 |

Ba cuốn lớp 5 có khối bài học dựng lại chỉ dùng **3 phương án**. Hai cuốn lớp 8 và hai cuốn lớp 5 thuộc họ "ghim" (Toán, Tin) dùng 4 phương án là chính. Số phương án khớp với họ bộ máy hơn là với tuổi.

## 3. Cách xưng hô và giọng văn (bản tiếng Việt, tính trên 1000 chuỗi)

| Cuốn | "em" | "bạn" | "tớ" | dấu "!" |
|---|---|---|---|---|
| adabiyot5 | 195 | 45 | 14 | 96 |
| informatika5 | 168 | 28 | 0 | 22 |
| tabiiy5 | 112 | 9 | 0 | 27 |
| matematika5 | 46 | 63 | 6 | 9 |
| biologiya5 | 23 | 4 | 0 | 3 |
| kimyo8 | 19 | 0,3 | 0 | 2 |
| fizika8 | 16 | 0,2 | 0 | 1,5 |

- Các cuốn lớp 5 gọi người học là **"em"**. Toán và Văn có nhân vật đồng hành tự xưng "tớ": Madina, Aziza, Akmal, Sardor, Robi ở mục *Hamrohlar* của matematika5.
- Hai cuốn lớp 8 ít gọi thẳng người học, rất ít dấu "!", giọng trung tính.
- Bản gốc tiếng Uzbek dùng **"siz"** (lịch sự) ở mọi cuốn. Chỉ adabiyot5 có "sen" (30 lần), xuất hiện trong văn bản văn học được trích.

## 4. Cỡ chữ và giao diện

- Cả 7 cuốn đặt `body{font:14px …}`. Thang chữ không đổi theo lớp. adabiyot5 dùng `rem` với hai biến font `--read` và `--ui`.
- Cỡ chữ hay gặp nhất trong CSS là 12–14px. Chữ trên ảnh trang gốc là cỡ chữ của bản in, bản số không chỉnh.
- tabiiy5 và biologiya5 nhúng font tròn **Nunito** và **Baloo 2** (base64). matematika5, informatika5, kimyo8 và fizika8 có khai báo Nunito trong CSS của Robo nhưng không có `@font-face` hay link Google Fonts, nên thực tế dùng font hệ thống.
- Chưa cuốn nào đặt kích thước vùng chạm tối thiểu theo tuổi. Các `min-height`/`min-width` tìm được chỉ dùng cho bố cục.

## 5. Cách gợi ý và phản hồi

| Cơ chế | Lớp 5 | Lớp 8 |
|---|---|---|
| Hiện lời giải sau **2 lần sai** (`right()`) | matematika5 | kimyo8, fizika8 |
| Tự luận: lưu bài rồi mới mở **lời giải mẫu** `sol` | informatika5 | kimyo8, fizika8 |
| Nút "Gợi ý của Robo" (AI, `modelTier:'quick'`, dặn không lộ đáp án, không chấm) | matematika5, informatika5 | kimyo8, fizika8 (có cả bản không đặt `modelTier`) |
| AI **nhận xét** câu trả lời mở (định tính, có điểm 0–2 ở tabiiy5) | tabiiy5 (Robo), biologiya5 (Robo), adabiyot5 (Oqilbek) | — |
| Gợi ý viết sẵn trong dữ liệu (`hint`, regex `kw` dự phòng khi không có AI) | tabiiy5 (vở bài tập) | — |
| Hộp gợi ý trước khi viết (`pre`) và ô "ghi ý nghĩ" | adabiyot5 | — |
| Đố nhanh do Robo tạo từ quiz của bài | informatika5, tabiiy5, biologiya5 (`localQuiz`) | — |

Những gì thấy được:
- Ở lớp 5, AI vừa **nhận xét** câu trả lời mở vừa gợi ý, có hai nhân vật Robo và Oqilbek. Ở lớp 8, AI chỉ **gợi ý** và không nhận xét bài làm.
- Quy tắc "lời giải sau 2 lần sai" dùng chung cho cả hai cấp, vì cùng xuất phát từ bộ chấm `nrm/right`.

## 6. Độ dài nội dung mỗi đơn vị

- Bài trắc nghiệm cuối bài: tabiiy5 trung bình 3,5 câu/bài (81/23), biologiya5 5 câu/bài (90/18), kimyo8 5 câu/bài (220/44), fizika8 5 câu/bài (300/60), adabiyot5 4 câu/bộ (116/29), matematika5 5 câu/bộ (185/37).
- Video dựng bằng mã: matematika5 7,3 cảnh/chủ đề (276/38), informatika5 7,3 (301/41), kimyo8 5,7 (754/133), fizika8 5,4 (969/181), biologiya5 3,2 cảnh/video (213/67).

## Chỗ trống (chưa có dữ liệu, cần cuốn mẫu)

- Cấp **0–2, 3–4, 5–7, 8–9**: chưa có cuốn nào, nên chưa có số liệu về độ dài câu, cỡ chữ, vùng chạm hay cách gợi ý cho người chưa biết đọc.
- Cấp **lớp 9–11**: lớp 8 là cao nhất hiện có.
- **Sách giáo viên**: chưa có cuốn nào. Lớp giáo viên hiện chỉ có chức năng sửa, ẩn, thay media và giao bài (matematika5).
- Các đề xuất cho những chỗ trống này nằm ở mục "Đề xuất bổ sung" trong README.md, không nằm ở đây.
