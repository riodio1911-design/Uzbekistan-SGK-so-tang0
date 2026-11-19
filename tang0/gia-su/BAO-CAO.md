# Báo cáo · D. Gia sư

**Đã làm:** trích đủ 14 lời nhắc AI (mỗi cuốn 2) và các phần gia sư không dùng AI. Gộp lại thành 7 vai trò: `chat`, `hint`, `open_feedback`, `open_grade`, `quick_quiz`, `reminders`, `read_aloud`. Có 2 nhân vật (Robo, Oqilbek) và 3 tool. Viết `kiem-tra-loi-nhac.py` gồm cả 3 phần kiểm tra.

**Xong khi:** ĐẠT.
- (1) Quét 64 chuỗi mẫu, 0 giá trị viết cứng. Đã thử chèn "Grade 5 / maths / Robo" vào mẫu: bộ kiểm tra bắt được 6 lỗi.
- (2) 10 hồ sơ (7 thật + lớp 1 tiếng Nga, lớp 11 môn Sử, sách giáo viên) cho 106 lời nhắc đã điền, 0 lỗi.
- (3) 7/7 file HTML qua kiểm tra kiểu cũ, kèm 3–8 cảnh báo viết cứng mỗi cuốn.

```
(1) ✓ đã quét 64 chuỗi mẫu, 0 lỗi
(2) ✓ ×10 hồ sơ — tổng 106 lời nhắc đã điền, 0 lỗi
    (cấp 0-2, 10-11, teacher: luật tuổi ĐỀ XUẤT)
(3) ✓ Matematika 5 (7 ⚠) · Informatika 5 (7 ⚠) · Tabiiy 5 (8 ⚠) · Biologiya 5 (8 ⚠)
    · Adabiyot 5 (3 ⚠) · Kimyo 8 (6 ⚠) · Fizika 8 (6 ⚠)
KẾT QUẢ: ĐẠT (exit 0)
```

**Cần nhóm quyết ở D2:**
1. Duyệt luật cấp tuổi 0-2, 3-4, 10-11 và đối tượng giáo viên. Đây là đề xuất, chưa cuốn nào có. Lớp 5 và lớp 8 hiện dùng y hệt nhau.
2. Chấp nhận các thay đổi câu chữ khi gộp, như bỏ chữ "scientific" / "khoa học", gộp hai lời nhắc nhận xét làm một.
3. Thêm vào `profile` các trường `subject_id, audience, country, tutor{…}` (phối hợp với agent Schema).
4. "How to use the book" sinh từ dữ liệu ghim thay vì viết tay.

**Rủi ro:**
- Robo được mô tả là "nhân vật trong sách" dù sách có thể không có robot. Có thể ghi đè bằng `persona_origin`.
- Tên giá trị trục chỉ là tạm.
- Chưa thử lời nhắc với mô hình thật.
- Kết quả AI chấm vẫn chưa lưu lên db.
