# 021 – Giá trị trục 1 và trục 9 mới cho loại nguồn PDF

**Ưu tiên:** P1 · **Độ khó:** thấp · **Phụ thuộc:** [010](010-che-do-trang-cho-trang-dung-lai-chu.md) · **Số chỗ thiếu thô gộp vào:** 16

## Thay đổi gì
`tu-dien-truc.json` (sinh lại enum):
- Trục 1: `pdf_so_goc_co_lop_chu` (chữ trích trực tiếp, không OCR), `chu_vector_khong_font` (chữ đã thành path, render 300 dpi để OCR), `lop_chu_hong_font` (ToUnicode sai, phải remap/OCR).
- Trục 9: `watermark_ben_thu_ba` (eduportal.uz, "SOTISH UCHUN EMAS"), `nguon_ban_tai_lai` (dòng "www.idum.uz … yuklab olindi"), `ban_mau_thieu_trang`.
- Quy trình bước ④ cho sách mới: lọc nhãn bản đồ khỏi văn bản theo vùng hình; xóa watermark khỏi ảnh trang và OCR; với `lop_chu_hong_font` thì OCR.

## Vì sao + bằng chứng
geografiya7_darslik C12 (Adobe PDF Library, nhãn bản đồ xen câu tr.111); chizmachilik8 C9 (1.095 path tr.31, pdffonts rỗng); onatili3_metodika C8 ("Tashk l y q smdan"); ingliz2_daftar C10, musiqa5 C10 (watermark mọi trang); idum.uz ở chizmachilik8 R4, onatili3 R2, tarix7 R4; ingliz2 ×2 và musiqa5 không có lớp chữ.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** geografiya7, chizmachilik8, onatili3_metodika, ingliz2 ×2, musiqa5, onatili3_darslik1, tarix7_darslik.
- **Mở khóa:** Hồ sơ 9 trục của 8 cuốn mới khai báo được.
- **Nguồn đã nêu chỗ thiếu này:** chizmachilik8_darslik, geografiya7_darslik, ingliz2_daftar, ingliz2_darslik, musiqa5_darslik, onatili3_darslik1, onatili3_metodika, tarix7_darslik

## Tương thích ngược
Có. Chỉ thêm giá trị enum.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P1
- Phụ thuộc: [010](010-che-do-trang-cho-trang-dung-lai-chu.md)

## Cần người quyết
Có dùng bản tải lại (idum.uz, eduportal.uz) làm nguồn không, hay bắt buộc xin bản gốc NXB (061)? Đề xuất: chỉ dùng để khảo sát; publish phải từ bản gốc.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 164 | chizmachilik8_darslik | truc | chu_vector_khong_font | Giá trị trục 1 mới: PDF dàn trang số nhưng chữ đã chuyển thành đường vector (1095 path ở trang 31, pdffonts rỗng). Không phải bản quét: ren… |
| 174 | chizmachilik8_darslik | quy_trinh | rui_ro[4] | trang 1–2 và 94 có dòng chữ chèn 'www.idum.uz дан юкланди' (bản tải từ cổng idum.uz), cần xóa khỏi ảnh trang |
| 187 | geografiya7_darslik | truc | pdf_so_goc_co_lop_chu | PDF số gốc (không phải bản quét): chữ và nhãn bản đồ trích trực tiếp, không cần OCR; có thể tách bản đồ vector. Trục 1 chỉ có 'ocr_ban_in'/… |
| 197 | geografiya7_darslik | quy_trinh | rui_ro[2] | Trích chữ: nhãn bản đồ xen vào văn bản chính (tr.111) – cần lọc theo vùng hình. |
| 231 | ingliz2_daftar | truc | watermark_ben_thu_ba | Mọi trang có watermark chéo 'http://eduportal.uz' (vừa là lớp chữ vừa đè lên ảnh) – phải xóa khỏi ảnh trang và loại khỏi OCR; cờ ràng buộc … |
| 236 | ingliz2_daftar | ban_quyen | rui_ro[0] | Watermark eduportal.uz trên mọi trang: phải lấy bản gốc sạch hoặc xóa watermark; vấn đề nguồn/bản quyền bản quét |
| 237 | ingliz2_daftar | quy_trinh | rui_ro[1] | Không có lớp chữ nội dung → OCR; bảng, lưới tìm từ, ô chữ cần dựng lại thủ công |
| 263 | ingliz2_darslik | quy_trinh | rui_ro[0] | Không có lớp chữ: OCR phải xử lý chữ Anh + Uzbek (o‘ g‘) + IPA (ɪ ʃ ʒ ð θ ˈ ˌ) trong bong bóng thoại cong |
| 279 | musiqa5_darslik | truc | watermark_tren_trang | Mọi trang có chữ chìm chéo 'SOTISH UCHUN EMAS' (không bán) đè lên nội dung; ảnh trang gốc sẽ hiện watermark và làm OCR/nhận dạng nhạc kém h… |
| 310 | onatili3_darslik1 | quy_trinh | rui_ro[2] | Bản in tải từ idum.uz (dấu "www.idum.uz saytidan yuklab olindi" trên tr.2, 4, 143) – cần bản gốc RTM |
| 311 | onatili3_darslik1 | quy_trinh | rui_ro[3] | pdftotext tách sai chữ to trang trí (tiêu đề bị lặp chữ, vd. tr.8 'ONA ON NA YUR') và chữ quanh ảnh – dựng lại chữ cần kiểm tay |
| 322 | onatili3_metodika | quy_trinh | sua_lop_chu_mat_chu_i | Lớp chữ hỏng: font Arial CID của thân bài ánh xạ ToUnicode sai, pdftotext MẤT chữ 'i' ("Tashk l y q smdan", "b lan") trên gần như mọi trang… |
| 328 | onatili3_metodika | quy_trinh | rui_ro[0] | Lớp chữ thân bài mất chữ 'i' – cần OCR hoặc remap font, khối lượng 160 trang |
| 332 | onatili3_metodika | quy_trinh | rui_ro[4] | Bản tải từ idum.uz (dấu nước tr.3, 4, 160) |
| 353 | tarix7_darslik | quy_trinh | rui_ro[3] | chữ dàn quanh ảnh/khung cong (tr.4–6, 25, 186) làm pdftotext vỡ cột, vùng dịch phải vẽ tay |
| 354 | tarix7_darslik | quy_trinh | rui_ro[4] | trang có dòng «www.idum.uz saytidan yuklab olindi» – nguồn PDF là bản tải lại |
