# Hướng dẫn bước ③ Kỹ sư đầu đọc (tầng 0, thử nghiệm 1)

Đọc trước `$R/tang0/agents/hop-nhat/HUONG-DAN.md` (bối cảnh, D1, quy ước).
`$R` = `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad`. Thư mục làm việc: `$R/tang0/dau-doc/`.

## Mục tiêu
Một đầu đọc dùng chung cho MỌI cuốn, đọc `book.json` theo `tang0/schema/book.schema.json`, thay cho 7 trang HTML viết riêng. Theo D1: chế độ nền "trang gốc + ghim" (bắt buộc), lớp bật thêm "bài học" và "đọc văn". Xong khi: hiển thị được một chương mẫu của mỗi chế độ, chạy được trên điện thoại (390×844) và máy tính bảng (820×1180).

Dữ liệu mẫu (đã hợp lệ schema): `$R/tang0/schema/vi-du/{kimyo8,tabiiy5,adabiyot5}.book-trich.json` và `.features.json`. D2 chưa chốt: mọi chỗ cần quyết, theo đề xuất trong các BAO-CAO.md của bước ②, ghi lại vào BAO-CAO của bạn.

Tài nguyên tầng 0 phải dùng (không tự chế lại): `tang0/giao-dien/tokens.css` (+ `.k-hit` vùng chạm ≥44px), `tang0/thu-vien/bai-tap/danh-muc.json` (dạng `ex.*`, `data_shape`, quy tắc chấm, `ui_variants`), `tang0/thu-vien/mo-phong/danh-muc.json`, `tang0/gia-su/prompts.json` (+ README cách gắn), `tang0/tri-thuc/thuat-ngu.json`, `tang0/nha-may-media/` (clip id, `media.clips[id][lang]`).
Có thể đọc mã cũ để tham khảo cách hiển thị (`$R/fix/kimyo8/index.html`, `$R/fix2/tabiiy5/index.html`, `$R/fix2/adabiyot5/index.html`; không Read cả file, dùng `python3 -I`), nhưng KHÔNG chép mã thừa đã liệt kê trong các README bước ②.

Ảnh trang và audio: lấy từ artifact cũ bằng công cụ Artifact (action "read", `url` của cuốn trong `$R/kiem-ke/<cuon>.json`, `path` = đường dẫn file như `pages/p021.jpg`), chỉ những file chương mẫu dùng, lưu vào `$R/tang0/dau-doc/mau/<cuon>/<path>`. Chỉ đọc; không publish.

## Hợp đồng mã (cả 3 agent phải theo đúng)
- JS thuần (ES2020, không framework, không bước build bắt buộc), mỗi file tự đăng ký vào `window.T0`. CSS dùng biến của tokens.css.
- File `core.js` (agent R1) cung cấp:
  - `T0.load(bookJson, featuresJson)`; `T0.book`, `T0.features`.
  - `T0.lang` + `T0.setLang(l)` (sự kiện `t0:lang`); `T0.t(obj)` lấy chuỗi đa ngữ theo `lang`, dự phòng `uz`. Ngôn ngữ giao diện: uz, ru, vi.
  - `T0.registerMode(name, {label, available(book, features) -> bool, mount(el, ctx) -> {unmount()}})`; tên chế độ: `pin` (R1), `lesson` (R2), `reading` (R3). Thanh chuyển chế độ chỉ hiện chế độ có `available` = true.
  - `T0.registerEx(id, {render(el, item, ctx) -> {check() -> {ok, score, feedback}, reset()}})`: `id` là `ex.*` của thư viện. `T0.renderEx(el, exercise, ctx)` tra registry; dạng chưa có renderer thì hiện khung "chưa hỗ trợ: ex.xxx", không lỗi.
  - `T0.registerSim(id, {mount(el, params, ctx) -> {unmount()}})`, `T0.renderSim(...)` tương tự.
  - `T0.media.play(clipId, {onSentence?})`, `T0.media.stop()`: tra `book.media.clips[clipId][lang]`; không có file thì dùng speechSynthesis và hiện nhãn "giọng trình duyệt" (đúng tình trạng hiện nay).
  - `T0.store.get/set(key, val)`: localStorage bọc try/catch, khóa có tiền tố `t0:<book_id>:` (tránh lỗi khóa `gul:` chép chéo).
  - `T0.ui.modal(contentEl, {title})`, `T0.ui.toast(msg)`.
  - `T0.tutor.open({role, context})`: điền mẫu từ `gia-su/prompts.json` bằng `T0.book.profile`; nếu `window.claude` có hàm gọi mô hình thì gọi, nếu không thì hiện panel "xem trước lời nhắc" (bản xem trước không cần AI chạy thật). Không viết cứng môn/lớp/tuổi.
- `index.html` (R1): khung trang, thanh trên (tên sách, chọn ngôn ngữ, chọn chế độ, chọn cuốn mẫu), nạp tokens.css, core.js, modes/*.js, components/**/*.js, rồi nạp dữ liệu mẫu từ `data/*.js` (mỗi file đặt `window.T0_SAMPLES[<book_id>] = {book, features}`, sinh bằng `build.py` từ vi-du/).
- `build.py` (R1): sinh `data/*.js`, và gộp mọi thứ thành `dist/index.html` một file (JS/CSS nội tuyến) + danh sách file phụ (ảnh, audio trong `mau/`) để publish sau; ảnh tham chiếu bằng đường dẫn tương đối `mau/<cuon>/...`.

## Phân việc
- **R1 – lõi + chế độ ghim** → `core.js`, `index.html`, `build.py`, `modes/pin.js`, `components/ex/{choice_single,short_answer,open_response}.js`, `components/sim/figure_explorer.js` (nếu chương mẫu kimyo8 có hình khám phá). Chế độ ghim: ảnh trang theo ngôn ngữ in (uz/ru), vùng chạm dịch `tr` (bong bóng theo lang), ghim theo `pins` (tọa độ %), mở bài tập/hình/video trong modal; lật trang, phóng to. Chương mẫu: kimyo8 (trang 21, 37, bài t4) và chế độ ghim của tabiiy5 (trang 9–10). LÀM `core.js` TRƯỚC (trong ~nửa đầu thời gian) vì R2, R3 dùng nó; khi core ổn định, ghi file `$R/tang0/dau-doc/CORE-SAN-SANG` (rỗng).
- **R2 – lớp bài học** → `modes/lesson.js`, `components/ex/{sort_bins,table_fill}.js` + các `ex.*` khác có trong tabiiy5 trích mà R1 không làm, `components/sim/*.js` cho sim có trong tabiiy5 trích, `components/blocks.js` (hiển thị 13 `block.type`, nhãn theo `rubric` của bộ sách qua `tri-thuc/rubric-bo-sach.json`). Chương mẫu: tabiiy5 bài 1.1 + vở trang 1.
- **R3 – lớp đọc văn** → `modes/reading.js` (văn bản thật từ `reading`/`print_text`, thơ/văn xuôi, đọc theo câu: tô sáng câu đang đọc, bấm câu để nghe, chọn tốc độ; câu có cờ không đọc thì bỏ qua), chú giải thuật ngữ (bấm từ có trong `glossary`), bài tập của adabiyot5 trích (dùng renderer của R1 nếu có; nếu thiếu dạng thì viết thêm trong `components/ex/`). Chương mẫu: adabiyot5 đơn vị 2 trang 8.
- R2, R3: nếu `CORE-SAN-SANG` chưa có, viết mã theo đúng hợp đồng và thử bằng một `core` giả tạm trong `_thu/` của mình; trước khi kết thúc, chờ (kiểm tra lại file cờ) và thử với core thật. KHÔNG sửa file của agent khác; lỗi ở core thì ghi vào `$R/tang0/dau-doc/LOI-CORE.md` (nối thêm) để R1 đọc. R1 trước khi kết thúc phải đọc `LOI-CORE.md` và sửa.

## Kiểm tra (mỗi agent, cho phần của mình)
- Playwright (đã cài sẵn, `require('playwright')`, chromium.launch() không cần tùy chọn): mở `index.html` qua `file://` hoặc `python3 -m http.server`, chụp chế độ của mình ở 390×844 và 820×1180, ở uz và ru (và vi), lưu `_anh/<agent>-*.png`; xem lại ảnh (Read ảnh) để tự đánh giá; không lỗi console; không cuộn ngang; vùng chạm ≥ 44px.
- Chế độ tối: chụp thêm 1 ảnh.
- Bài tập: tự động bấm/điền thử ít nhất một đáp án đúng và một sai cho mỗi dạng, ghi kết quả.

## Đầu ra
Mã như trên; `BAO-CAO-<R1|R2|R3>.md` (≤ 250 chữ): đạt/chưa đạt tiêu chí, ảnh nào chứng minh, chỗ phải tạm quyết khi D2 chưa chốt, chỗ thiếu trong schema/thư viện (đề xuất, không tự sửa tầng 0 ngoài `dau-doc/`). Trả lời ngắn: file đã tạo + 5 dòng nổi bật.
