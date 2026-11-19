# 055 – Nộp ảnh bài vẽ/bài làm giấy và GV chấm theo bảng tiêu chí có trọng số

**Ưu tiên:** P1 · **Độ khó:** vừa · **Phụ thuộc:** [009](009-giao-dien-vo-giao-bai-ket-qua-lop.md) · **Số chỗ thiếu thô gộp vào:** 7

## Thay đổi gì
- `ex.photo_submission`: chụp bằng camera hoặc chọn tệp, căn phẳng/cắt khung, tải lên `assets` (≤ 20 MB), đẩy `res/<bộ>_<uid>`; nhiều ảnh cho một bài.
- `$defs/rubric_criteria = [{id, title: i18n, weight, levels[]}]` gắn vào `exercise.grading`; `teacher_grade` thêm `criteria_scores{}` và `annotations[{x,y,note}]` (ghi chú tại vị trí trên ảnh).
- Trục 5: `giao_vien_theo_tieu_chi`; `ai_vision_goi_y` (AI chỉ gợi ý lỗi như thiếu kích thước, sai nét khuất, không cho điểm).
- `block.type = "technical_drawing"` (bản vẽ có đường kích thước R, ⌀): dùng ảnh raster đã tách sạch bằng pdfimages; vẽ lại SVG chỉ khi cần phóng to.
- `ex.sketch` (tabiiy5, 17 bài) dùng chung cách nộp/chấm này.

## Vì sao + bằng chứng
chizmachilik8 C3 (so‘zboshi yêu cầu daftar, albom tr.4; "ish daftariga chizing" tr.58; tr.55), C4 ("eskiz … yaroqsiz" tr.89; chuẩn chữ kỹ thuật tr.23), C7 (R20, R24 tr.45; "Sfera ⌀40" tr.62; 5 ảnh 150 ppi/trang tr.31), R0 (224 ảnh hình raster), R1, R2 (méo phối cảnh, 20 MB); ingliz2_daftar R4. tabiiy5: `ex.sketch` 17 bài.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** tabiiy5
- **Loại sách mới:** chizmachilik8_darslik, ingliz2_daftar ("Draw your bag"), geografiya7 (bản đồ câm trên giấy), alifbe1_daftar (tô tự do).
- **Mở khóa:** Phần lớn bài của chizmachilik8; bài vẽ mở của ingliz2_daftar.
- **Nguồn đã nêu chỗ thiếu này:** chizmachilik8_darslik, ingliz2_daftar

## Tương thích ngược
Có. `teacher_grade` hiện chấm từng ý vẫn giữ.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P1
- Phụ thuộc: [009](009-giao-dien-vo-giao-bai-ket-qua-lop.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 158 | chizmachilik8_darslik | ex | ex.drawing_submission | Nộp ảnh bài vẽ trên giấy (ish daftari, albom A4): chụp bằng camera hoặc chọn tệp, căn phẳng/cắt khung, tải lên assets, đẩy res/<bộ>_<uid>; … |
| 159 | chizmachilik8_darslik | truc | cham_hinh_ve_theo_tieu_chi | Cách chấm mới: GV chấm bài vẽ theo bảng tiêu chí có trọng số, ghi chú tại vị trí trên ảnh; với bài nâng cao, AI vision gợi ý lỗi (thiếu kíc… |
| 162 | chizmachilik8_darslik | block | ban_ve_ky_thuat | Loại nội dung mới: bản vẽ chi tiết có đường kích thước, R, ⌀, 'Sfera ⌀40', '4 tesh. 10', nét đứt, đường tâm. Hình in là ảnh raster 150 ppi … |
| 170 | chizmachilik8_darslik | quy_trinh | rui_ro[0] | hình chỉ có raster 150 ppi: phóng to bị mờ; vẽ lại SVG cho ~224 ảnh hình (pdfimages: 224 ảnh jpx rộng ≥100 px) tốn công |
| 171 | chizmachilik8_darslik | quy_trinh | rui_ro[1] | chấm tự động bài dựng hình/hình chiếu khó (nhiều lời giải đúng, dung sai); nếu không làm thì phần lớn bài phải chuyển GV chấm qua ảnh |
| 172 | chizmachilik8_darslik | quy_trinh | rui_ro[2] | ảnh chụp bài vẽ trên giấy: méo phối cảnh, ánh sáng, nét chì mờ; dung lượng tệp (asset tối đa 20 MB) |
| 240 | ingliz2_daftar | quy_trinh | rui_ro[4] | Nhiều bài mở cá nhân ('Draw your bag', 'Write about your school uniform') cần chấm GV |
