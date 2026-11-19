# 006 – sim.screen_demo, mẫu màn hình dùng chung và bảng tính

**Ưu tiên:** P0 · **Độ khó:** vừa · **Phụ thuộc:** Không · **Số chỗ thiếu thô gộp vào:** 4

## Thay đổi gì
- Renderer `sim.screen_demo`: phát từng bước, mỗi bước phát clip thuyết minh `d<n>-s<k>` (459 clip vi đã có `source_hash`).
- Thư viện mô phỏng: thêm `presets` cho `sim.screen_demo` gồm 9 mẫu stage (`desk, mouse, kbd, doc, paint, sheet, scratch, web, mail`) lấy từ `books/informatika5/tu-che/demo-stg.json`, nhãn chuyển sang i18n. Trong book: `params.stage` trỏ tên preset; tùy chọn `params.stage_def` cho cuốn tự định nghĩa (thay `stage_template_ref` + `_tu_che`).
- Renderer `ex.spreadsheet` + `sim.spreadsheet_mini` (dạng cảnh và tương tác).

## Vì sao + bằng chứng
informatika5 TC01 (9 mẫu, 81 demo), TC-DD1 (81 demo / 1.426 bước, ảnh `06-demo-d8.png`), TC-DD3 (3 mô hình + 12 cảnh), TC-DD5 (459 clip bước demo không phát).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** informatika5
- **Loại sách mới:** Tin học lớp 3–11; mọi sách có trục 6 `mo_phong_thao_tac_phan_mem` (D1).
- **Mở khóa:** 81 demo, 1.426 bước, 459 clip, 3 bảng tính + 12 cảnh.
- **Nguồn đã nêu chỗ thiếu này:** informatika5

## Tương thích ngược
Có, nếu giữ đọc được `stage_template_ref` cũ một thời gian; dữ liệu mới dùng `stage`.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P0
- Phụ thuộc: Không

## Cần người quyết
Mẫu stage là tài sản của thư viện (preset) hay của từng cuốn (`stage_def`)? Đề xuất: preset trong thư viện, `stage_def` chỉ để mở rộng.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 16 | informatika5 | sim | TC01 mẫu stage DEMO_STG | 9 mẫu màn hình demo (desk, mouse, kbd, doc, paint, sheet, scratch, web, mail) chưa có chỗ trong thư viện |
| 19 | informatika5 | dau_doc_renderer | TC-DD1 sim.screen_demo | Không có renderer demo thao tác phần mềm |
| 21 | informatika5 | dau_doc_renderer | TC-DD3 ex.spreadsheet + sim.spreadsheet_mini | Bảng tính tương tác và cảnh bảng tính chưa có renderer |
| 23 | informatika5 | dau_doc_renderer | TC-DD5 thuyết minh từng bước demo | Clip d*-s* của từng bước demo chưa được phát |
