# 048 – Khối biểu đồ vẽ từ số liệu và bài đọc biểu đồ

**Ưu tiên:** P1 · **Độ khó:** vừa · **Phụ thuộc:** [004](004-renderer-mo-phong-hoa-ly.md) · **Số chỗ thiếu thô gộp vào:** 3

## Thay đổi gì
- `block.type = "chart"`: `{kind: climograph|bar|line|range, series[{name: i18n, unit, values[]}], axes[{unit, alt_unit?}]}` (hai trục °C/mm, có °F). Dùng chung bộ vẽ với `sim.graph_plot` (004) và `sim.pie_explorer`/`sim.dot_plot_collect` (tabiiy5).
- Chạm cột/điểm đọc giá trị; nhãn dịch được; gia sư đọc được số.
- `ex.chart_read`: hỏi giá trị (số có dung sai – 046), tháng lớn/nhỏ nhất, tổng; hoặc ghép biểu đồ ↔ vùng đánh số trên bản đồ.

## Vì sao + bằng chứng
geografiya7_darslik C5 (biểu đồ nhiệt độ Qohira/Vindxuk °F/°C tr.61; biểu đồ khí hậu + bản đồ 1–4 tr.75; tr.111, 141), C6 (tr.75 a/b/d; tr.141 bài 4), M2. Ở 7 cuốn: `sim.graph_plot` 24 cảnh (kimyo8 3, fizika8 21).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** kimyo8, fizika8, tabiiy5
- **Loại sách mới:** geografiya7_darslik; Toán (thống kê), KHTN.
- **Nguồn đã nêu chỗ thiếu này:** geografiya7_darslik

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P1
- Phụ thuộc: [004](004-renderer-mo-phong-hoa-ly.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 180 | geografiya7_darslik | block | bieu_do_so_lieu | Biểu đồ khí hậu (cột lượng mưa + đường nhiệt độ theo 12 tháng, hai trục °C/mm, có cả °F) và biểu đồ dải nhiệt độ; cần khối vẽ từ dữ liệu (k… |
| 181 | geografiya7_darslik | ex | ex.chart_read | Bài đọc biểu đồ: hỏi tháng nóng/lạnh nhất, tính tổng lượng mưa năm, ghép biểu đồ ↔ vùng trên bản đồ đánh số. Đáp án là số (dung sai) hoặc l… |
| 190 | geografiya7_darslik | media | media_dac_thu[2] | biểu đồ khí hậu (climograph) từ dữ liệu |
