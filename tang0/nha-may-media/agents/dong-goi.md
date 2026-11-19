# Hướng dẫn agent Đóng gói (tổ của cuốn)

## Bối cảnh chung
Dự án chuyển sách giáo khoa K12 Uzbekistan thành sách số. Mỗi cuốn có một tổ sản xuất media; các cuốn gửi phiếu cho một nhà máy media dùng chung. Đọc trước `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/to-san-xuat.md` (mục của vai này) và `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/quy-tac-cache.md`.
Hợp đồng: `phieu-dat-hang.schema.json` (phiếu), `ket-qua.schema.json` (biên bản), `danh-muc-loai-media.json` (loại hàng), kiểu dữ liệu chung ở `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/schema/book.schema.json`.

## Quy tắc chung
- Chỉ ghi vào thư mục được giao. Không publish, không sửa artifact. Chỉ gọi API ngoài khi phiên được phép và phiếu đã `hash_status=chot`.
- Mỗi lần đổi trạng thái phiếu: thêm một dòng `history` {status, at, by:"agent:<vai>", note} rồi kiểm tra lại bằng jsonschema (Draft 2020-12, registry gồm book.schema).
- Không bịa số. Ước lượng thì ghi "ước lượng" kèm công thức.
- Tài liệu viết tiếng Việt; khóa máy dùng tiếng Anh snake_case.

## Việc
Đưa kết quả đã đạt vào cuốn: đề xuất bản cập nhật book.json và cây file, giữ dung lượng dưới giới hạn.

## Đầu vào
Biên bản `dat`/`giao`, kho nhà máy, book.json, danh sách file hiện có của artifact (công cụ Artifact action "list", scope "files" – chỉ đọc), `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/kiem-ke/<cuon>.json` (kich_thuoc).

## Quy tắc
- Ước lượng tổng MB = hiện có − file sẽ gỡ + file mới. Audio giao cố định 64 kbps (D2, không hạ bitrate). Vượt 230 MB thì lần lượt: (1) chuyển ảnh trang của bản in thứ hai (`pages_ru/` khi bản gốc là uz) sang **artifact đồng hành**, khai báo `book.asset_sources.<nguồn>` (kind `companion_artifact`) và đổi đường dẫn thành `@<nguồn>/pages_ru/…`; (2) gỡ file thừa; (3) vẫn vượt 256 MB thì báo người.
- Mỗi asset ≤ 20 MB (nhà máy dùng trần 18 MiB).
- Ghi `media.clips[id][lang]` (từ `ket-qua.clips`), `media.files[]` với `source_hash`, `bytes`, `voice:"tts"`; đặt `fallback_tts=false` khi mọi clip của ngôn ngữ đã có.
- Liệt kê file mồ côi để gỡ (ví dụ `audio/` của tabiiy5, 158 file `audio/` gốc của adabiyot5, fx của biologiya5 nếu vẫn chưa nối).
- KHÔNG publish. Giao gói đề xuất cho người hoặc điều phối dự án.

## Xong khi
Mọi `audio_ref` trỏ tới clip có file; mọi đường dẫn `@<nguồn>/` có trong `asset_sources`; tổng mỗi artifact (chính và đồng hành) ≤ 256 MB; 0 file mồ côi; báo cáo dung lượng trước/sau.
