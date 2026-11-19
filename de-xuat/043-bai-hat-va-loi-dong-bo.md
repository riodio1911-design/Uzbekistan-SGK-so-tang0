# 043 – Bài hát/chant và lời đồng bộ (karaoke)

**Ưu tiên:** P2 · **Độ khó:** vừa · **Phụ thuộc:** [051](051-khuong-nhac.md), [059](059-ban-quyen-media-rights.md), [061](061-nguon-goc-tu-nxb.md) · **Số chỗ thiếu thô gộp vào:** 3

## Thay đổi gì
- `block.type = "song"`: `{audio_ref (có nhạc), backing_ref? (minus), lyrics: verses[{label: naqarot|band, lines[{text, start, dur}]}], repeat?, score_ref?}`; hát theo từng dòng, lặp, chậm lại.
- Lời nhiều lời chồng (lời 1/lời 2 dưới cùng dòng nhạc) và lời gắn theo âm tiết dưới nốt dùng `score_ref` → khối `music_score` (051).
- Lời bài hát không in trong sách → `lyrics_source: "multimedia|sgv|self"`.

## Vì sao + bằng chứng
ingliz2_darslik C3 ("Listen and sing" mở đầu hầu hết các bài tr.6, 41, 61, 77; lời không in), M1, R1; musiqa5 C1 (hai dòng lời dưới volta tr.45; "Naqarot" tr.20; lời kaa tr.51).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** ingliz2_darslik, musiqa5_darslik; alifbe1 (thơ, tez aytish).
- **Nguồn đã nêu chỗ thiếu này:** ingliz2_darslik, musiqa5_darslik

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P2
- Phụ thuộc: [051](051-khuong-nhac.md), [059](059-ban-quyen-media-rights.md), [061](061-nguon-goc-tu-nxb.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 244 | ingliz2_darslik | block | bai_hat_chant | Bài hát/chant: lời + audio có nhạc + hát theo từng dòng (karaoke), lặp lại. 'Listen and sing' mở đầu hầu hết các bài; PDF không in lời bài … |
| 259 | ingliz2_darslik | media | media_dac_thu[1] | Bài hát/chant tiếng Anh có nhạc (Listen and sing ở gần như mọi bài) – lời không in |
| 270 | musiqa5_darslik | schema | song_lyrics_aligned | Lời bài hát gắn theo âm tiết dưới nốt (Bo-bo-me-ros), nhiều lời chồng nhau (lời 1 và lời 2 dưới cùng một dòng nhạc), có nhãn Naqarot, bản i… |
