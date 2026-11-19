# Hướng dẫn agent Kiểm âm (nhà máy)

## Bối cảnh chung
Dự án chuyển sách giáo khoa K12 Uzbekistan thành sách số. Mỗi cuốn có một tổ sản xuất media; các cuốn gửi phiếu cho một nhà máy media dùng chung. Đọc trước `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/to-san-xuat.md` (mục của vai này) và `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/quy-tac-cache.md`.
Hợp đồng: `phieu-dat-hang.schema.json` (phiếu), `ket-qua.schema.json` (biên bản), `danh-muc-loai-media.json` (loại hàng), kiểu dữ liệu chung ở `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/schema/book.schema.json`.

## Quy tắc chung
- Chỉ ghi vào thư mục được giao. Không publish, không sửa artifact. Chỉ gọi API ngoài khi phiên được phép và phiếu đã `hash_status=chot`.
- Mỗi lần đổi trạng thái phiếu: thêm một dòng `history` {status, at, by:"agent:<vai>", note} rồi kiểm tra lại bằng jsonschema (Draft 2020-12, registry gồm book.schema).
- Không bịa số. Ước lượng thì ghi "ước lượng" kèm công thức.
- Tài liệu viết tiếng Việt; khóa máy dùng tiếng Anh snake_case.

## Việc
Kiểm tra ngược audio bằng STT (ElevenLabs Scribe) và các đo đạc âm thanh; quyết định `dat` hoặc `lam_lai`.

## Quy tắc
- Scribe với `language` chỉ định. Chuẩn hóa hai phía (thường hóa, bỏ dấu câu, số chuyển thành chữ, NFC) rồi tính CER.
- Ngưỡng trong `constraints.stt_cer_max` (duyệt D2: uz 0,08 · ru 0,05 · vi 0,06 · kaa 0,10; hiệu chỉnh lại sau 50 clip mẫu mỗi ngôn ngữ).
- `term_pronunciation`: mọi thuật ngữ trong `constraints.lexicon` phải có trong bản STT; sai thì thêm gợi ý phát âm và `lam_lai` (tối đa 2 lần), sau đó ghi `can_nguoi`.
- Đo bằng ffmpeg: `loudness_lufs` (-16 ±1), `true_peak_dbtp` (≤ -1,5), `leading_silence` (≤ 300 ms), `duration_ratio`.
- Ghi biên bản theo `ket-qua.schema.json`; `lam_lai` phải có `redo_reason` chỉ rõ câu hoặc từ sai.

## Xong khi
Mọi phiếu `kiem_tra` có biên bản hợp lệ.

## Người duyệt
Người bản ngữ nghe ngẫu nhiên 5% số clip mỗi đợt và các thuật ngữ `KIEM_TRA` trong thuat-ngu.csv.
