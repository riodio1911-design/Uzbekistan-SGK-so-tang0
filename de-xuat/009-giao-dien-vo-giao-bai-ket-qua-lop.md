# 009 – Giao diện vở, giao bài, kết quả lớp và công cụ giáo viên

**Ưu tiên:** P0 · **Độ khó:** cao · **Phụ thuộc:** [008](008-o-nhap-tren-trang-vo.md), [014](014-chuyen-du-lieu-chay-cu.md), [015](015-quy-tac-id-ben-thong-nhat.md) · **Số chỗ thiếu thô gộp vào:** 3

## Thay đổi gì
Đầu đọc thực hiện phần D2 N3 đã chốt trong schema nhưng chưa có giao diện:
- Lớp `vo_bai_tap`: ghim `workbook` mở đúng bộ vở (kể cả khi tắt lớp bài học), thanh điểm bộ thang 10 (`diem_thang_10_theo_bo`), danh sách "Bài về nhà".
- Giao bài `hw/` (`$defs/assignment`), kết quả `res/` (`$defs/class_result`), bảng "Kết quả cả lớp", GV chấm câu mở `grade/` (`$defs/teacher_grade`).
- Công cụ GV đã có trong schema: `teacher.content_overrides` (sửa/ẩn/thêm quiz – db `quiz/<id>`, khóa trả lời `.v<v>`), `teacher.media_overrides` (thay video/phim tranh, asset ≤ 20 MB).
- Cho GV xem/sửa việc gán bài vào bài học (fizika8 gán bằng suy luận).

## Vì sao + bằng chứng
matematika5 DT3 (50 ghim workbook "không có dữ liệu", thiếu thanh điểm, "Bài về nhà", "Kết quả cả lớp"); tabiiy5 (35 ghim workbook chuyển sang bài học); adabiyot5 DD-6; informatika5 TC02 và kimyo8 TC-C1 (thay video GV); fizika8 TC-6 (482 bài gán lesson bằng suy luận). D2: "Giao bài + kết quả lớp cho cả 7 cuốn, GV chấm ở v1".

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** matematika5, informatika5, tabiiy5, biologiya5, adabiyot5, kimyo8, fizika8
- **Loại sách mới:** Mọi sách; sách giáo viên (022) dùng chung bảng lớp.
- **Mở khóa:** Tính năng lớp học của cả 7 cuốn (bản cũ của matematika5 đã có, nên thiếu là thụt lùi).
- **Nguồn đã nêu chỗ thiếu này:** adabiyot5, fizika8, matematika5

## Tương thích ngược
Có. Schema đã có `$defs` từ v0.9.0.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: cao
- Ưu tiên: P0
- Phụ thuộc: [008](008-o-nhap-tren-trang-vo.md), [014](014-chuyen-du-lieu-chay-cu.md), [015](015-quy-tac-id-ben-thong-nhat.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 11 | matematika5 | dau_doc_renderer | DT3 vở/giao bài/kết quả lớp | Ghim workbook không chuyển sang bộ vở; thiếu thanh điểm bộ (thang 10), "Bài về nhà", giao bài, "Kết quả cả lớp" |
| 70 | adabiyot5 | dau_doc_renderer | DD-6 giao diện GV | Sửa/ẩn/thêm quiz, thêm nút video, thay media phim tranh chưa có giao diện |
| 102 | fizika8 | quy_trinh | TC-6 gán bài trang vào bài học | Suy ra theo khoảng trang; GV cần xem lại ranh giới |
