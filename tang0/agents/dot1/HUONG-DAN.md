# Hướng dẫn đợt 1 (P0 → tầng 0 v0.10): làm đầu đọc đủ để thay 7 cuốn

`$R` = `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad`, `$T` = `$R/tang0`.

Đọc trước: `$T/agents/hop-nhat/HUONG-DAN.md` (bối cảnh), `$T/quyet-dinh/D2.md`, `$T/quyet-dinh/D3.md` (D3 = theo đề xuất), `$R/de-xuat/MUC-LUC.md` (lộ trình đợt 1) và các file đề xuất được giao cho bạn trong `$R/de-xuat/`. Đầu đọc: `$T/dau-doc/` (đọc `GHI-CHU-R1.md`, hợp đồng `window.T0` trong `$T/agents/dau-doc/HUONG-DAN.md`). Dữ liệu thật: `$R/books/<cuon>/book.json` (7 cuốn) và `tu-che.md` của từng cuốn (mục "đầu đọc thiếu" ghi rõ cái bạn phải làm).

## Mục tiêu chung đợt 1
Trên book.json thật của 7 cuốn, không còn khung "chưa hỗ trợ" nào trong phạm vi P0; bài tập chấm đúng; chạy trên điện thoại 390×844 và máy tính bảng 820×1180, không lỗi console, không cuộn ngang, vùng chạm ≥ 44px, uz/ru/vi, sáng/tối.

## Quyền sở hữu file (tránh ghi đè – bắt buộc)
| Agent | Đề xuất | Được ghi |
|---|---|---|
| A – Id & lệch | 015, 020 | `$T/schema/`, `$T/thu-vien/`, `$T/tu-dien-truc.json` (+ chạy `$T/_cong-cu/sinh-enum.py`), `$R/books/*/book.json` CHỈ phần id/series/legacy_ids và tham số sim lệch, `$R/books/*/doi-chieu.json` (chạy lại) |
| B – Cảnh & chữ | 001, 011, 012 | `$T/dau-doc/components/sim/scene_*.js` (file mới), `$T/dau-doc/components/text/` (mới: phân số, công thức), `$T/dau-doc/components/blocks.js` |
| C – Bài tập | 002, 003 | `$T/dau-doc/components/ex/*.js` (file mới; sửa file cũ nếu cần) |
| D – Trang & lõi | 008, 010 | `$T/dau-doc/core.js`, `index.html`, `build.py`, `modes/pin.js`, `modes/reading.js` (chỉ phần dùng chung để vẽ trang dựng lại) |
| E – Mô phỏng Hóa–Lý–Tin | 004, 006 | `$T/dau-doc/components/sim/` (file mới theo kind), preset screen_demo vào `$T/thu-vien/mo-phong/presets/` |
| F – Mô phỏng Toán–KHTN | 005, 007 | `$T/dau-doc/components/sim/` (file mới theo kind), `sim.legacy_embed` |
| G – Lớp học & dữ liệu cũ | 009, 014 | `$T/dau-doc/modules/classroom.js` (mới), `$T/dau-doc/modules/migrate.js` (mới), `$T/_cong-cu/chuyen-du-lieu-cu/` |

- Cần thay đổi ở file không thuộc mình → ghi yêu cầu vào `$T/dau-doc/YEU-CAU.md` (nối thêm: ai, file, cần gì, vì sao). Agent D đọc và làm phần core; A làm phần schema. Trước khi kết thúc, mỗi agent đọc YEU-CAU.md xem có yêu cầu nào gửi mình.
- Thay đổi schema chỉ do A làm; ai cần trường mới thì yêu cầu A. Sau mọi sửa schema, A chạy `bash $T/_cong-cu/kiem-tra-tat-ca.sh` phải đạt.
- Không sửa `$R/books/*/book.json` trừ A. Không publish. Không sửa `kiem-ke/`, `fix/`, `fix2/`, `khao-sat/`.

## Cách thử
- Dựng trang thử riêng trong `$T/dau-doc/_thu/<agent>/` nạp core thật + component của bạn + book.json thật (đọc từ `$R/books/<cuon>/book.json`). Ảnh/audio: tham chiếu file mẫu sẵn có trong `$R/books/<cuon>/preview/_mau/` hoặc tải thêm vài file từ artifact cũ (công cụ Artifact action "read" với `path`, url trong `$R/kiem-ke/<cuon>.json`) vào `_thu/<agent>/mau/`.
- Playwright (đã cài, `require('playwright')`): đếm số khung "chưa hỗ trợ" trước/sau trên các cuốn liên quan; tự bấm làm bài đúng và sai; chụp ảnh kiểm tra vào `_thu/<agent>/_anh/` và xem lại.
- Viết script đếm `$T/dau-doc/_thu/<agent>/dem.py|js` để người sau chạy lại.

## Đầu ra
Mã như bảng trên + `$T/dau-doc/BAO-CAO-DOT1-<A..G>.md` (≤ 250 chữ): đề xuất nào xong, số "chưa hỗ trợ" trước → sau theo cuốn, kiểm tra nào đạt (kèm ảnh), yêu cầu đã gửi/đã nhận, còn lại gì. Trả lời ngắn: file đã tạo/sửa + 5 dòng nổi bật.
