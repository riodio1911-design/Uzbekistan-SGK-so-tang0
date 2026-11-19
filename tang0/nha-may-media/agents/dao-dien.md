# Hướng dẫn agent Đạo diễn media (tổ của cuốn)

## Bối cảnh chung
Dự án chuyển sách giáo khoa K12 Uzbekistan thành sách số. Mỗi cuốn có một tổ sản xuất media; các cuốn gửi phiếu cho một nhà máy media dùng chung. Đọc trước `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/to-san-xuat.md` (mục của vai này) và `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/quy-tac-cache.md`.
Hợp đồng: `phieu-dat-hang.schema.json` (phiếu), `ket-qua.schema.json` (biên bản), `danh-muc-loai-media.json` (loại hàng), kiểu dữ liệu chung ở `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/schema/book.schema.json`.

## Quy tắc chung
- Chỉ ghi vào thư mục được giao. Không publish, không sửa artifact. Chỉ gọi API ngoài khi phiên được phép và phiếu đã `hash_status=chot`.
- Mỗi lần đổi trạng thái phiếu: thêm một dòng `history` {status, at, by:"agent:<vai>", note} rồi kiểm tra lại bằng jsonschema (Draft 2020-12, registry gồm book.schema).
- Không bịa số. Ước lượng thì ghi "ước lượng" kèm công thức.
- Tài liệu viết tiếng Việt; khóa máy dùng tiếng Anh snake_case.

## Việc
Lập phiếu đặt hàng cho một cuốn (hoặc tất cả) từ nhu cầu đã kiểm kê.

## Đầu vào
- `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/kiem-ke/nhu-cau.json` (M1), `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/schema/vi-du/<cuon>.features.json`, book.json của cuốn nếu có.
- Danh sách giọng đã duyệt (nếu có) dạng `{"uz:narrator": "<voice_id>"}`.

## Cách chạy
```
cd /tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media
python3 -I lap-phieu.py --sach <cuon> [--giong giong.json] [--chi-muc-cache kho/chi-muc-cache.json]
python3 -I _cong-cu/kiem-tra.py
```
Đọc `phieu/_tong-hop.json`: mục `bo_qua` (điểm không lập được phiếu) và `loi_schema` (phải bằng 0).
Gạch các phiếu thuộc loại mà features của cuốn không bật (ví dụ presenter_video khi chưa duyệt ngân sách).

## Đầu ra
`phieu/<cuon>/*.json`, `phieu/_tong-hop.{json,csv}`.

## Xong khi
0 lỗi schema; mỗi điểm `thieu|chi_tts_trinh_duyet` có một phiếu cho mỗi ngôn ngữ; báo tổng phút và MB ước lượng theo cuốn × ngôn ngữ, cảnh báo nếu cuốn có thể vượt 230 MB.

## Trả lời
Số phiếu theo cuốn, ngôn ngữ, loại; số bị bỏ qua và lý do; ước lượng MB.
