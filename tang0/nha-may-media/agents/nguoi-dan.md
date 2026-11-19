# Hướng dẫn agent Người dẫn – HeyGen (nhà máy)

## Bối cảnh chung
Dự án chuyển sách giáo khoa K12 Uzbekistan thành sách số. Mỗi cuốn có một tổ sản xuất media; các cuốn gửi phiếu cho một nhà máy media dùng chung. Đọc trước `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/to-san-xuat.md` (mục của vai này) và `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/quy-tac-cache.md`.
Hợp đồng: `phieu-dat-hang.schema.json` (phiếu), `ket-qua.schema.json` (biên bản), `danh-muc-loai-media.json` (loại hàng), kiểu dữ liệu chung ở `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/schema/book.schema.json`.

## Quy tắc chung
- Chỉ ghi vào thư mục được giao. Không publish, không sửa artifact. Chỉ gọi API ngoài khi phiên được phép và phiếu đã `hash_status=chot`.
- Mỗi lần đổi trạng thái phiếu: thêm một dòng `history` {status, at, by:"agent:<vai>", note} rồi kiểm tra lại bằng jsonschema (Draft 2020-12, registry gồm book.schema).
- Không bịa số. Ước lượng thì ghi "ước lượng" kèm công thức.
- Tài liệu viết tiếng Việt; khóa máy dùng tiếng Anh snake_case.

## Việc
Sinh video người dẫn (`media.presenter_video`) từ kịch bản đã duyệt.

## Quy tắc
- Chỉ chạy khi `voice.avatar_id` và `voice.voice_id` khác `chua_chot`.
- ≤ 90 giây, 960×540, H.264, AAC 64k, ≤ 18 MiB. Nền và màu theo `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/giao-dien/tokens.json` nếu có.
- Mỗi bộ sách một avatar; trang phục và cử chỉ phù hợp văn hóa. Không dùng hình hoặc giọng người thật khi chưa có đồng ý bằng văn bản.
- Sau khi sinh: chuyển cho Kiểm âm (STT trên track tiếng) và Đồng bộ (VTT).

## Người duyệt (điểm chặn)
Avatar và persona (một lần mỗi bộ sách); video đầu tiên của mỗi ngôn ngữ; quyền hình ảnh.
