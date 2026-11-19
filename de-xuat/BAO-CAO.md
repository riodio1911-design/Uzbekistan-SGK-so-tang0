# BÁO CÁO – agent ⑥ Tiêu chuẩn

**Đã làm.** `tong-hop-cho-thieu.csv` có **377 chỗ thiếu thô**: 103 từ bước ④, 274 từ 12 mẫu khảo sát. Gộp thành **65 đề xuất** (15 P0, 35 P1, 15 P2). Mỗi đề xuất liệt kê các dòng thô của nó. 11 dòng không thành đề xuất, lý do ghi trong CSV. `MUC-LUC.md` gồm bảng, lộ trình 3 đợt và 21 câu hỏi cho D3. Không sửa tầng 0, books/, khao-sat/.

**Số liệu (đếm trên `book.json`).** Đầu đọc có 5 renderer bài tập, 4 component mô phỏng. Chưa chạy:
- 203/2.515 bài
- 1.849/3.712 cảnh
- 142/144 mô phỏng
- 1.869 ô trên trang vở

Đợt 1 (P0) mở khóa toàn bộ phần này. Riêng 001 (cảnh chữ/thẻ, dễ) phủ 1.370 cảnh.

**Cần D3 quyết.**
- Thay từng cuốn khi đủ P0 của cuốn đó.
- Thống nhất id bền: 4 cuốn đang dùng 4 cách.
- Có cho tabiiy5 chạy mã cũ tạm không.
- Chuyển dữ liệu cũ.
- Sách giáo viên là book riêng; đáp án chỉ GV xem.
- Chính sách giọng người và giọng trẻ em.
- Xin nguồn NXB.

**Rủi ro.**
- Mẫu khảo sát là trích đoạn, nên đợt 2 có thể còn thiếu.
- ingliz2, musiqa5, onatili3 cần audio gốc không có trong PDF.
- Chưa rõ db có luật đọc theo vai trò không.
- Độ khó chưa được người viết đầu đọc kiểm.
