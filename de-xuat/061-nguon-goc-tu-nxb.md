# 061 – Quy trình xin nguồn gốc từ NXB: multimedia, nhãn dán, audio nghe, atlas, PDF sạch

**Ưu tiên:** P1 · **Độ khó:** thấp · **Phụ thuộc:** Không · **Số chỗ thiếu thô gộp vào:** 12

## Thay đổi gì
Không đổi mã; đổi **quy trình** (tiền điều kiện của bước ④ cho loại sách mới). Thêm vào hướng dẫn bước ④ một "phiếu xin nguồn" theo cuốn:
- bộ "Multimedia resursi" gốc (audio/video, lời bài hát, kịch bản nghe) – ingliz2 ×2;
- audio "audiomatn" + chép lời – onatili3 ×2; audio âm vị/truyện nghe sau QR – alifbe1_darslik;
- danh sách 83 bản thu + link QR – musiqa5;
- tờ nhãn dán – alifbe1_daftar; atlas/bản đồ câm có giấy phép – geografiya7;
- PDF gốc sạch (không watermark eduportal.uz, "SOTISH UCHUN EMAS", không dòng idum.uz) và **đủ trang** (alifbe1 56/88 và 47/64 trang, musiqa5 chỉ tr.28–82, onatili3 chỉ tập 1);
- "Yozuv daftari" thật (chữ viết nối) nếu cần.
Trường `profile.edition.source_status: complete|sample|reupload` ghi tình trạng.

## Vì sao + bằng chứng
ingliz2_darslik C14, R1; ingliz2_daftar R2; alifbe1_darslik R0; alifbe1_daftar R0–R2; onatili3_darslik1 R0; onatili3_metodika R1–R2; musiqa5 R3; geografiya7_darslik C8 (atlas ở 20 trang, globus 15 trang), R4. Không có nguồn này thì 038, 043, 052 không làm được dù tầng 0 đã sẵn.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** ingliz2 ×2, alifbe1 ×2, onatili3 ×2, musiqa5, geografiya7, chizmachilik8.
- **Mở khóa:** Điều kiện cho đợt 2.
- **Nguồn đã nêu chỗ thiếu này:** alifbe1_daftar, alifbe1_darslik, geografiya7_darslik, ingliz2_daftar, ingliz2_darslik, musiqa5_darslik, onatili3_darslik1, onatili3_metodika

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P1
- Phụ thuộc: Không

## Cần người quyết
Ai liên hệ NXB (Novda, RTM, eduportal) và hạn chót? Nếu không có nguồn: thu âm lại/vẽ lại hay hoãn cuốn? Đề xuất: hoãn cuốn phụ thuộc nặng (ingliz2, musiqa5) đến khi có nguồn; alifbe1 thu âm lại âm vị bằng giọng người.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 119 | alifbe1_daftar | quy_trinh | rui_ro[0] | Người dùng gọi là 'Yozuv daftari' nhưng sách là 'Ijod daftari'; 'Yozuv daftari' thật (chữ viết nối) là cuốn khác, không có trong mẫu – nếu … |
| 120 | alifbe1_daftar | quy_trinh | rui_ro[1] | Bản mẫu 47/64 trang, dừng ở chữ G |
| 121 | alifbe1_daftar | ban_quyen | rui_ro[2] | Tờ nhãn dán không có trong PDF → phải vẽ lại/xin NXB |
| 148 | alifbe1_darslik | quy_trinh | rui_ro[0] | Bản mẫu thiếu: 56/88 trang, dừng ở chữ G; chưa thấy các chữ ghép sh, ch, ng, o‘/g‘ giai đoạn sau, phần ôn tập và cuối sách |
| 183 | geografiya7_darslik | ban_quyen | phu_thuoc_tai_lieu_ngoai_atlas | Nhiều bài yêu cầu tài liệu ngoài sách: o‘quv atlasi, bản đồ treo tường 'Dunyoning tabiiy xaritasi', 'Yarimsharlar tabiiy xaritasi', globus,… |
| 199 | geografiya7_darslik | ban_quyen | rui_ro[4] | Bài phụ thuộc atlas ngoài: không có atlas số thì nhiều bài không làm được. |
| 238 | ingliz2_daftar | ban_quyen | rui_ro[2] | Kịch bản nghe và đáp án Progress check không có trong vở → cần sách giáo viên/multimedia |
| 255 | ingliz2_darslik | ban_quyen | audio_rieng_khong_trong_pdf | Audio/video gốc ('Multimedia resursi') không có trong PDF và sách KHÔNG in số track (chỉ biểu tượng CD cạnh số hoạt động) → cần bảng ánh xạ… |
| 264 | ingliz2_darslik | ban_quyen | rui_ro[1] | Lời bài hát và kịch bản nghe không có trong sách → phải xin multimedia gốc hoặc tự soạn (sai khác bản gốc) |
| 289 | musiqa5_darslik | quy_trinh | rui_ro[3] | file chỉ là trích đoạn (trang in 28–82): thiếu mavzu 1–8, 15–16, 27 trở đi, thiếu lời nói đầu/mục lục nên bộ mục có thể chưa đủ |
| 308 | onatili3_darslik1 | ban_quyen | rui_ro[0] | Thiếu nguồn audio audiomatn (cả sách HS và sách GV đều không có chép lời) – phải xin RTM hoặc tự soạn lại |
| 330 | onatili3_metodika | quy_trinh | rui_ro[2] | Không có chép lời audiomatn – cùng rủi ro với sách HS |
