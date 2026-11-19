# Tầng 0 – lịch sử phiên bản

## v0.9.0 (D2 đã chốt) – 18/11/2026
Chi tiết từng câu và người chốt: `quyet-dinh/D2.md`. JSON được áp bằng `quyet-dinh/ap-d2.py` (chạy lại được). Kiểm tra toàn bộ: `bash _cong-cu/kiem-tra-tat-ca.sh [--day-du]`.

- **Chấm đáp án (nhóm duyệt):** `accept_v2` là mặc định. Mọi dấu nháy đổi về ‘ (o' o` oʻ o’ → o‘, g' → g‘). `nrm_v1` chỉ còn là bí danh, bằng `accept_v2_math`. Thêm `grading_defaults` và `exercise.grading`. `ex.order` mặc định `per_position`.
- **Audio 64 kbps (nhóm duyệt):** ảnh trang bản Nga (`pages_ru/`) chuyển sang artifact đồng hành. Schema mới: `asset_sources`, đường dẫn `@<nguồn>/…`. Ngân sách: ≤ 230 MB, vượt thì chuyển ảnh trang rồi gỡ file thừa; không hạ bitrate. Đầu đọc đã giải được tiền tố `@`.
- **Giao bài + kết quả lớp cho cả 7 cuốn, GV chấm ở v1 (nhóm duyệt):**
  - db `hw/` (`$defs/assignment`), `res/` (`$defs/class_result`), `grade/` (`$defs/teacher_grade`).
  - `features.classroom`; khóa `features.teacher_grading`; `giao_vien` cho 5 dạng bài.
  - Ràng buộc: bật `results_to_db` thì phải có `classroom` và capability `db` + `user`.
- **Schema theo đề xuất các agent:**
  - `profile.subject_id/country/country_code/tutor`.
  - Media: `clip.render_hash`, `media.files.kind=subtitle`, `media_lang` có `zxx`.
  - Thuật ngữ và bài tập: `audio_ref`, `glossary.forms[]`, `cell_options`, `cards[].image`.
  - Đọc văn: `text_lines[7]` là `anchor_id`; `ai_feedback.role` theo id trong `prompts.json`.
  - Id bền thay id theo vị trí, id cũ giữ trong `legacy_ids`.
- **Từ điển trục:** thêm 7 giá trị (`video_nguoi_dan`, `chuan_hoa_dau_nhay_uz`, `giao_vien_cham_cau_mo`, `zxx`, `anh_trang_o_artifact_dong_hanh`, `teacher_grading`, `subtitles`). 26 enum sinh tự động. `kiem-tra-truc.py` quét thêm nhà máy media và tokens giao diện.
- **Giao diện:** quiz đổi sang crimson #AE2548, vở #6A3FB5. `--hue-purple` ở chế độ tối là #A88BE8 (tương phản 2.3 → 5.7). Font là tệp woff2 đi kèm artifact. Thang chữ các cấp đề xuất chuyển sang `duyet_d2`.
- **Gia sư:** luật tuổi chuyển sang `duyet_d2`. Kết quả AI chấm lưu cùng bài làm trên db.
- **Nhà máy media:** chỉ còn 64 kbps. Mặc định không lập phiếu cho câu `na=1` và điểm `mo_rong`: còn 5.947 phiếu, 0 lỗi schema. CER đã duyệt.
- **README:** sửa tên cũ còn sót từ trước điều hòa trục (schema, bai-tap, mo-phong, gia-su, giao-dien); mỗi thành phần có mục "Đã chốt ở D2".
- **Phiên bản:** `"version": "0.9.0"` ở book.schema, features.schema, tu-dien-truc, prompts, tokens, danh-muc-loai-media. `schema_version` của dữ liệu là "0.9.0"; "0.9" vẫn hợp lệ.
- **Kiểm tra:** 8/8 bộ kiểm tra đạt, gồm `dau-doc/build.py` và Playwright trên `dist/` (0 lỗi console).

## v0.9-nhap (18/11/2026) – thử nghiệm 1, chờ điểm duyệt D2
- D1 thông qua (thử nghiệm 1): giữ khung 9 trục; thêm "trang dựng lại chữ thật" (trục 1), "mô phỏng thao tác phần mềm" (trục 6); chế độ nền "trang gốc + ghim", lớp bật thêm "bài học" và "đọc văn".
- Bước ② Hợp nhất: 6 agent + 1 agent điều hòa trục.
  - schema/: book.schema.json, features.schema.json; 178/178 dòng ánh xạ; 10 file ví dụ hợp lệ.
  - thu-vien/bai-tap/: 24 mục (22 dạng ex.* + 2 trợ giúp); phủ 59/59 mã gốc.
  - thu-vien/mo-phong/: 57 mục sim.*, 200 tham số; 3 khung phát + 9 kiểu cảnh chung.
  - gia-su/: 7 vai trò, 2 nhân vật; 106 lời nhắc điền thử, 0 lỗi.
  - tri-thuc/: 2.701 thuật ngữ (uz/vi 100 %, ru 99,4 %, kaa 0 %); 39 khái niệm bộ mục.
  - giao-dien/: 103 token thay 137/137 biến cũ.
  - tu-dien-truc.json: 210 giá trị cho 9 trục, nguồn duy nhất; enum schema sinh từ đây.

## v0.9-nhap +media (18/11/2026)
- nha-may-media/: hệ multi-agent media trong mỗi cuốn (tổ 4 agent của cuốn + nhà máy 7 agent dùng chung), 13 loại media.*, phieu-dat-hang.schema.json, ket-qua.schema.json, quy tắc cache source_hash.
- Kiểm kê media 7 cuốn: 7.405 điểm cần media; lập thử 6.937 phiếu (uz 3.232, ru 3.232, vi 473), 0 lỗi schema. Chưa sản xuất file (không có quyền gọi ElevenLabs/HeyGen từ phiên này).

## v0.9-nhap +đầu đọc (18/11/2026)
- dau-doc/: đầu đọc dùng chung (core.js, window.T0) với 3 chế độ: pin (nền), lesson, reading; 5 renderer bài tập, 4 mô phỏng; build.py → dist/index.html. Bản xem trước publish lên Artifact (chương mẫu kimyo8, tabiiy5, adabiyot5).

## D3 (19/11/2026)
- Nhóm duyệt chốt theo đề xuất cho 21 câu D3 và 65 đề xuất (`quyet-dinh/D3.md`). Bắt đầu đợt 1 (P0) → v0.10.
