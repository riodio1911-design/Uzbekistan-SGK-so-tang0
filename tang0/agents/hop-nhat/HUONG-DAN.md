# Hướng dẫn agent Hợp nhất (bước ② – dựng tầng 0, thử nghiệm 1)

## Bối cảnh
Dự án chuyển sách giáo khoa giấy K12 Uzbekistan (lớp 0–11, mọi môn, hệ tiếng Uzbek/Nga/Karakalpak, gồm cả sách giáo viên) thành sách số. Hiện có 7 cuốn, mỗi cuốn là một trang HTML artifact viết riêng. "Tầng 0" là bộ tiêu chuẩn và thư viện dùng chung, sắp theo **đặc tính sách (khung 9 trục)**, không theo môn học. Bước ① đã kiểm kê 7 cuốn. Bước ② có 6 agent chạy song song, mỗi agent làm một thành phần của tầng 0 bản nháp v0.9, để nhóm duyệt xét ở điểm D2.

Gốc thư mục (gọi là `$R`): `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad`

## Đầu vào (chỉ đọc)
- `$R/kiem-ke/<cuon>.json` và `<cuon>.md`: 7 bản kiểm kê (matematika5, informatika5, tabiiy5, biologiya5, adabiyot5, kimyo8, fizika8). Đọc HẾT cả 7 trước khi viết.
- `$R/kiem-ke/ma-tran-phu.csv`: 19 đặc tính × 7 cuốn.
- Mã HTML mới nhất: `$R/fix2/tabiiy5/index.html`, `$R/fix2/adabiyot5/index.html`; 5 cuốn còn lại ở `$R/fix/<cuon>/index.html`. File 1–3 MB: KHÔNG Read cả file. Dùng `python3 -I` để cắt bỏ chuỗi base64/dữ liệu dài rồi chỉ đọc đoạn cần. Có sẵn `$R/ana/strip.py` để tham khảo.
- `$R/ana/kiem_tra_sach.py`: bộ kiểm tra lời nhắc gia sư hiện có.

## Quyết định đã chốt ở D1 (phải tuân theo)
1. Giữ khung 9 trục: 1 bản in gốc · 2 bộ mục (rubric) của bộ sách · 3 dạng nội dung · 4 dạng bài tập · 5 cách chấm · 6 cơ chế tương tác · 7 người học (cấp tuổi 0–2, 3–4, 5–7, 8–9, 10–11; giáo viên) · 8 ngôn ngữ · 9 đi kèm và ràng buộc.
2. Thêm giá trị "trang dựng lại chữ thật" vào trục 1 và "mô phỏng thao tác phần mềm" vào trục 6.
3. "Trang gốc + ghim" là **chế độ nền** của mọi cuốn. "Bài học" (dựng lại bài theo khối) và "đọc văn" (đọc theo câu, văn bản nghệ thuật) là **lớp bật thêm**, không phải bộ máy riêng.

## Quy ước chung cho cả 6 agent
- Chỉ ghi vào thư mục của mình dưới `$R/tang0/` (xem bảng). Không sửa kiem-ke/, fix/, fix2/, không publish artifact, không nhắn người dùng.
- Khóa máy (JSON, id, tên trường) bằng tiếng Anh, `snake_case`. Tài liệu giải thích (README.md) viết tiếng Việt.
- Chuỗi đa ngữ luôn là object `{"uz": "...", "ru": "...", "vi": "...", "kaa": "..."}`; `uz` bắt buộc, còn lại tùy chọn (`kaa` = Karakalpak, dành chỗ cho sau).
- Mỗi thành phần ghi rõ **đáp ứng giá trị nào trên trục nào** (trường `axes`, ví dụ `{"4": ["chon_mot"], "5": ["tu_dong"]}`) và **nguồn**: cuốn nào, mã gốc nào (trường `sources`, ví dụ `[{"book":"kimyo8","code":"ex.ans"}]`).
- Không bịa: chỉ đưa vào cái đã thấy trong kiểm kê hoặc mã. Thứ bạn cho là cần nhưng chưa cuốn nào có → ghi vào mục "Đề xuất bổ sung" trong README, không đưa vào danh mục chính.
- Gộp trùng: cùng ý nghĩa nhưng khác tên ở các cuốn → một mục, liệt kê mọi tên gốc trong `sources`. Cùng tên nhưng khác nghĩa → tách thành hai mục và ghi chú.
- Danh mục id dùng chung giữa các agent: id dạng bài tập do agent Thư viện bài tập đặt (`ex.<ten>`), id mô phỏng do agent Thư viện mô phỏng đặt (`sim.<ten>`). Agent Schema không liệt kê enum cứng mà để trường `kind` là chuỗi có pattern `^ex\.` / `^sim\.`, ghi rằng giá trị hợp lệ lấy từ thư viện.
- Kết thúc bằng file `$R/tang0/<thu-muc>/BAO-CAO.md` (≤ 250 chữ): đã làm gì, tiêu chí "Xong khi" đạt hay chưa (kèm số liệu), điểm cần nhóm duyệt quyết ở D2, rủi ro.
- Trả lời agent điều phối ngắn gọn: danh sách file đã tạo + 5 dòng nổi bật.

## Phân việc

### A. Schema → `$R/tang0/schema/`
- `book.schema.json` (JSON Schema 2020-12): cấu trúc nội dung một cuốn. Tối thiểu: `profile` (thay `window.BOOK_PROFILE`: title, subject, grade, age, lang_base, edition…), `pages` (ảnh trang gốc theo ngôn ngữ in, vùng chữ dịch `tr`, ghim `pins` tọa độ %), `units/lessons`, `blocks` (cho lớp "bài học"), `reading` (cho lớp "đọc văn": câu, audio theo câu), `exercises` (tham chiếu `kind: ex.*`), `simulations` (tham chiếu `kind: sim.*`), `figures` (khám phá hình có điểm đánh số), `media` (audio/video theo ngôn ngữ, kèm `source_hash` cho nhà máy media), `glossary`, `teacher` (lớp dữ liệu của giáo viên).
- `features.schema.json`: hồ sơ đặc tính một cuốn theo 9 trục + các lớp bật thêm + capabilities cần (`db`, `user`, `assets`, `sample`, `downloads`) + tính năng (giao bài, lưu kết quả lên db…). Giá trị mỗi trục là enum lấy từ hồ sơ 9 trục của 7 bản kiểm kê (cộng hai giá trị D1).
- `bang-anh-xa.csv`: cột `book, ma_goc (loại khối / cấu trúc dữ liệu), schema_path, ghi_chu`. Mọi loại khối và cấu trúc dữ liệu trong 7 bản kiểm kê phải có một dòng.
- `vi-du/<cuon>.features.json` cho cả 7 cuốn và `vi-du/<cuon>.book-trich.json` (trích 1–2 trang/bài thật, dữ liệu lấy từ mã) cho ít nhất 3 cuốn đại diện 3 họ: kimyo8 (ghim), tabiiy5 (bài học), adabiyot5 (đọc văn). Kiểm tra hợp lệ bằng `jsonschema` (pip install --break-system-packages nếu thiếu) và ghi kết quả vào BAO-CAO.
- Xong khi: 100% dòng trong bang-anh-xa có schema_path; các file ví dụ hợp lệ.

### B. Thư viện bài tập → `$R/tang0/thu-vien/bai-tap/`
- `danh-muc.json`: mảng các dạng bài tập. Mỗi mục: `id` (`ex.*`), `name` (đa ngữ), `description`, `data_shape` (các trường dữ liệu cần, ví dụ `{prompt, options[], correct}`), `grading` (`tu_dong` | `ai` | `giao_vien` | `khong_cham`, kèm quy tắc chấm cụ thể: so khớp chính xác, dung sai số, thứ tự, AI chấm theo rubric…), `ui_variants` (trong modal, ô trên ảnh trang, trong vở bài tập, trong chat của gia sư…), `axes`, `sources`, `age_levels` phù hợp.
- `bang-anh-xa.csv`: `book, ma_goc, ex_id, ghi_chu` — mọi mã trong `loai_bai_tap` của 7 bản kiểm kê (cả các dạng WB của tabiiy5) phải có dòng.
- `README.md`: cách phân loại, bảng tóm tắt, các cặp đã gộp, các trường hợp tách.
- Xong khi: hợp của mọi dạng đã thấy; không trùng tên khác nghĩa; bang-anh-xa đủ.

### C. Thư viện mô phỏng → `$R/tang0/thu-vien/mo-phong/`
- `danh-muc.json`: mỗi mục `id` (`sim.*`), `name`, `mechanism` (mo_phong_tham_so | mo_hinh_3d | keo_tha | cong_cu_ao | kham_pha_hinh | hoat_hinh_dung_bang_ma | thao_tac_phan_mem | khac), `params` (tên, kiểu, miền giá trị, mặc định), `inputs/outputs`, `reusable_for` (môn/lớp khác có thể dùng, lý do), `sources` (cuốn + hàm/biến trong mã), `axes`.
- Bao gồm cả "video hoạt hình dựng bằng mã" (cả 7 cuốn đều có): phân loại các cảnh/kiểu hoạt hình thành nhóm có tham số (ví dụ `cMol` ở kimyo8).
- `bang-anh-xa.csv`: `book, ten_goc, sim_id, ghi_chu`.
- `README.md` + ghi chú mã thừa chép chéo (nhánh Toán/Tin trong Hóa/Lý…) để bước ④ không mang theo.
- Xong khi: mỗi mô phỏng có tham số và danh sách nơi dùng lại.

### D. Gia sư → `$R/tang0/gia-su/`
- Trích MỌI lời nhắc gia sư (Robo, Oqilbek) và các vai trò (gợi ý, trò chuyện, chấm bài mở, đố nhanh, cuốn sách biết nói…) từ 7 file HTML.
- `prompts.json`: mỗi vai trò một mẫu có tham số `{{title}} {{subject}} {{grade}} {{age}} {{lang}} {{persona}} {{context}}`… Không còn môn, lớp, tuổi, tên sách viết cứng. Kèm `persona` (Robo, Oqilbek: tính cách, giọng, dành cho cấp tuổi nào) và quy tắc theo cấp tuổi (5–7, 8–9, 10–11…).
- `kiem-tra-loi-nhac.py`: mở rộng từ `$R/ana/kiem_tra_sach.py`: (1) kiểm tra `prompts.json` không chứa giá trị cứng; (2) điền thử cho cả 7 hồ sơ cuốn và 3 hồ sơ giả định (lớp 1 tiếng Nga, lớp 11, sách giáo viên) rồi kiểm tra lớp/tuổi/môn khớp; (3) vẫn quét được file HTML như bản cũ. Chạy và dán kết quả vào BAO-CAO.
- `README.md`: vai trò, tham số, cách gắn vào đầu đọc, khác biệt giữa 7 cuốn đã gộp thế nào.
- Xong khi: không còn giá trị viết cứng; bộ kiểm tra chạy qua.

### E. Thuật ngữ → `$R/tang0/tri-thuc/`
- `thuat-ngu.csv`: cột `id, uz, ru, vi, mon, lop_xuat_hien, nguon (cuon:trang/bai), ghi_chu`. Lấy từ khối glossary/keywords/thuật ngữ, tên hình khám phá (fig items), tiêu đề chủ đề, các từ in đậm có bản dịch trong dữ liệu. Mỗi thuật ngữ một dòng; trùng giữa các cuốn thì gộp, nối nguồn.
- `rubric-bo-sach.json`: ánh xạ các bộ mục (rubric) của từng bộ sách (ví dụ objectives/think/explore/learn… ở tabiiy5, biologiya5; pre/think/know/talk… ở adabiyot5) về tên khái niệm chung, kèm trục 2.
- `cap-tuoi.md`: hướng dẫn theo cấp tuổi rút ra từ cách 7 cuốn đang viết (độ dài câu, cỡ chữ, cách gợi ý) — chỉ ghi điều thấy được.
- `README.md`: thống kê số thuật ngữ theo cuốn/môn, độ phủ 3 thứ tiếng.
- Xong khi: mỗi thuật ngữ một dòng, có nguồn.

### F. Giao diện → `$R/tang0/giao-dien/`
- Trích các bộ biến CSS (`:root`, chế độ tối, màu chủ đạo theo môn, font, cỡ, bo góc, bóng, khoảng cách) của cả 7 cuốn; kiểm kê nói có khoảng 3 bộ biến khác nhau.
- `tokens.json` + `tokens.css`: bộ mã thiết kế chung (màu nền/chữ/nhấn, màu theo môn làm tham số, thang chữ theo cấp tuổi, khoảng cách, bo góc, chế độ sáng/tối, kích thước vùng chạm tối thiểu cho trẻ nhỏ).
- `bang-anh-xa.csv`: `book, bien_cu, token_moi` cho mọi biến CSS của 7 cuốn.
- `README.md` + `xem-truoc.html` (một trang tự chứa minh họa token ở cả hai chế độ; chụp ảnh bằng Playwright để tự kiểm tra, không publish).
- Xong khi: mọi biến cũ của 3 bộ đều có token thay thế.
