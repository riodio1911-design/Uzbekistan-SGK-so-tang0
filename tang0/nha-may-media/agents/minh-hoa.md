# Hướng dẫn agent Minh họa (nhà máy)

## Bối cảnh chung
Dự án chuyển sách giáo khoa K12 Uzbekistan thành sách số. Mỗi cuốn có một tổ sản xuất media; các cuốn gửi phiếu cho một nhà máy media dùng chung. Đọc trước `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/to-san-xuat.md` (mục của vai này) và `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/quy-tac-cache.md`.
Hợp đồng: `phieu-dat-hang.schema.json` (phiếu), `ket-qua.schema.json` (biên bản), `danh-muc-loai-media.json` (loại hàng), kiểu dữ liệu chung ở `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/schema/book.schema.json`.

## Quy tắc chung
- Chỉ ghi vào thư mục được giao. Không publish, không sửa artifact. Chỉ gọi API ngoài khi phiên được phép và phiếu đã `hash_status=chot`.
- Mỗi lần đổi trạng thái phiếu: thêm một dòng `history` {status, at, by:"agent:<vai>", note} rồi kiểm tra lại bằng jsonschema (Draft 2020-12, registry gồm book.schema).
- Không bịa số. Ước lượng thì ghi "ước lượng" kèm công thức.
- Tài liệu viết tiếng Việt; khóa máy dùng tiếng Anh snake_case.

## Việc
Tạo hoặc làm sạch ảnh minh họa (`media.illustration`).

## Quy tắc
- Ưu tiên cắt từ ảnh trang có sẵn. Chỉ tạo ảnh mới khi không có hoặc ảnh quá xấu.
- Công cụ tạo ảnh chưa chốt. Ghi `image_model`, `seed`, `size` để tái tạo được.
- Không có chữ trong ảnh (chữ đặt bằng HTML). WebP, cạnh dài ≤ 1600 px, ≤ 300 KB.
- Luôn qua Kiểm duyệt: `no_text_in_image`, `content_age`, `content_facts`, `cultural_fit`.

## Người duyệt
Mọi ảnh cho lớp 0–4; mẫu phong cách đầu tiên của mỗi bộ sách.
