# BÁO CÁO bước ④: informatika5

**"Xong khi": ĐẠT.** Đối chiếu `doi-chieu.json` gồm 48 dòng, tổng lệch = 0.

**Số liệu (cũ = mới):**
- 176 trang, 1.465 vùng dịch, 374 ghim.
- 196 bộ bài trên trang: 215 ý mở + 15 đáp án ngắn, 215 lời giải.
- 28 bộ trắc nghiệm, tổng 140 câu.
- Hoạt động: 14 order, 11 sort, 3 bảng tính.
- 41 video, 301 cảnh; 81 demo, 1.426 bước.
- 760 clip vi (301 cảnh + 459 bước demo); `source_hash` khớp 760/760.
- 838 thuật ngữ.
- 9 mẫu stage (DEMO_STG) đưa vào tự chế (TC01).

**Kiểm tra (`_work/kiem-tra.py`):**
- `book.json` và `features.json` hợp lệ theo JSON Schema 2020-12.
- 6/6 `ex.*` và 7/7 `sim.*` có trong thư viện.
- 63/63 giá trị trục có trong từ điển.
- Tham chiếu và ghim: 0 lỗi.
- 1.261 id bền, không id nào đặt theo vị trí: `p10.q2.1`; `★` → `qstar`; trùng số trong cùng trang → hậu tố `b`. Id cũ ghi trong `legacy_ids`.

**Gia sư:**
- `kiem-tra-loi-nhac.py`: 0 lỗi.
- Điền thử bằng profile thật của `book.json` (`_work/kiem-tra-gia-su.py`): 12 lời nhắc, 0 lỗi.

**Playwright:**
- 13 ảnh ở 390×844 (uz/ru/vi, chế độ tối) trong `preview/_anh`.
- 0 lỗi console, không cuộn ngang. Có một lỗi CSS ở vỏ giao diện đã sửa trong bản sao (TC-DD6).

**Quyết định áp dụng:**
- `short_answer_rule = accept_v2_math`, vì `nrm()` cũ = `nrm_v1`, bí danh của rule này.
- Ý mở: `khong_cham` + `teacher_review` (D2 N3).
- `edit_role = can_edit`.

**Tự chế:**
- TC01: mẫu stage.
- Đầu đọc thiếu renderer: `screen_demo`, `ex.order`, `ex.spreadsheet`, 4 loại cảnh. Hiện "chưa hỗ trợ" cho 153/301 cảnh và toàn bộ demo.

**Rủi ro:**
- Audio vi cũ 32 kbps, chưa sinh lại 64 kbps.
- Bản dịch vi/ru chưa duyệt.
- 9 định nghĩa thuật ngữ liên môn.
- `files.json` tham chiếu 179 file của artifact cũ; nếu artifact cũ đổi phiên bản thì phải chép lại.
