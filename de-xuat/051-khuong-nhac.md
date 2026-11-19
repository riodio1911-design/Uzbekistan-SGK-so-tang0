# 051 – Khối khuông nhạc (MusicXML/ABC) và trình theo dõi nốt

**Ưu tiên:** P2 · **Độ khó:** cao · **Phụ thuộc:** [043](043-bai-hat-va-loi-dong-bo.md), [052](052-ban-thu-nhac-va-trinh-nghe.md) · **Số chỗ thiếu thô gộp vào:** 4

## Thay đổi gì
- `block.type = "music_score"`: `{format: musicxml|abc, src, title, composer?, lyricist?, tempo_text: i18n, lyrics_lines?}`; dựng bằng thư viện ký âm (OSMD/abcjs từ CDN cho phép), giữ khóa Sol, hóa biểu, nhịp 2/4–6/8, volta 1./2., liên ba, chuyển giọng, hợp âm.
- `sim.score_follow`: con trỏ chạy theo nốt/lời, chọn giai điệu tổng hợp hoặc bản thu, chậm lại, lặp ô nhịp, máy đếm nhịp.
- Quy trình: bản nhạc phải **chép tay** sang MusicXML/ABC (OMR ở 100 ppi + watermark không dùng được).

## Vì sao + bằng chứng
musiqa5 C0 ("Lazgi" 6/8, "Yallama yorim" 2/4 tr.1; "Tanovar" 8 dòng, volta tr.2; hợp âm tr.19; chuyển giọng tr.31), C9 (bài hát dài 8–10 dòng tr.19, 31, 45, 49), M4 (≈10 bản nhạc), R2.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** musiqa5_darslik; nhạc các lớp 1–7.
- **Mở khóa:** Nhạc (1/12 mẫu).
- **Nguồn đã nêu chỗ thiếu này:** musiqa5_darslik

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: cao
- Ưu tiên: P2
- Phụ thuộc: [043](043-bai-hat-va-loi-dong-bo.md), [052](052-ban-thu-nhac-va-trinh-nghe.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 269 | musiqa5_darslik | block | music_score | Khối ký âm khuông nhạc: khóa Sol, hóa biểu, nhịp (2/4, 4/4, 6/8), chỉ dẫn nhịp độ (O‘rtacha, Marsh tempida, Sho‘x quvnoq), sắc thái (f, mf)… |
| 278 | musiqa5_darslik | sim | theo_doi_khuong_nhac | Tương tác mới: phát bản nhạc với con trỏ chạy theo nốt/lời (karaoke), chọn phát giai điệu tổng hợp hoặc bản thu, chậm lại, lặp ô nhịp, bật/… |
| 285 | musiqa5_darslik | media | media_dac_thu[4] | bản nhạc dựng lại dạng MusicXML/ABC cho khoảng 10 bản nhạc |
| 288 | musiqa5_darslik | quy_trinh | rui_ro[2] | ảnh trang 100 ppi + watermark: OCR chữ được, nhận dạng khuông nhạc (OMR) gần như không được, phải chép tay bản nhạc |
