# 017 – Trường mở rộng x_* thay dấu _tu_che

**Ưu tiên:** P1 · **Độ khó:** thấp · **Phụ thuộc:** Không · **Số chỗ thiếu thô gộp vào:** 2

## Thay đổi gì
- Mọi object trong `book.schema.json` đang `additionalProperties: false` thêm `patternProperties: {"^x_[a-z0-9_]+$": {}}`.
- Quy ước: `x_tu_che: "<mã>"` đánh dấu chỗ tạm; `x_<tên>` chứa dữ liệu chờ chuẩn hóa. Đầu đọc bỏ qua `x_*`; `kiem-tra.py` đếm và liệt kê.

## Vì sao + bằng chứng
biologiya5 và adabiyot5 `tu-che.md`: "gần như mọi object đặt `additionalProperties: false`, nên không gắn được `_tu_che` vào đúng chỗ (điểm hình, khối, ghim)" – phải ghi đường dẫn JSON trong md. matematika5 cũng chỉ gắn được ở `exercise.data`. adabiyot5 TC-02 phải nhét chú thích cảnh vào `ui_strings["_tu_che…"]`.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** matematika5, informatika5, tabiiy5, biologiya5, adabiyot5, kimyo8, fizika8
- **Loại sách mới:** Mọi sách mới sẽ có chỗ chưa biểu diễn được trong lúc chờ duyệt.
- **Nguồn đã nêu chỗ thiếu này:** biologiya5, matematika5

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: thấp
- Ưu tiên: P1
- Phụ thuộc: Không

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 15 | matematika5 | schema | _tu_che chỉ gắn được ở exercise.data | Schema cấm trường thêm nên không đánh dấu được chỗ tạm |
| 56 | biologiya5 | schema | _tu_che không gắn được | additionalProperties:false; chỉ exercise.data, simulation.params, scene.visual.params tự do |
