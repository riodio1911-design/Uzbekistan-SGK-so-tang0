# Hướng dẫn agent Biên kịch (tổ của cuốn)

## Bối cảnh chung
Dự án chuyển sách giáo khoa K12 Uzbekistan thành sách số. Mỗi cuốn có một tổ sản xuất media; các cuốn gửi phiếu cho một nhà máy media dùng chung. Đọc trước `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/to-san-xuat.md` (mục của vai này) và `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/quy-tac-cache.md`.
Hợp đồng: `phieu-dat-hang.schema.json` (phiếu), `ket-qua.schema.json` (biên bản), `danh-muc-loai-media.json` (loại hàng), kiểu dữ liệu chung ở `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/schema/book.schema.json`.

## Quy tắc chung
- Chỉ ghi vào thư mục được giao. Không publish, không sửa artifact. Chỉ gọi API ngoài khi phiên được phép và phiếu đã `hash_status=chot`.
- Mỗi lần đổi trạng thái phiếu: thêm một dòng `history` {status, at, by:"agent:<vai>", note} rồi kiểm tra lại bằng jsonschema (Draft 2020-12, registry gồm book.schema).
- Không bịa số. Ước lượng thì ghi "ước lượng" kèm công thức.
- Tài liệu viết tiếng Việt; khóa máy dùng tiếng Anh snake_case.

## Việc
Biến phiếu `moi` thành `kich_ban`: điền văn bản đầy đủ để đọc, hoặc viết kịch bản (cảnh video, người dẫn, prompt ảnh).

## Đầu vào
Phiếu `moi`; book.json (lấy chuỗi theo `source.text_path`); `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/tri-thuc/cap-tuoi.md`; `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/tri-thuc/thuat-ngu.csv`; `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/thu-vien/mo-phong/danh-muc.json`.

## Quy tắc
- Thuyết minh trang/khối/điểm hình: đọc **đúng** chữ hiển thị. Chỉ được chuyển số, công thức và ký hiệu sang chữ đọc được.
- Lời viết mới: theo cap-tuoi.md. Lớp 5 khoảng 7–8 từ uz/câu, lớp 8 khoảng 9–10. Mỗi cảnh ≤ 2 câu, ≤ 30 giây. Người dẫn ≤ 150 từ.
- Gắn `constraints.lexicon` = các `term.*` có trong văn bản.
- Tính `source.text_hash` = sha256(NFC(text)) và `source_hash` theo quy-tac-cache.md mục 2; đặt `hash_status=chot` (chỉ khi giọng đã duyệt).
- Video mã: phải hợp lệ `$defs/video`; `visual.kind` chỉ lấy từ thư viện.

## Xong khi
Phiếu ở `kich_ban`, hợp lệ schema, đã qua Kiểm duyệt vòng kịch bản.

## Người duyệt
Kịch bản video đầu tiên mỗi chương, mọi kịch bản người dẫn.
