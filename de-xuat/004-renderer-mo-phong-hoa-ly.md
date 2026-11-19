# 004 – Renderer 10 mô phỏng Hóa – Lý dùng chung

**Ưu tiên:** P0 · **Độ khó:** vừa · **Phụ thuộc:** Không · **Số chỗ thiếu thô gộp vào:** 8

## Thay đổi gì
Chuyển thư viện vẽ cũ (`window.__DRAW`, `window.CHEM`) thành component theo `params` của thư viện (D2 M5: chỉ tách chữ và số liệu ra params, giữ logic vẽ):
- Hóa: `sim.chem_reaction` (55), `sim.chem_molecule_3d` (30), `sim.test_tube` (15), `sim.chem_fixed_scene` (8 – hoặc xuất 8 cảnh cố định thành SVG), `sim.ionic_bond` (8).
- Lý (dùng chung): `sim.circuit` (83), `sim.magnetic_field` (43), `sim.electric_charges` (26), `sim.graph_plot` (24), `sim.electrolysis` (11).

## Vì sao + bằng chứng
kimyo8 TC-A5–A11: "519/754 cảnh (69 %) chưa có hình… 133/133 video đều có ít nhất một cảnh như vậy"; sau 001 còn 120 cảnh. fizika8 TC-4: 650/969 cảnh; sau 001 còn 183. Tổng **303 cảnh**. Mã gốc nằm trong `fix/kimyo8`, `fix/fizika8` (`__DRAW.cReact`, `pCircuit`…).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** kimyo8, fizika8
- **Loại sách mới:** Hóa/Lý lớp 7–11 sau này; `sim.graph_plot` dùng lại cho biểu đồ (đề xuất 048).
- **Mở khóa:** 303 cảnh; kimyo8 và fizika8 hết cảnh "chưa hỗ trợ".
- **Nguồn đã nêu chỗ thiếu này:** fizika8, kimyo8

## Tương thích ngược
Có. Params đã tách đúng thư viện ở bước ④.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P0
- Phụ thuộc: Không

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 78 | kimyo8 | dau_doc_renderer | TC-A5 sim.chem_reaction | __DRAW.cReact, __chemBalance |
| 79 | kimyo8 | dau_doc_renderer | TC-A6 sim.chem_molecule_3d | __DRAW.cMol |
| 80 | kimyo8 | dau_doc_renderer | TC-A7 sim.ionic_bond | __DRAW.cIonic |
| 81 | kimyo8 | dau_doc_renderer | TC-A8 sim.test_tube | __DRAW.cTube |
| 82 | kimyo8 | dau_doc_renderer | TC-A9 sim.chem_fixed_scene | 8 cảnh cố định CHEM.c* |
| 83 | kimyo8 | dau_doc_renderer | TC-A10 sim.electric_charges | Dùng chung fizika8 |
| 84 | kimyo8 | dau_doc_renderer | TC-A11 sim.graph_plot | Dùng chung fizika8 |
| 100 | fizika8 | dau_doc_renderer | TC-4c mô phỏng Lý | circuit 83, magnetic_field 43, electric_charges 24, graph_plot 21, electrolysis 11, ionic_bond 1 |
