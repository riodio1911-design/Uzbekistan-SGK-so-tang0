# 039 – Dạng bài nghe rồi chọn/chạm (đề là audio)

**Ưu tiên:** P1 · **Độ khó:** thấp · **Phụ thuộc:** [003](003-renderer-16-dang-bai-con-lai.md), [056](056-phuong-an-la-hinh.md) · **Số chỗ thiếu thô gộp vào:** 3

## Thay đổi gì
- `ex.listen_select`: đề là `audio_ref` (không chữ), phương án là hình/vùng chạm trên ảnh trang hoặc chữ; một hay nhiều đáp án; chấm tự động. Gộp:
  - "Look, listen and point", "Listen and tick", "Listen and write the numbers" (ingliz2);
  - "nhạc cụ nào, mấy nhạc cụ" (musiqa5 `ex.listen_identify`);
  - "giáo viên đọc – trẻ chạm ô đúng" (alifbe1 `cham_o_nghe_am`).
- Thực hiện trên renderer `choice_single`/`choice_multi` + phương án hình (056) + vùng chạm `box`.

## Vì sao + bằng chứng
ingliz2_darslik C5 (tr.6 2a, tr.14, tr.70); ingliz2_daftar C4 (tr.36, 45, 54, 63 – có điểm trong Progress check); musiqa5 C4 (8 nhạc cụ, 4 bản thu tr.7; chọn nhiều 9 hình tr.8); alifbe1_darslik C15.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** ingliz2_darslik, ingliz2_daftar, musiqa5_darslik, alifbe1_darslik.
- **Nguồn đã nêu chỗ thiếu này:** ingliz2_daftar, ingliz2_darslik, musiqa5_darslik

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P1
- Phụ thuộc: [003](003-renderer-16-dang-bai-con-lai.md), [056](056-phuong-an-la-hinh.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 225 | ingliz2_daftar | ex | ex.listen_tick | Nghe audio (không in kịch bản) rồi tick ô/tranh đúng hoặc viết số nghe được. Cần audio đề en + đáp án; dùng trong Progress check có điểm. |
| 246 | ingliz2_darslik | ex | nghe_roi_cham_tranh | Bài nghe: phát clip (giọng bản ngữ) rồi trẻ chạm vào nhân vật/vật trên tranh trang ('Look, listen and point', 'Listen and tick'). Cần ex.* … |
| 273 | musiqa5_darslik | ex | ex.listen_identify | Nghe một bản thu rồi chọn hình/nhãn tương ứng (nhạc cụ nào, mấy nhạc cụ, thể loại nào). Đề là audio, đáp án là hình. Chấm tự động khi sách … |
