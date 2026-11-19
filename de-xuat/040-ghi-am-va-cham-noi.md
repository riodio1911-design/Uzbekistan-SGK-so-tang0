# 040 – Ghi âm trong trình duyệt, nghe lặp lại, biểu diễn; chính sách chấm phát âm

**Ưu tiên:** P1 · **Độ khó:** cao · **Phụ thuộc:** [003](003-renderer-16-dang-bai-con-lai.md), [062](062-loai-media-moi.md) · **Số chỗ thiếu thô gộp vào:** 8

## Thay đổi gì
- Nâng `ex.oral_recording` (hiện chỉ checkbox + chọn tệp) thành bản ghi bằng micro: ghi, nghe lại cạnh mẫu (`model_audio_ref`), nộp lên `res/` (asset ≤ 20 MB), GV nghe và chấm (`giao_vien`).
- Biến thể theo `data.mode`: `repeat` (nghe mẫu bản ngữ rồi lặp – ingliz2 "Listen and repeat"; alifbe1 gọi tên tranh, tez aytish), `recite` (đọc thuộc – onatili3 "She’rni yod oling", ẩn dần dòng = `ex.memorize_text`), `perform` (hát/gõ theo nhạc đệm minus, ghi âm/ghi hình – musiqa5).
- Trục 5 thêm `nhan_dang_giong_noi_goi_y`: nhận dạng giọng nói chỉ phản hồi, **không** là căn cứ điểm.
- Trục 9: `micro`, `camera`; ghi rõ quyền riêng tư dữ liệu giọng trẻ em.

## Vì sao + bằng chứng
alifbe1_darslik C7 (tr.10, 14, 17, 46, 56), R4 ("không được để AI chấm phát âm là căn cứ điểm"); ingliz2_darslik C6 (tr.7, 14, 42, 92), C7, R4 (quyền micro, dữ liệu giọng trẻ em); onatili3_darslik1 C9 (17 trang có "yod"); musiqa5 C5 (hát, múa, gõ tr.4, 19, 31, 45), M3 (nhạc đệm); adabiyot5 (1 bài `ex.oral_recording`, DD-1).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** adabiyot5
- **Loại sách mới:** alifbe1_darslik, ingliz2_darslik, onatili3_darslik1, musiqa5_darslik.
- **Mở khóa:** Mục tiêu nói của 4 loại sách.
- **Nguồn đã nêu chỗ thiếu này:** alifbe1_darslik, ingliz2_darslik, musiqa5_darslik, onatili3_darslik1

## Tương thích ngược
Có điều kiện: giữ chế độ chọn tệp cũ làm phương án dự phòng; `data.mode` mặc định = hành vi hiện tại.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: cao
- Ưu tiên: P1
- Phụ thuộc: [003](003-renderer-16-dang-bai-con-lai.md), [062](062-loai-media-moi.md)

## Cần người quyết
Có lưu bản ghi giọng trẻ lên db/assets không, giữ bao lâu, ai nghe được? Đề xuất: chỉ GV của lớp nghe; xóa sau khi chấm hoặc hết năm học; phải có đồng ý của phụ huynh cho cấp 0–4.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 132 | alifbe1_darslik | ex | ex.oral_pronunciation | Bài nói có ghi âm trong trình duyệt và chấm: gọi tên tranh, đọc âm tiết, nói câu, tez aytish. ex.oral_recording hiện chỉ có checkbox + chọn… |
| 152 | alifbe1_darslik | quy_trinh | rui_ro[4] | Nhận dạng giọng nói tiếng Uzbek của trẻ 6–7 tuổi chưa đáng tin; không được để AI chấm phát âm là căn cứ điểm |
| 247 | ingliz2_darslik | ex | ex.listen_repeat | Nghe mẫu bản ngữ rồi lặp lại: ghi âm giọng trẻ, phát lại cạnh mẫu; tùy chọn chấm phát âm bằng nhận dạng giọng nói en. ex.oral_recording hiệ… |
| 248 | ingliz2_darslik | truc | cham_phat_am | Cách chấm phát âm: so khớp phiên âm/nhận dạng giọng nói (speech-to-text en) với từ/câu mẫu, khoan dung với trẻ 7–8 tuổi; hoặc giao_vien ngh… |
| 267 | ingliz2_darslik | quy_trinh | rui_ro[4] | Nhận dạng giọng nói trẻ 7–8 tuổi kém chính xác; quyền micro, dữ liệu giọng trẻ em (riêng tư) |
| 274 | musiqa5_darslik | ex | ex.performance | Bài biểu diễn: hát, múa phụ họa, gõ nhạc cụ gõ theo bài, có thể theo nhóm. Cần phát nhạc đệm (bản minus) trong khi ghi âm/ghi hình bằng mic… |
| 284 | musiqa5_darslik | media | media_dac_thu[3] | nhạc đệm (minus) cho bài hát để hát theo |
| 300 | onatili3_darslik1 | ex | ex.memorize_text | Học thuộc thơ: ẩn dần dòng/từ của bài thơ để HS tự nhớ, sau đó đọc/ghi âm. Hiện chỉ có ex.oral_recording (checkbox). |
