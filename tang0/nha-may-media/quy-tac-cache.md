# Quy tắc cache, đặt tên và tái dùng (v0.9 nháp)

## 1. Hai mức hash

| Tên | Tính trên | Ở đâu | Dùng để |
|---|---|---|---|
| `text_hash` | Riêng chuỗi nguồn: UTF-8, chuẩn hóa NFC, giữ nguyên khoảng trắng | `media.clips[id][lang].source_hash` trong book.json (giống book.schema hiện tại) và `phieu.source.text_hash` | Biết chữ trong sách đã đổi so với audio, tức audio đã cũ |
| `source_hash` | Mọi đầu vào ảnh hưởng tới kết quả (bảng mục 2) | `phieu.source_hash`, `ket-qua.source_hash`, `media.files[].source_hash` | Khóa cache của nhà máy |

Đã kiểm tra: `text_hash` của `t4-s0/vi` trong `schema/vi-du/kimyo8.book-trich.json` khớp với sha256(NFC(chuỗi)). Hai mức hash cùng định dạng `sha256:<64 hex>`.

## 2. Cách tính `source_hash`

```
source_hash = "sha256:" + sha256( NFC( JSON.canonical(hash_input) ) )
JSON.canonical = sort_keys, separators (",",":"), ensure_ascii=False
```

`hash_input` theo loại (danh sách chuẩn ở trường `hash_inputs` của `danh-muc-loai-media.json`, ghi lại trong phiếu):

| Loại | Gồm |
|---|---|
| audio (narration_*, scene_narration, figure_point_audio, exercise_prompt_audio) | media_type, lang, text_hash, voice {provider, model, voice_id, settings}, format_profile, lexicon_version, pipeline_version |
| sentence_audio | như trên, nhưng `text_hash` thay bằng hash của mảng `[[sentence_id, text], ...]` (đổi cách ngắt câu thì làm lại) |
| term_audio | term_id, text_hash, lang, voice, pronunciation_hint, format_profile, pipeline_version. **Không có book**, nên dùng chung được giữa các cuốn |
| code_video | JSON chuẩn của video (bỏ `audio_ref`), sim_library_version, pipeline_version |
| sim_recording_mp4 | JSON video, sim_library_version, danh sách `source_hash` của clip thuyết minh theo lang, render_profile |
| presenter_video | script, lang, avatar_id, voice_id, cài đặt HeyGen, render_profile |
| illustration | prompt, style_ref_hash, image_model, seed, size |
| sfx | prompt, duration, model, seed, format_profile |
| subtitles | text_hash, hash của nguồn mốc thời gian, quy tắc dòng |

Những thứ **không** đưa vào hash: book, item_id, priority, persona (chỉ là nhãn vai; voice_id mới quyết định giọng), thời điểm. Nhờ vậy cùng một câu với cùng một giọng ở hai cuốn sẽ trúng cùng một cache.

`hash_status`:
- `tam_tinh`: chưa có văn bản đầy đủ (kiểm kê chỉ cho 80 ký tự đầu) hoặc giọng còn `chua_chot`. Hash lúc này chỉ để theo dõi, **không tra cache**.
- `chot`: Biên kịch đã điền văn bản đầy đủ và giọng đã duyệt.

## 3. Khi nào làm lại

| Thay đổi | Làm lại? |
|---|---|
| Chữ nguồn đổi (`text_hash` lệch), kể cả dấu câu | Có (dấu câu ảnh hưởng ngữ điệu) |
| Chỉ khác dạng Unicode (NFC/NFD), ví dụ `o‘` | Không, vì đã chuẩn hóa NFC trước khi băm |
| Đổi giọng, model, cài đặt giọng | Có, cho mọi clip của giọng đó (Điều phối báo số clip và chi phí trước) |
| Từ điển phát âm đổi (`lexicon_version`) | Chỉ những clip có `constraints.lexicon` chứa thuật ngữ bị đổi. Đề xuất: băm theo từng thuật ngữ thay vì cả phiên bản (mục 7) |
| Đổi `format_profile` giao (D2 chốt 64 kbps; chỉ đổi khi có quyết định mới) | **Không gọi lại nhà cung cấp**: chuyển mã từ bản gốc trong kho; file giao mới có `source_hash` mới vì `format_profile` đổi |
| `pipeline_version` tăng | Chỉ khi ghi chú phiên bản nói rõ cần làm lại (ví dụ đổi chuẩn loudness) |
| Kiểm âm hoặc Kiểm duyệt trả `lam_lai` | Có, cùng `source_hash`, tăng `attempt`; file cũ bị loại khỏi chỉ mục |
| Sửa `sim.*` trong thư viện (`sim_library_version`) | Chỉ code_video và mp4 dùng sim đó |

Phát hiện audio cũ: Đóng gói so `clip.source_hash` với sha256(NFC(chuỗi ở `text_path`)). Lệch thì M1 hoặc Đạo diễn đánh dấu `cu`, chạy `lap-phieu.py --gom-cu`.

## 4. Kho và chỉ mục của nhà máy

```
kho/
  goc/<sha256 nội dung>.<ext>      bản gốc từ nhà cung cấp (mp3_44100_128, pcm, png…)
  giao/<sha256 nội dung>.<ext>     bản đã chuyển mã, chuẩn hóa
  ket-qua/<source_hash hex>.json   biên bản (ket-qua.schema.json)
  chi-muc-cache.json               { "<source_hash>": "giao/<sha>.mp3", ... }
```
Lưu file theo nội dung (content-addressed): hai phiếu cho ra cùng một byte thì chỉ lưu một bản. Chỉ mục ánh xạ `source_hash` sang file, và `lap-phieu.py --chi-muc-cache` đọc chính file này.

## 5. Đặt tên file trong artifact

```
audio/<lang>/<book>-<nhom>.mp3     sprite: nhom = mã bài/chương lấy từ đầu item_id (t4, l11, u1), 'terms' cho thuật ngữ
audio/<lang>/<book>-<nhom>-<k>.mp3 khi một nhóm vượt 18 MiB thì tách k = 2, 3…
audio/zxx/sfx.mp3                  hiệu ứng dùng chung
video/<video_id>-<lang>.mp4        bản quay hoặc người dẫn
sub/<video_id>-<lang>.vtt
img/<id>.webp
```
- Chỉ dùng chữ thường không dấu, số và `-`. Id có `.` hoặc `:` được đổi thành `-` trong tên file.
- Tên file không chứa hash, để artifact dễ đọc. Hash nằm trong book.json (`media.files[].source_hash`, `clips.source_hash`).
- Thư mục cũ (`audio_vi/`, `audio2/`, `pg/`…) giữ nguyên tới khi Đóng gói di chuyển trong một đợt có người duyệt. book.schema ghi `path` tự do nên không phải sửa schema.

## 6. Tái dùng giữa các cuốn

1. **Thuật ngữ:** `media.term_audio` khóa theo `term.<id>` của `tri-thuc/thuat-ngu.csv` và không có book trong hash. Ví dụ `term.gul` dùng ở tabiiy5 và biologiya5: sản xuất một lần, Đóng gói của mỗi cuốn chép vào sprite `terms` riêng của cuốn đó (artifact không dùng chung file được).
2. **Câu trùng nguyên văn:** mọi loại audio đều không có book trong hash, nên cùng câu, cùng giọng thì tự trúng cache, ví dụ lời dặn an toàn thí nghiệm ở kimyo8 và fizika8.
3. **Cảnh sim:** cảnh có cùng `sim.kind` và `params` (JSON chuẩn) cho ra cùng hình. Bản mp4 hoặc ảnh tĩnh của cảnh khóa theo (kind, params, sim_library_version, render_profile, lang nếu cảnh có chữ).
4. **sfx:** một bộ dùng chung cho toàn hệ.
5. **Giọng:** một `voice_id` cho mỗi persona × ngôn ngữ trên toàn hệ, nên câu trùng giữa các cuốn mới trúng cache.

## 7. Đề xuất (chưa làm)
- Băm lexicon theo từng thuật ngữ có trong câu thay cho `lexicon_version` toàn cục, để sửa một thuật ngữ không làm cũ toàn bộ audio.
- ~~Thêm `render_hash` vào `$defs.clip`~~ – ĐÃ LÀM ở D2 (v0.9.0): `clip.source_hash` = text_hash, `clip.render_hash` = `source_hash` của phiếu/biên bản.
