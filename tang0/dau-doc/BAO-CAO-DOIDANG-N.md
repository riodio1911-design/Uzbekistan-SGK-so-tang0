# Đối đẳng – N (điều hướng trang, `modes/pin.js`)

Thử bằng `_thu/N/thu.js` (68/68 ĐẠT, kimyo8, 390/1280, sáng/tối, uz/ru/vi, mặc định không `?lang=`). `_thu/N/chung.js`: 7 cuốn ĐẠT. `dem.js` sạch. Ảnh trong `_thu/N/_anh/`.

| Mục | Nay | Ảnh |
|---|---|---|
| G01 mục lục | **ngang+**: select chương (optgroup) + bài, lấy từ `units/lessons`, bỏ intro/summary. | G01-*.png |
| G02 chú giải + n/total | **ngang**: chân trang dính đáy lấy màu ghim có trong sách, số `20–21 / 208` | G04-1280.png |
| G03 thu nhỏ | **ngang**: nút `[data-act=thumbs]` khi `features.thumbnails`, theo bản in | G03-*.png |
| G04 ngăn dịch | **hơn**: panel cạnh (desktop) / tấm đáy (mobile), giữ mở khi lật. Ghi chú + đề bài (nút Mở, ✓) xếp theo y. Hai ngôn ngữ qua `T0.ui.bi`. Esc đóng | G04-*.png |
| G05 OCR | **ngang**: `pages[].ocr.<lang>` trong `<details>`. Khi xem bản in RU thì lên đầu và mở sẵn | G05-ru-*.png |
| G07 trải trang | **ngang+**: chẵn trái/lẻ phải (4–5, trang 1 một mình bên phải), như bản cũ | |
| G08 #pN | **ngang**: đọc `#p37`/`#wb-p12` và `hashchange`. Ghi URL khi lật, bỏ `?page` | |
| L02/L04 | bong bóng và thuật ngữ dùng `T0.ui.bi`; nút dùng `T0.tUI`; modal video có tiêu đề `▶ tên video` | bar-tUI-*.png |

Cờ `thumbnails/translation_drawer/print_edition_switch/deep_link` có phép thử bật/tắt.

**Còn lại**: kịch bản đối đẳng F06 (`chay.js`) đếm thu nhỏ mà không bấm nút. Cần thêm `click('.pm-bar [data-act=thumbs]')`. F05 chọn nút theo aria-label một ngôn ngữ, nay là nhãn kép, nên đổi sang `[data-act=drawer]`. Thanh công cụ ở 390 px cao 3 hàng (bản cũ 4 hàng).

**Yêu cầu**: N → L (boot chọn `pin` khi có `#pN`; pin.js đang làm tạm), N → R (`T0.pageNav`, `t0:page`). Đã ghi trong YEU-CAU.md.
