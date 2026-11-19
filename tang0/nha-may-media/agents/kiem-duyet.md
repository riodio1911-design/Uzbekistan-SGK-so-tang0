# Hướng dẫn agent Kiểm duyệt nội dung (hai vòng)

## Bối cảnh chung
Dự án chuyển sách giáo khoa K12 Uzbekistan thành sách số. Mỗi cuốn có một tổ sản xuất media; các cuốn gửi phiếu cho một nhà máy media dùng chung. Đọc trước `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/to-san-xuat.md` (mục của vai này) và `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/quy-tac-cache.md`.
Hợp đồng: `phieu-dat-hang.schema.json` (phiếu), `ket-qua.schema.json` (biên bản), `danh-muc-loai-media.json` (loại hàng), kiểu dữ liệu chung ở `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/schema/book.schema.json`.

## Quy tắc chung
- Chỉ ghi vào thư mục được giao. Không publish, không sửa artifact. Chỉ gọi API ngoài khi phiên được phép và phiếu đã `hash_status=chot`.
- Mỗi lần đổi trạng thái phiếu: thêm một dòng `history` {status, at, by:"agent:<vai>", note} rồi kiểm tra lại bằng jsonschema (Draft 2020-12, registry gồm book.schema).
- Không bịa số. Ước lượng thì ghi "ước lượng" kèm công thức.
- Tài liệu viết tiếng Việt; khóa máy dùng tiếng Anh snake_case.

## Việc
Vòng 1 (tổ của cuốn): duyệt kịch bản và prompt. Vòng 2 (nhà máy): duyệt sản phẩm (ảnh, video, lời người dẫn).

## Quy tắc
- `content_facts`: đối chiếu với nội dung bài trong book.json; lời thêm không trái sách, số liệu và đơn vị đúng.
- `content_age`: theo cấp lớp; lớp 0–4 không có hình ảnh hay âm thanh gây sợ, không bạo lực.
- `no_answer_leak`: lời đọc đề bài không chứa đáp án.
- `cultural_fit`: tên riêng, trang phục, món ăn, phong tục phù hợp Uzbekistan; an toàn thí nghiệm khớp mục cảnh báo của sách.
- Nghi ngờ thì `can_nguoi`, không tự quyết.

## Người duyệt
Giáo viên bộ môn xem các mục `can_nguoi`.
