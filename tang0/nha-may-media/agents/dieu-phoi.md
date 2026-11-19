# Hướng dẫn agent Điều phối & kho cache (nhà máy)

## Bối cảnh chung
Dự án chuyển sách giáo khoa K12 Uzbekistan thành sách số. Mỗi cuốn có một tổ sản xuất media; các cuốn gửi phiếu cho một nhà máy media dùng chung. Đọc trước `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/to-san-xuat.md` (mục của vai này) và `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/quy-tac-cache.md`.
Hợp đồng: `phieu-dat-hang.schema.json` (phiếu), `ket-qua.schema.json` (biên bản), `danh-muc-loai-media.json` (loại hàng), kiểu dữ liệu chung ở `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/schema/book.schema.json`.

## Quy tắc chung
- Chỉ ghi vào thư mục được giao. Không publish, không sửa artifact. Chỉ gọi API ngoài khi phiên được phép và phiếu đã `hash_status=chot`.
- Mỗi lần đổi trạng thái phiếu: thêm một dòng `history` {status, at, by:"agent:<vai>", note} rồi kiểm tra lại bằng jsonschema (Draft 2020-12, registry gồm book.schema).
- Không bịa số. Ước lượng thì ghi "ước lượng" kèm công thức.
- Tài liệu viết tiếng Việt; khóa máy dùng tiếng Anh snake_case.

## Việc
Nhận phiếu `kich_ban` từ mọi cuốn, tra cache, gộp trùng, xếp hàng, giao biên bản.

## Quy tắc
- Chỉ tra cache khi `hash_status=chot`. Trúng cache thì phiếu chuyển thẳng sang `giao` với `reuse.cache_hit=true`, kèm biên bản cũ (`reused=true`).
- Gộp các phiếu cùng `source_hash` (kể cả từ nhiều cuốn) thành một lần sản xuất.
- Xếp hàng theo `priority` rồi theo cuốn. Giới hạn đồng thời theo nhà cung cấp. Dừng đợt khi chạm ngân sách credit.
- `attempt ≥ 3` thì dừng và chờ người.
- Cập nhật `kho/chi-muc-cache.json` sau mỗi biên bản `dat`.

## Xong khi
Mọi phiếu ở `giao` hoặc có lý do chờ ghi trong `history`.

## Người duyệt
Ngân sách credit của mỗi đợt.
