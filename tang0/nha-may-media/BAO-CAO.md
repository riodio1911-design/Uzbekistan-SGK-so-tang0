# BÁO CÁO M2: Nhà máy media và tổ sản xuất

**Đã làm:**
- Danh mục 13 loại `media.*`.
- Schema phiếu đặt hàng và schema biên bản giao, cả hai `$ref` sang book.schema.
- `to-san-xuat.md` (mermaid, 11 agent), `quy-tac-cache.md`, `agents/*.md` (11 file).
- `lap-phieu.py` và `_cong-cu/kiem-tra.py`.

**Kiểm tra:**
- 117 giá trị trục khớp tu-dien-truc.
- 7/7 phiếu cố ý sai bị schema chặn.
- Biên bản mẫu hợp lệ.

**Dữ liệu thật** (`nhu-cau.json` của M1):
- 6.937 phiếu, 0 lỗi schema (uz 3.232, ru 3.232, vi 473).
- Ước lượng: uz ≈504 phút, ru ≈511 phút, vi ≈70 phút, khớp M1.
- Bỏ qua 1.963 điểm hình `mo_rong`; chạy `--gom-mo-rong` sẽ ra 12.826 phiếu.
- Cả 990 phiếu adabiyot5 là câu `na=1`, tức mã chủ ý không đọc.

**Cần quyết ở D2:**
1. Ở 64 kbps, kimyo8 tăng ≈143 MB và vượt 256 MB. Đề xuất giao 32 kbps, bằng mức audio vi hiện có.
2. Có lập phiếu cho điểm `mo_rong` và câu `na=1` không.
3. Ngưỡng CER (uz 0,08; ru 0,05).
4. Chưa xác minh được hỗ trợ TTS cho `kaa`.

**Đề xuất sửa schema:**
- `$defs.clip` thêm `render_hash`: `source_hash` hiện chỉ băm văn bản.
- `media.files.kind` thêm `subtitle`.
- `glossary_entry` và `exercise_item` thêm `audio_ref`.
- Cần chỗ cho sfx không có ngôn ngữ (`zxx`).

**Trục mới đề xuất:** trục 3 `video_nguoi_dan`, trục 9 `subtitles`.

**Rủi ro:** `text_path` của M1 là đường dẫn mã cũ, nên hash còn `tam_tinh` tới khi có book.json và giọng được duyệt.
