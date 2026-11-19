# Hướng dẫn bước ④ Di chuyển (tầng 0 v0.9.0 – D2 đã chốt)

Đọc trước: `$T/agents/hop-nhat/HUONG-DAN.md` (bối cảnh, quy ước), `$T/quyet-dinh/D2.md` (quyết định D2 – bắt buộc theo), `$T/CHANGELOG.md`.
`$R` = `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad`, `$T` = `$R/tang0`. Bạn chuyển MỘT cuốn.

## Đầu vào
- Cuốn cũ: mã HTML (`$R/fix2/tabiiy5|adabiyot5/index.html`, còn lại `$R/fix/<cuon>/index.html`; không Read cả file — chạy script bằng `python3 -I`/node; có thể tái dùng `$T/tri-thuc/_scripts/dump.js` để chạy script của sách trong vm với DOM giả và lấy dữ liệu thật), bản kiểm kê `$R/kiem-ke/<cuon>.json`, danh sách file của artifact cũ (công cụ Artifact action "list", scope "files", url trong kiem-ke json — chỉ đọc).
- Tầng 0 v0.9.0: `$T/schema/` (book.schema.json, features.schema.json, `vi-du/<cuon>.*` và `_tools/make_trich.py`, `make_features.py` — điểm xuất phát tốt), `$T/thu-vien/bai-tap|mo-phong/` (bang-anh-xa.csv cho biết mã gốc → `ex.*`/`sim.*`), `$T/gia-su/`, `$T/tri-thuc/`, `$T/tu-dien-truc.json`, `$T/nha-may-media/` (clip id, `kiem-ke/nhu-cau.json`), `$T/dau-doc/` (đầu đọc dùng chung).

## Đầu ra (chỉ ghi trong `$R/books/<cuon>/`)
1. `book.json`: TOÀN BỘ cuốn theo book.schema.json — mọi trang, vùng dịch, ghim, bài/khối, bài tập (đáp án, lời giải), hình khám phá, video cảnh (`sim.*` + tham số), media clips (đường dẫn file của artifact cũ, giữ nguyên tên file để bước publish chép server-side), thuật ngữ, dữ liệu giáo viên. Id phải BỀN (theo quy tắc id trong D2/schema), kèm `legacy_id` nếu khác mã cũ.
2. `features.json`: hồ sơ 9 trục + lớp bật + capabilities, hợp lệ features.schema.json, giá trị trục từ tu-dien-truc.json.
3. `tu-che.md`: mọi thứ của cuốn cũ mà tầng 0 chưa biểu diễn được (dạng bài, mô phỏng, khối, tính năng…), mỗi mục: mô tả, vị trí trong mã cũ, số lượng, cách tạm xử lý trong book.json (chỗ trống có đánh dấu `"_tu_che": "<mã mục>"`), đề xuất cho tầng 0. KHÔNG tự chế thành phần mới trong tầng 0.
4. `doi-chieu.json`: số đếm cũ vs mới: trang, vùng dịch, ghim, bài tập (theo dạng), đáp án, hình/điểm hình, cảnh video, clip audio theo ngôn ngữ, thuật ngữ; mỗi dòng có `cu`, `moi`, `tu_che`, `lech` (cu − moi − tu_che phải = 0, nếu không thì giải thích).
5. `preview/`: dựng đầu đọc với cuốn đầy đủ: chép `$T/dau-doc/` sang `preview/src/` (không sửa bản gốc), thêm dữ liệu cuốn của bạn, chạy build để có `preview/dist/index.html` chỉ chứa cuốn của bạn; liệt kê file phụ cần cho bản xem trước trong `preview/dist/files.json` dưới dạng tham chiếu file của artifact cũ (`{"artifact": "<url cũ>", "path": "<đường dẫn cũ>"}`) — KHÔNG tải hàng trăm ảnh về; chỉ tải về `preview/_mau/` vài file để tự chụp kiểm tra.
   Nếu đầu đọc thiếu renderer cho dạng bài/mô phỏng của cuốn, nó hiện "chưa hỗ trợ" — ghi vào `tu-che.md` mục "đầu đọc thiếu", không viết lại core.
6. `BAO-CAO.md` (≤ 250 chữ): đạt/chưa đạt "Xong khi", số liệu đối chiếu, chỗ tự chế, rủi ro.

## Kiểm tra trước khi báo xong
- book.json và features.json hợp lệ (jsonschema 2020-12; xem cách `$T/schema/kiem-tra.py` nạp schema).
- Mọi `ex.*`/`sim.*` có trong thư viện; mọi giá trị trục có trong tu-dien-truc.json; mọi `pins[].ref` trỏ tới mục có thật.
- Gia sư: chạy `python3 -I $T/gia-su/kiem-tra-loi-nhac.py` theo cách README của nó cho phép với profile của cuốn (hoặc điền thử prompts.json bằng profile) – 0 lỗi.
- Playwright (đã cài, `require('playwright')`): mở preview, chụp ít nhất 3 trang/bài ở 390×844 với các file mẫu đã tải, không lỗi console, không cuộn ngang. Lưu `preview/_anh/`.

## Xong khi
Toàn bộ trang, bài tập, media của cuốn cũ có trong book.json hoặc trong tu-che.md (doi-chieu lệch = 0), các kiểm tra trên đạt.

Quy tắc: chỉ đọc mọi thứ ngoài `$R/books/<cuon>/`; không publish, không sửa artifact, không sửa tầng 0. Trả lời ngắn: file đã tạo + 5 dòng nổi bật.
