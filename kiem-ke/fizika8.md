# Fizika 8 – kiểm kê

**Họ bộ máy:** A (ảnh trang gốc + ghim), kèm "video" trình chiếu cảnh dựng bằng mã. Cùng khung với Kimyo 8.

**Quy mô:** 176 trang; 358 file, khoảng 130 MB (pages/ 176, pages_ru/ 176, audio_vi/ 5 MP3 sprite); HTML 3,5 MB, trong đó dữ liệu `window.PG` chiếm 2,8 MB.

**Điểm đặc trưng**
- Có bản in tiếng Nga chính thức song song: ảnh `pages_ru/` cộng OCR `RUTXT`, chuyển bằng nút 📄 UZ/RU.
- Dữ liệu đầy đủ ba thứ tiếng uz/vi/ru: 1182 ghi chú, 198 hình khám phá (916 điểm), 482 bài tập (254 tự chấm, 256 tự luận), 300 câu MCQ, 59 hoạt động (order/sort).
- 181 video có 969 cảnh, thuyết minh tiếng Việt thu sẵn phủ đủ 100%. Hình động vật lý vẽ bằng SVG: `pCircuit`, `pField`, `pCharge`, `pGraph`, `pElectro`.
- Robo dùng `sample` (có các tool open_lesson/add_reminder), gợi ý bài tập dùng `modelTier:'quick'`. Giáo viên gắn được video thật qua `db` + `assets`.

**Đáng đưa vào tầng 0:** trình đọc trang + ghim + tooltip (`pageHTML`/`render`), bộ chấm `nrm/right`, trình chiếu cảnh + `__AU` (MP3 sprite), thư viện `__DRAW`/`CHEM` (nên tách theo môn), Robo + `ROBO_HOST`, `__VM` (video giáo viên), MCQ/order/sort, `openFig`.

**Rủi ro**
- Nhiều mã thừa chép từ cuốn khác: các nhánh Toán/Tin trong `V()`/`openModel` (frac, tri, sheet…), cả một script hoạt hình Hoá không dùng, khóa `gul:done`. Robo tìm khối `think`/`workbook` nhưng dữ liệu không có các khối này.
- `<title>` có chữ "Encarta" (tên thương hiệu).
- Kết quả học chỉ lưu localStorage, không có giao bài/nộp bài.
- Thuyết minh thu sẵn chỉ có tiếng Việt; uz/ru phải nhờ giọng đọc của trình duyệt.
- `pages_ru/p157.jpg` chỉ 14 KB, nghi bị hỏng (không chắc).
