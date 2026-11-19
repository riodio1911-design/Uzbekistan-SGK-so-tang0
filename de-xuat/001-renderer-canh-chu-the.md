# 001 – Renderer 7 loại cảnh video dạng chữ và thẻ

**Ưu tiên:** P0 · **Độ khó:** thấp · **Phụ thuộc:** [012](012-ky-phap-toan-noi-dong.md) · **Số chỗ thiếu thô gộp vào:** 8

## Thay đổi gì
- Viết 7 component trong `tang0/dau-doc/components/sim/`, theo đúng `params` đã có ở `thu-vien/mo-phong/danh-muc.json`, đăng ký bằng `registerSim`:
  - `sim.scene_text_lines` (dòng chữ hiện dần, delay 1,3 s, hỗ trợ ký pháp `{a/b}` qua đề xuất 012);
  - `sim.scene_steps` (danh sách bước hiện dần, delay 1,1 s);
  - `sim.scene_icon_grid` (lưới emoji + nhãn, `params.title`, `items[{e,t}]`);
  - `sim.scene_cards`, `sim.scene_explain` (2 mẫu VK của `window.VK`);
  - `sim.scene_keys`, `sim.scene_code_blocks` (informatika5).
- `sim.scene_page_image` nhận thêm `params.img` (ảnh rời, không cắt từ trang) cho 8 cảnh `VK.photo` của tabiiy5.
- Không đổi schema, không đổi thư viện.

## Vì sao + bằng chứng
Đây là nhóm chặn lớn nhất về số lượng: **1.370 cảnh** hiện "Chưa hỗ trợ" ở 6/7 cuốn (đếm trên `books/*/book.json`):
| kind | số cảnh | cuốn |
|---|---|---|
| scene_text_lines | 590 | m5 133, inf 69, kim 177, fiz 211 |
| scene_steps | 484 | inf 62, kim 193, fiz 229 |
| scene_explain | 97 | tab 12, bio 85 |
| scene_cards | 94 | tab 14, bio 80 |
| scene_icon_grid | 83 | tab 14, bio 13, kim 29, fiz 27 |
| scene_keys / code_blocks | 12 / 10 | inf |
Bằng chứng: matematika5 `tu-che.md` DT1 (ảnh `m5-video-t8-canh3-lines-vi.png`); informatika5 TC-DD4; tabiiy5 "Đầu đọc thiếu"; biologiya5 TC02; kimyo8 TC-A2–A4; fizika8 TC-4 ("ưu tiên scene_steps và scene_text_lines: dễ làm, phủ 440 cảnh").

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** matematika5, informatika5, tabiiy5, biologiya5, kimyo8, fizika8
- **Loại sách mới:** Mọi sách có video dựng bằng mã (họ A theo D2 M2); sách mới chưa dùng.
- **Mở khóa:** 1.370/1.849 cảnh đang thiếu (74 %). Sau đề xuất này: kimyo8 còn 120 cảnh hóa, fizika8 còn 183 cảnh lý, informatika5 còn 12, biologiya5 và matematika5 (chữ) về 0.
- **Nguồn đã nêu chỗ thiếu này:** biologiya5, fizika8, informatika5, kimyo8, matematika5, tabiiy5

## Tương thích ngược
Có. Chỉ thêm renderer; dữ liệu `book.json` đã đúng `params` của thư viện (đã kiểm ở bước ④).

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P0
- Phụ thuộc: [012](012-ky-phap-toan-noi-dong.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 8 | matematika5 | dau_doc_renderer | DT1a sim.scene_text_lines | Cảnh chữ hiện dần chưa có renderer |
| 22 | informatika5 | dau_doc_renderer | TC-DD4 4 loại cảnh | scene_text_lines 69, scene_steps 62, scene_keys 12, scene_code_blocks 10 |
| 38 | tabiiy5 | dau_doc_renderer | 3 loại cảnh VK + img | scene_cards 14, scene_icon_grid 14, scene_explain 12; scene_page_image chưa nhận img của VK.photo |
| 46 | biologiya5 | dau_doc_renderer | TC02d 4 cảnh VK | scene_cards 80, scene_explain 85, scene_icon_grid 13 (+scene_page_image 35 đã chạy) |
| 75 | kimyo8 | dau_doc_renderer | TC-A2 sim.scene_text_lines | Cảnh dòng chữ (có phân số) |
| 76 | kimyo8 | dau_doc_renderer | TC-A3 sim.scene_steps | Cảnh danh sách bước |
| 77 | kimyo8 | dau_doc_renderer | TC-A4 sim.scene_icon_grid | Lưới emoji + nhãn |
| 99 | fizika8 | dau_doc_renderer | TC-4b cảnh chữ/bước/icon | scene_steps 229, scene_text_lines 211, scene_icon_grid 27 |
