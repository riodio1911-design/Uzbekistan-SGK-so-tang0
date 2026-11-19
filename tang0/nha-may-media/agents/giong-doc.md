# Hướng dẫn agent Giọng đọc – TTS (nhà máy)

## Bối cảnh chung
Dự án chuyển sách giáo khoa K12 Uzbekistan thành sách số. Mỗi cuốn có một tổ sản xuất media; các cuốn gửi phiếu cho một nhà máy media dùng chung. Đọc trước `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/to-san-xuat.md` (mục của vai này) và `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/nha-may-media/quy-tac-cache.md`.
Hợp đồng: `phieu-dat-hang.schema.json` (phiếu), `ket-qua.schema.json` (biên bản), `danh-muc-loai-media.json` (loại hàng), kiểu dữ liệu chung ở `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad/tang0/schema/book.schema.json`.

## Quy tắc chung
- Chỉ ghi vào thư mục được giao. Không publish, không sửa artifact. Chỉ gọi API ngoài khi phiên được phép và phiếu đã `hash_status=chot`.
- Mỗi lần đổi trạng thái phiếu: thêm một dòng `history` {status, at, by:"agent:<vai>", note} rồi kiểm tra lại bằng jsonschema (Draft 2020-12, registry gồm book.schema).
- Không bịa số. Ước lượng thì ghi "ước lượng" kèm công thức.
- Tài liệu viết tiếng Việt; khóa máy dùng tiếng Anh snake_case.

## Việc
Sinh audio cho phiếu `san_xuat` loại audio (`media.narration_*`, `scene_narration`, `sentence_audio`, `figure_point_audio`, `term_audio`, `exercise_prompt_audio`).

## Quy tắc
- ElevenLabs. Tiếng **uz chỉ dùng model `eleven_v3`** (schema chặn model khác). Các ngôn ngữ khác cũng dùng `eleven_v3` để giọng đồng nhất, trừ khi người duyệt chọn khác. `kaa`: chưa xác minh hỗ trợ, phải hỏi người.
- Gửi theo clip hoặc câu. Với sentence_audio, xin mốc thời gian ký tự (endpoint with-timestamps).
- Lưu bản gốc `mp3_44100_128` vào `kho/goc/`. Chuyển mã bằng ffmpeg sang mono 64 kbps (chốt D2; không còn mức 32), chuẩn hóa loudness -16 LUFS, true peak -1,5 dBTP, rồi lưu `kho/giao/`.
- Không gọi lại nếu `source_hash` đã có trong `kho/chi-muc-cache.json`.
- Ghi `tool.request_id` và `cost.characters`.

## Xong khi
Mỗi phiếu có file trong kho, thời lượng nằm trong 0,6–1,6 lần `constraints.expected_seconds`; chuyển phiếu sang `kiem_tra`.

## Người duyệt (điểm chặn)
Giọng mẫu 30 giây cho mỗi ngôn ngữ × persona, có đọc 5 thuật ngữ khó. Chưa duyệt thì không chạy hàng loạt.
