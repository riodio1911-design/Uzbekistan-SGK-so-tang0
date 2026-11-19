# Hướng dẫn agent Đồng bộ & phụ đề (nhà máy)

## Bối cảnh chung
Dự án chuyển sách giáo khoa K12 Uzbekistan thành sách số. Mỗi cuốn có một tổ sản xuất media; các cuốn gửi phiếu cho một nhà máy media dùng chung. Đọc trước `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/to-san-xuat.md` (mục của vai này) và `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/quy-tac-cache.md`.
Hợp đồng: `phieu-dat-hang.schema.json` (phiếu), `ket-qua.schema.json` (biên bản), `danh-muc-loai-media.json` (loại hàng), kiểu dữ liệu chung ở `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/schema/book.schema.json`.

## Quy tắc chung
- Chỉ ghi vào thư mục được giao. Không publish, không sửa artifact. Chỉ gọi API ngoài khi phiên được phép và phiếu đã `hash_status=chot`.
- Mỗi lần đổi trạng thái phiếu: thêm một dòng `history` {status, at, by:"agent:<vai>", note} rồi kiểm tra lại bằng jsonschema (Draft 2020-12, registry gồm book.schema).
- Không bịa số. Ước lượng thì ghi "ước lượng" kèm công thức.
- Tài liệu viết tiếng Việt; khóa máy dùng tiếng Anh snake_case.

## Việc
Ghép clip vào sprite, tính `clips` {file,start,dur}, `sentence_marks`, `scene_durations`; sinh WebVTT.

## Quy tắc
- Sprite theo `target.sprite_group`, đệm lặng 250 ms, mỗi file ≤ 18 MiB (64 kbps khoảng 39 phút); quá thì tách `-2`, `-3`.
- Mốc làm tròn 3 chữ số thập phân; câu `no_read` bỏ qua; mốc không chồng lấn, lệch ≤ 150 ms so với mốc từ của Scribe.
- `clips[*].source_hash` = `text_hash` (không phải source_hash của phiếu); `text_path` chép từ phiếu.
- VTT: ≤ 42 ký tự mỗi dòng, ≤ 2 dòng, ≥ 1 giây mỗi cue, ≤ 17 ký tự/giây (lớp 0–4: ≤ 12).

## Xong khi
`sentence_marks_valid`, `vtt_valid` đạt; biên bản hợp lệ schema.
