# Đợt sửa đối đẳng (Kimyo 8 làm mẫu, áp chung cho mọi cuốn)

`$R` = `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad`, `$T` = `$R/tang0`.

## Vì sao có đợt này
Chủ dự án dùng thử Kimyo 8 bản mới và thấy kém bản cũ: không có Robo, tiếng Việt khó dùng, engine nghèo hơn. Đo đối đẳng xác nhận: 54 tính năng cũ → 19 ngang, 14 kém, 18 thiếu, 3 hơn. Bảng chi tiết (ĐỌC KỸ): `$R/doi-dang/kimyo8/bang-doi-dang.csv`, `$R/doi-dang/kimyo8/BAO-CAO.md`, ảnh `_anh/<id>-<cu|moi>-<390|1280>.png`, mã cũ đã tách `$R/doi-dang/kimyo8/_tmp/`, mã cũ đầy đủ `$R/fix/kimyo8/index.html` (không Read cả file).

## Tiêu chí nghiệm thu mới (thay "không còn khung chưa hỗ trợ")
1. Mỗi dòng của bảng đối đẳng phải thành "ngang" hoặc "hơn": bản mới làm được điều bản cũ làm, với số bước ≤ bản cũ, chất lượng nhìn thấy không kém (so ảnh hai bên).
2. Mỗi cờ `features` đang bật phải có phép thử chứng minh đầu đọc dùng nó.
3. Thử ở thiết lập mặc định (không ép `?lang=`).
4. Không mục P0 nào còn lại; nhóm Robo và ngôn ngữ không còn mục "thiếu".
Đây là thành phần DÙNG CHUNG của tầng 0: làm đúng cho kimyo8 nhưng không viết cứng gì của kimyo8 (môn, lớp, tên sách, chuỗi) — mọi thứ lấy từ book.json/features.json/prompts.json, để 6 cuốn còn lại dùng được ngay.

## Quyền sở hữu file
| Agent | Mục trong bảng | Được ghi |
|---|---|---|
| R – Robo | R01–R13 (+ phần T0.tutor cần cho R05/R06) | `$T/dau-doc/components/tutor/robo.js` (mới), `components/tutor/*.css/.js`, `$T/gia-su/prompts.json` (chuỗi/tools nếu thiếu, giữ kiem-tra-loi-nhac.py đạt) |
| L – Ngôn ngữ, trình phát, lõi | L01–L07, V01, V07, V10, T01, T02 | `$T/dau-doc/core.js`, `index.html`, `build.py`, `components/sim/scene_player.js`, `components/sim/_hoa_ly_kit.js`, `components/sim/atom_shells.js`, `modules/classroom.js` (chỉ phần media T02) |
| N – Điều hướng trang | G01–G08 | `$T/dau-doc/modes/pin.js` |
| (sau khi R, L, N xong) Kiểm tra lại | toàn bảng | chạy lại `$R/doi-dang/kimyo8/_cong-cu/chay.sh` |

- R cần gì ở core (vd. truyền context trang, tools cho T0.tutor) → ghi `$T/dau-doc/YEU-CAU.md` cho L. L kiểm tra file này định kỳ và trước khi kết thúc.
- N cần gì ở core → cũng qua YEU-CAU.md cho L.
- Thay đổi schema/book.json: KHÔNG tự sửa; ghi yêu cầu (mục "→ A (schema)") trong YEU-CAU.md, mình sẽ giao.
- Mục B06 (kết quả học sinh cũ và db media của giáo viên không sang được vì bản mới ở URL khác): KHÔNG phải việc của mã — sẽ xử lý bằng cách phát hành bản mới vào chính URL cũ khi được duyệt. Không cần làm.
- Không publish, không sửa `books/`, `fix/`, `doi-dang/` (trừ thư mục thử riêng `$T/dau-doc/_thu/<R|L|N>/`).

## Cách thử
Dựng lại: `cd $T/dau-doc && python3 -I build.py --book kimyo8` (và `--book all` trước khi kết thúc để chắc không làm vỡ 6 cuốn kia; chạy `node _thu/D/dem.js` phải vẫn sạch). So với bản cũ bằng ảnh: dùng kịch bản trong `$R/doi-dang/kimyo8/_cong-cu/chay.js` làm mẫu (có thể chép vào thư mục thử của mình). AI (sample) giả lập như kịch bản đối đẳng đã làm. Chụp 390×844 và 1280×800, xem lại bằng Read, sáng/tối, uz/ru/vi.

## Đầu ra
Mã + `$T/dau-doc/BAO-CAO-DOIDANG-<R|L|N>.md` (≤ 250 chữ): mục nào đã thành ngang/hơn (kèm ảnh mới), mục nào còn kém và vì sao, yêu cầu gửi/nhận. Trả lời ngắn: file đã tạo/sửa + 5 dòng nổi bật.
