# Đối đẳng – agent L (ngôn ngữ, trình phát, lõi) – 20/11

Thử: `_thu/L/thu.js` (kimyo8, mặc định không `?lang=`, 20/20 ĐẠT), `_thu/L/chung.js` (7 cuốn), `_thu/L/bub.js`. Ảnh: `_thu/L/_anh/`.

**Ngang/hơn**
- L01: mặc định = `reader_langs[0]` (7 cuốn → vi). Ảnh `L01-moi-390`.
- L02: bong bóng uz gốc + vi (N dùng `T0.ui.bi`). Ảnh `L02-moi-390`, `L02-moi-dark-1280`.
- L03: ô chọn có "Việt+Рус"; bong bóng/phụ đề/nhãn hình 3 tiếng. Ảnh `L03-moi-390`.
- L04: `T0.s`/`T0.tUI` cho nhãn kép "uz · vi", có nút "UZ" để tắt.
- L05/V10: `T0.media.pickLang` chạy như `say()` cũ: mặc định phát `vi_*.mp3`; khi chọn uz cũng lùi về MP3 vi.
- L06/V01: trình phát tự chạy, có ‹ ❚❚ › 🔊 (nhớ theo cuốn), thanh tiến độ, i / n, phụ đề song ngữ. Ảnh `V01-moi-390`.
- L07/V07: cShell vẽ lại theo `__DRAW` cũ, 156 phần tử SVG, electron quay, nhãn TL song ngữ; electron hóa trị tô màu (hơn bản cũ). Ảnh `V-cShell-moi-390`, `V-cShell-moi-uz-dark-1280`.
- T01: nút "🎬 Thay video" ngay trong trình phát: chọn tiếng, dán URL hoặc MP4 ≤ 20 MB, gỡ; có nút ▶ VI / ✎ Hoạt hình. Ảnh `T01-moi-1280`.
- T02: GV có nút 🎬 trên thanh trên (1 bước). Nhận nhiều tệp `<mã>_<tiếng>.mp4` hoặc dán dòng `t17 vi https://…`; bảng ✓ 133 × 4 cột. Ảnh `T02-moi-1280`.

**Còn kém**
- L04 chỉ phủ phần của core/trình phát/video. Nhãn của pin.js và Robo do N, R chuyển sang `T0.tUI` (đã ghi YEU-CAU).

**Yêu cầu**
- Nhận: chưa có mục R/N nào gửi L.
- Gửi (YEU-CAU "L → mọi agent"): API song ngữ và media. N: tiêu đề modal video = `T0.tUI(video.title)`.
- `_thu/D/kiem-g.js` còn dùng cấu trúc trình phát cũ nên báo lỗi.

Đã kiểm: build `--book all`; `dem.js` sạch (0 chưa hỗ trợ, 0/3.489 ghim lỗi, không cuộn ngang, không lỗi console); `_thu/G/thu.js` 34/34.
