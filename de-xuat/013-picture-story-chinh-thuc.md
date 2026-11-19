# 013 – sim.picture_story có tham số block_ref và renderer

**Ưu tiên:** P1 · **Độ khó:** vừa · **Phụ thuộc:** Không · **Số chỗ thiếu thô gộp vào:** 2

## Thay đổi gì
- Thư viện: `sim.picture_story.params = {block_ref, autoplay, crops[]}`: lấy câu, audio câu, phụ đề từ khối văn xuôi đã có thay vì chép.
- Renderer: tranh cắt từ trang đổi theo chỉ số câu, phụ đề 3 thứ tiếng, tự sang câu; GV thay media qua `teacher.media_overrides`.
- Công cụ chuyển 39 `videos[]` tạm về dạng mới.

## Vì sao + bằng chứng
adabiyot5 TC-03: 39 tác phẩm, 1.063 câu được chép vào `videos[]` (+~0,4 MB; book.json 2,6 MB); DD-7 không có renderer. Hiện chạy được qua `sim.scene_player` nên không chặn.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** adabiyot5
- **Loại sách mới:** Văn học, tiếng mẹ đẻ (onatili3 truyện đọc), alifbe1 truyện nghe.
- **Mở khóa:** Giảm dữ liệu trùng; trải nghiệm đúng bản cũ.
- **Nguồn đã nêu chỗ thiếu này:** adabiyot5

## Tương thích ngược
Có, nếu đầu đọc vẫn đọc `videos[]` cũ.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P1
- Phụ thuộc: Không

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 59 | adabiyot5 | sim | TC-03 sim.picture_story tham số block_ref | Phim tranh trải thành videos[] (chép 1.063 câu, +0,4 MB) |
| 71 | adabiyot5 | dau_doc_renderer | DD-7 sim.picture_story | Không có renderer phim tranh |
