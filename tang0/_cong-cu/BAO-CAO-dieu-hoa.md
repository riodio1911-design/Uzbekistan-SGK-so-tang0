# Báo cáo điều hòa trục (bước ②)

Nguồn duy nhất: `tang0/tu-dien-truc.json`. Enum schema sinh bằng `sinh-enum.py`; `kiem-tra-truc.py` quét 8 thành phần: **0 lỗi** (bản trước điều hòa: 265 lỗi). Ba bộ kiểm tra cũ vẫn ĐẠT.

Số giá trị trước → sau: trục 1: 8→7 · 2: 45→45 (39 khái niệm mở rộng được + 6 cấu trúc) · 3: 25→23 · 4: 46→24 ex.* · 5: 16→16 · 6: 40→29 · 7: 11→8 · 8: 20→18 · 9: 44→40.

## Gộp đáng chú ý
- Trục 4: bỏ nhãn `chon_mot`, `tu_luan`… (trùng 1–1 với ex.*), chỉ còn trong `bi_danh`. `du_doan_kiem_tra` → `ex.sim_task`.
- Trục 6: `cham_chon_cham` → `cham_chon`, `ghim_mo_modal` → `ghim_tren_trang` + `modal`, `chat_ai`/`chat_gia_su` → `chat_ai_co_tool`.
- Trục 3: `video_hoat_hinh_ma` → `video_hoat_hinh_dung_bang_ma`, `mo_phong` → `mo_hinh_tuong_tac`.
- Trục 7: `age_levels` → `grade_bands`. `learner`/`student`/`teacher` → `hoc_sinh`/`giao_vien`. Luật của sách giáo viên không còn mang nhãn cấp `teacher`.
- Trục 8: `canh`/`khoi`/`cau` → `audio_theo_*`.

## Cần quyết ở D2
1. Có giữ 9 giá trị mới thêm vào trục 6 không (`go_phim`, `cham_theo_thu_tu`, `cham_de_lat`, `chon_tham_so`, `keo_tha`, `cong_cu_ao`, `tro_choi_co_gio`, `chon_tep`, `goi_y_ai`)? `go_phim` và `o_nhap_tren_trang` đang trộn hai chiều: cách nhập và vị trí ô.
2. Có giữ `van_ban_nghe_thuat` (nhóm cha của thơ, văn xuôi) và `cong_thuc_toan` ở trục 3 không?
3. Trục 9 có nên gồm cả capability và khóa `features` (id tiếng Anh) không?
4. Có nên tạo `ex.predict_check` riêng không?
5. README các agent khác còn tên cũ (chưa sửa).
