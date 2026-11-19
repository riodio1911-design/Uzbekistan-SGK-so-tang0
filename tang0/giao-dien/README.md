# Giao diện: token tầng 0 (v0.9.0 – D2 đã chốt)

## Các file
| File | Nội dung |
|---|---|
| `tokens.json` | Nguồn gốc của mọi token. Mỗi token có `css`, `light`, `dark`, `role`, `sources`, `status` (`quan_sat` hoặc `duyet_d2`), `axes` khi liên quan, kèm `text_scale` theo cấp tuổi, `subject_presets` và `component_local` |
| `tokens.css` | Sinh từ JSON. Gắn lên `<html data-accent="blue\|teal" data-age="0_2…giao_vien" [data-theme]>` |
| `bang-anh-xa.csv` | `book, bien_cu, token_moi, ghi_chu`: 137 dòng, gồm mọi biến được định nghĩa hoặc được dùng ở 7 cuốn |
| `mau-viet-cung.csv` | 95 dòng: các màu đang viết cứng (màu ghim, `.pbar`, bảng đen video, lớp phủ…) và token thay thế |
| `xem-truoc.html` | Trang tự chứa, hiện hai chế độ cạnh nhau, có chọn màu theo môn và cấp tuổi (`?accent=teal&age=8_9`) |
| `_work/` | Script trích (`extract.py`), sinh (`build.py`, `gen_preview.py`), chụp ảnh (`shot.js`), CSS/JS đã trích và ảnh chụp kiểm tra |

Muốn sửa token thì sửa `_work/build.py`, rồi chạy `python3 -I _work/build.py && python3 -I _work/gen_preview.py`.

## 3 bộ biến gốc (đúng như kiểm kê nói)
| Bộ | Cuốn | Số biến | Đặc điểm |
|---|---|---|---|
| A, ghim | matematika5, informatika5, kimyo8, fizika8 | 16 | Giống hệt nhau ở cả 4 cuốn. Màu nhấn **không đổi** khi sang chế độ tối. Không có biến bo góc. `--orange` định nghĩa nhưng không dùng. CSS Robo gọi `--blue-ink` mà không định nghĩa nên rơi về fallback |
| B, bài học | tabiiy5, biologiya5 | 23 (+`--desk`, `--desk-2` ở tabiiy5) | Đầy đủ nhất: cặp màu đậm/nhạt, `--r-sm/md/lg`, `--display`, đổi màu ở chế độ tối. 14 font woff2 nhúng base64. `--desk-2` không được dùng |
| C, đọc văn | adabiyot5 | 20 (+`--lh` cục bộ do JS đặt) | Màu teal, pom (lựu), gold. Font `--read` Literata và `--ui` Noto Sans nạp qua Google Fonts. Có nút đổi chế độ `#thm` |

Cả 7 cuốn đã dùng chung một cách bật chế độ tối: `prefers-color-scheme` cộng `:root[data-theme]`. `tokens.css` giữ nguyên cách này.

## Nguyên tắc gộp
- **Màu nền và chữ** lấy giá trị bộ B làm mặc định. Lý do: widget Robo chép sang 6 cuốn đều dùng giá trị B làm fallback (`var(--line,#D5E4EF)`…). Bộ A lệch ±1 bậc sắc độ, và ghi chú từng token có ghi giá trị cũ.
- **Màu nhấn là tham số** `--subject-accent*`, đặt qua `data-accent`. Mới thấy 2 giá trị: `blue` (6 cuốn) và `teal` (adabiyot5). Preset `teal` mang theo cả nền ngả lục của C để giữ đúng giao diện hiện tại.
- **Tên vai trò khác nhau nhưng cùng giá trị thì gộp**: `--green`(A) với `--leaf`(B) thành `--hue-green`, `--red`(A) với `--petal`(B) thành `--hue-red`, `--blue-ink`/`--teal-ink` thành `--color-accent-ink`, `--paper`(A,B) với `--bg`(C) thành `--color-bg`.
- **Cùng màu nhưng khác nghĩa thì tách**: `--pin-exercise` và `--pin-lesson` (đều #2A8040), `--pin-figure` và `--pin-demo` (đều #0E8A8A).
- **Cùng tên nhưng khác vai trò**: `--blue` ở A vừa là màu nhấn của giao diện vừa là màu ghim video. Bảng ánh xạ đưa về `--color-accent` và ghi chú dùng `--pin-video` hoặc `--hue-blue` khi là màu ghim/minh họa. `--leaf`/`--petal` ở B khi dùng cho đúng/sai thì đưa về `--color-ok`/`--color-bad`.
- **Màu ghim không đổi theo chế độ**, vì ghim nằm trên ảnh trang in vốn luôn nền trắng (`--color-page-paper`).
- `--lh` (adabiyot5) là biến cục bộ cho từng dòng chữ dựng lại, nên chuyển thành `--page-line-h` cục bộ, không phải token toàn cục.

## Nhóm token (103 token, cộng thang chữ và preset)
`--color-*` (nền, chữ, nhấn, trạng thái) · `--hue-*` (16 sắc thái minh họa) · `--color-inverse/board/video/scrim/tr-hover/page-paper` (vùng tối cố định) · `--pin-*` (15) · `--font-display/body/reading/page/mono` · `--radius-xs…round` · `--shadow-1/2/modal/pin` · `--space-1…10` (2–24px) · `--touch-min`, `--control-h`, `--pin-size*` · `--dur-*` · `--bp-*` (chỉ để tham chiếu) · `--z-*` · `--text-xs…display`, `--lh-body`, `--text-reading`, `--lh-reading`.

## Thang chữ theo cấp tuổi (trục 7)
| Cấp | Trạng thái | body / lh | vùng chạm | Nguồn |
|---|---|---|---|---|
| 5_7 | quan_sat | 17px / 1.6 | 44px | bộ B (A 16px/1.45, C UI 15px) |
| 8_9 | quan_sat | 16px / 1.45 | 44px | kimyo8, fizika8 |
| 0_2, 3_4, 10_11, giao_vien | **duyet_d2** (đề xuất, đã duyệt) | 20 / 18 / 16 / 15px | 56 / 48 / 40 / 40px | chưa cuốn nào có |

Lưu ý: lớp 8 hiện dùng chung bộ A với lớp 5, nghĩa là **chưa cuốn nào thực sự đổi cỡ chữ theo tuổi**.

## Tương phản (WCAG, đã tính)
- Chữ chính và chữ phụ trên bề mặt: sáng 13.3 / 6.3, tối 13.6 / 8.1. Đúng/sai: ≥5.4. Nhấn blue trên surface: 4.9 (sáng), 6.5 (tối). Teal: 6.3 / 7.4.
- **Không đạt:** `--hue-purple` ở chế độ tối chỉ 2.3, vì chưa cuốn nào có giá trị tối cho màu này. Chữ trắng trên `--pin-text` (3.4) và `--pin-audio` (3.0) chỉ đạt mức dành cho đồ họa hoặc chữ đậm lớn. `--pin-active` (#F2C230) phải đi với chữ tối, như adabiyot5 đang làm.

## Đã chốt ở D2 (18/11/2026)
1. Màu ghim vở bài tập `--pin-workbook`: **#6A3FB5** (theo đề xuất bản nháp).
2. Màu ghim quiz `--pin-quiz`: **crimson #AE2548** như adabiyot5 (agent áp dụng chọn: để không trùng với ghim vở #6A3FB5; giá trị đã dùng thật ở một cuốn; chữ trắng trên nền đạt 6.6).
3. Màu nhấn riêng từng môn: **chưa đặt** (agent áp dụng chọn: giữ 2 preset `blue`/`teal`, tham số `data-accent` để mở rộng sau – không đổi giao diện 7 cuốn).
4. Cách nạp font: **tệp woff2 đi kèm artifact** + `@font-face` `font-display: swap`, luôn có font hệ thống dự phòng (agent áp dụng chọn; ghi ở `tokens.json` → `font_loading`). Không nhúng base64, không phụ thuộc Google Fonts lúc chạy.
5. Ghim nhỏ hơn vùng chạm: dùng lớp `.k-hit` (theo đề xuất).
6. Thang chữ cấp 0_2, 3_4, 10_11, giáo viên: duyệt theo đề xuất (`duyet_d2`).
7. `--hue-purple` chế độ tối: #A88BE8 (sửa tương phản 2.3 → 5.7).
8. `tokens.json → axes` dùng giá trị từ điển trục (`anh_trang_quet`, `video_hoat_hinh_dung_bang_ma`, `0-2`…, `uz/ru/vi/kaa`); thuộc tính CSS `data-age` vẫn dùng `0_2`… `kiem-tra-truc.py` nay quét cả `tokens.json`.

## Đề xuất bổ sung (chưa cuốn nào có, nên không đưa vào danh mục chính)
- Thang chữ và vùng chạm cho cấp 0_2, 3_4, 10_11, giáo viên: đã duyệt ở D2 (`duyet_d2`), cần thử với học sinh.
- ~~Giá trị tối cho `--hue-purple`~~ – đã làm ở D2: #A88BE8 (tương phản 5.7 / 6.3 / 4.9).
- Bảng màu nhấn theo từng môn (Toán, Tin, Hóa, Lý, Sinh, Văn…).
- Chế độ tương phản cao và cỡ chữ do người dùng chọn.
- Nút đổi chế độ cho 6 cuốn chưa có (hiện chỉ adabiyot5 có `#thm`).
