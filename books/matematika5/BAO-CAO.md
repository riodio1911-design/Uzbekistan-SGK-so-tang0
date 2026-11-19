# BÁO CÁO bước ④: matematika5

**Xong khi: ĐẠT.** `doi-chieu.json` có 51 dòng, tổng lệch 0.

`book.json` gồm:
- 397 trang (176 SGK + 221 vở), 1.458 vùng dịch, 769 ghim.
- 648 bài tập: 1.346 ý đáp số, 115 ý tự luận (GV chấm), 185 câu trắc nghiệm, 1.043 lời giải.
- 917 ô trên trang vở, 52 bộ vở.
- 38 video với 276 cảnh, 33 mô hình.
- 276 clip vi có `source_hash`; ảnh và audio giữ tên file cũ.

Id bền theo D2, id cũ ở `legacy_ids`. Chấm theo `accept_v2_math`: 24/24 đáp án có dấu nháy đã có biến thể không dấu, nên hành vi chấm không đổi.

**Kiểm tra** (`_tools/kiem-tra.py`):
- Schema hợp lệ.
- `ex.*`, `sim.*` và giá trị trục đều có trong thư viện và từ điển.
- 0 tham chiếu trỏ sai, D2 đạt.
- Gia sư: 12 lời nhắc, 0 lỗi.
- Playwright: 10 ảnh ở 390×844, 0 lỗi console, 0 cuộn ngang.

**Tự chế** (`tu-che.md`): TC1–TC7, gồm ô nhiều phần, chuỗi trung tính, nút ý mở, khóa lưu cũ, id khi trùng số hoặc "★", tỉ lệ ảnh.

**Rủi ro** (đầu đọc thiếu):
- 8 `sim.*` chưa có renderer: 209 cảnh và 33 mô hình không chạy.
- Không vẽ ô trên trang vở.
- Chưa có giao diện vở, giao bài, kết quả lớp.
- Chưa dựng phân số `{a/b}`.

Cần bổ sung các phần này trước khi publish.
