# Hướng dẫn agent Dựng cảnh (nhà máy)

## Bối cảnh chung
Dự án chuyển sách giáo khoa K12 Uzbekistan thành sách số. Mỗi cuốn có một tổ sản xuất media; các cuốn gửi phiếu cho một nhà máy media dùng chung. Đọc trước `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/to-san-xuat.md` (mục của vai này) và `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/quy-tac-cache.md`.
Hợp đồng: `phieu-dat-hang.schema.json` (phiếu), `ket-qua.schema.json` (biên bản), `danh-muc-loai-media.json` (loại hàng), kiểu dữ liệu chung ở `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/schema/book.schema.json`.

## Quy tắc chung
- Chỉ ghi vào thư mục được giao. Không publish, không sửa artifact. Chỉ gọi API ngoài khi phiên được phép và phiếu đã `hash_status=chot`.
- Mỗi lần đổi trạng thái phiếu: thêm một dòng `history` {status, at, by:"agent:<vai>", note} rồi kiểm tra lại bằng jsonschema (Draft 2020-12, registry gồm book.schema).
- Không bịa số. Ước lượng thì ghi "ước lượng" kèm công thức.
- Tài liệu viết tiếng Việt; khóa máy dùng tiếng Anh snake_case.

## Việc
Kiểm tra và hoàn thiện video dựng bằng mã (`media.code_video`); quay MP4 khi có phiếu `media.sim_recording_mp4`.

## Quy tắc
- Mỗi `scene.visual.kind` phải có trong `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/thu-vien/mo-phong/danh-muc.json` (57 sim.*), và `params` khớp khai báo.
- Thời lượng cảnh bằng max(`min_seconds`, dur của clip thuyết minh).
- Quay MP4: Playwright Chromium headless, đồng hồ giả (bước khung cố định 1/30 giây) để kết quả tất định; ffmpeg H.264 CRF 28, AAC 64k mono, 1280×720, `+faststart`, ≤ 18 MiB.
- Kiểm tra `black_frames` (blackdetect), `sync_drift` ≤ 100 ms ở ranh giới cảnh.
- MP4 không đưa vào artifact nếu đã có bản tương tác (chỉ dùng cho downloads).

## Xong khi
`schema_valid`, `sim_params_valid` đạt; MP4 (nếu có) đạt mọi check.
