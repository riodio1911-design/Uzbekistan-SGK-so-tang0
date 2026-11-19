# Báo cáo · A. Schema (tầng 0 v0.9)

**Đã làm:** viết `book.schema.json` và `features.schema.json` (JSON Schema 2020-12). Lập `bang-anh-xa.csv`. Tạo 7 file `vi-du/*.features.json` và 3 file trích dữ liệu thật lấy từ mã: kimyo8 (ghim, tr. 21 và 37), tabiiy5 (bài 1.1 + vở tr. 1), adabiyot5 (đọc văn, tr. 8). Viết `kiem-tra.py` để kiểm tra lại.

**Tiêu chí "Xong khi": ĐẠT** (`python3 -I kiem-tra.py`)
- bang-anh-xa: 178/178 dòng có `schema_path` (100%), 0 đường dẫn sai; phủ 132/132 loại khối và cấu trúc dữ liệu của 7 bản kiểm kê.
- Hai schema hợp lệ; 10/10 file ví dụ hợp lệ.
- Id trong ví dụ có trong danh mục của hai agent kia: `ex.*` 22/22, `sim.*` 4/4.

**Cần quyết ở D2:**
1. Chủ đề TP (i/t/s) mô hình thành `lessons[].kind`, hay tách `topics` riêng?
2. Trường bài tập: giữ trường chung trong schema, hay đẩy sang `data` theo `data_shape` của thư viện?
3. Danh sách 13 `block.type` và 15 `pin.kind`.
4. Ngôn ngữ của giá trị enum: tiếng Việt không dấu hay tiếng Anh?
5. `grade_band` (0-2…10-11) tính theo lớp hay theo tuổi?
6. Giữ hay bỏ `translation_memory` (RUDICT)?

**Rủi ro:**
- Mới chạy thử trên phần trích, chưa chuyển trọn một cuốn.
- Id đặt theo vị trí (`p21.ex0`) sẽ không bền nếu dữ liệu đổi.
- Nguồn giọng audio phần lớn không rõ.
- Clip khối của tabiiy5 chưa có `source_hash` vì chưa rõ clip đọc chữ nào.
- `HOT` trùng tên khác nghĩa (tabiiy5/adabiyot5), đã tách.
