# Thư viện mô phỏng – tầng 0, bản nháp v0.9

Thư mục này gồm 4 file:
- `danh-muc.json`: 57 mục `sim.*`.
- `bang-anh-xa.csv`: 173 dòng, mỗi dòng nối một tên trong mã gốc với một `sim_id`.
- `README.md`: file này.
- `BAO-CAO.md`: báo cáo ngắn.

Nguồn: 7 bản kiểm kê ở `kiem-ke/`, cộng mã HTML đã cắt base64 của `fix/` và `fix2/`. Các con số đếm cảnh lấy bằng cách phân tích trực tiếp `window.TP` / `window.DM` (họ A), và đếm lệnh gọi `K.*` / `draw(p,s,L)` (tabiiy5, biologiya5). Chỗ nào chỉ là ước lượng đều ghi "~".

## 1. Cách phân loại

Mỗi mục có các trường sau:
- `id`, `name` (đa ngữ: `uz` bắt buộc, kèm `ru`, `vi`).
- `family`: nhóm để duyệt, không phải trục.
- `mechanism`: theo enum của hướng dẫn.
- `modes`: chế độ chạy, xem bên dưới.
- `params`: gồm tên, kiểu, miền giá trị, mặc định. Miền giá trị và mặc định chép từ mã (thanh trượt trong `openModel`, giá trị `||` mặc định trong `__DRAW`).
- `inputs` / `outputs`.
- `reusable_for`: môn, lớp, lý do.
- `sources`: cuốn, hàm/biến, số lần dùng.
- `axes`, `grade_bands`, `status`, `notes`.

**Chế độ (`modes`)** là ý chính của thư viện. Cùng một mô phỏng có thể chạy theo 3 cách:
- `scene`: một cảnh trong video hoạt hình. Hàm nhận `(t, v)` và trả về SVG/HTML, tự chạy theo thời gian.
- `interactive`: modal hoặc widget có điều khiển (thanh trượt, nút).
- `player`: khung phát chứa các cảnh.

Matematika5 đã làm đúng như vậy: một hàm `V(v)` dùng cho cả cảnh video lẫn `openModel`. **D2 đã chốt** 3 chế độ này và chuẩn cảnh là dữ liệu JSON (họ A).

**Giá trị trục dùng trong `axes`** (đã điều hòa theo `tu-dien-truc.json`):
- Trục 3: `video_hoat_hinh_dung_bang_ma`, `mo_hinh_tuong_tac`, `kham_pha_hinh`, `audio_thuyet_minh`, `van_ban_nghe_thuat`.
- Trục 6: `hoat_hinh_theo_thoi_gian`, `thanh_truot_tham_so`, `chon_tham_so`, `cham_chon`, `keo_tha`, `cong_cu_ao`, `diem_nong_tren_hinh`, `webaudio`, `doc_theo_cau`, `sua_o_cong_thuc`, `tro_choi_co_gio`, `mo_phong_thao_tac_phan_mem` (giá trị thêm ở D1).
- Trục 4 (chỉ khi mô phỏng chứa dạng bài): `ex.sim_task`, `ex.spreadsheet`.
- Trục 9: `audio_sprite_mp3`, `teacher_media_replace`, `teacher_content_edit`, `assets`.

## 2. Bảng tóm tắt

| Nhóm | Số mục | id |
|---|---|---|
| Khung phát | 3 | scene_player, picture_story, screen_demo |
| Cảnh chung | 9 | scene_text_lines, scene_steps, scene_page_image, scene_cards, scene_icon_grid, scene_explain, scene_keys, scene_code_blocks, scene_custom_draw |
| Hóa | 6 | chem_reaction, chem_molecule_3d, atom_shells, ionic_bond, test_tube, chem_fixed_scene |
| Lý | 5 | circuit, magnetic_field, electric_charges, graph_plot, electrolysis |
| Toán | 7 | place_value, decimal_shift, fraction_model, fraction_area, triangle_area, cuboid_volume, ratio_bars |
| Tin | 1 | spreadsheet_mini |
| KHTN (tabiiy5/biologiya5) | 19 | germination_lab, predict_check, camouflage_game, particle_states, drying_variables, heating_curve, dissolving, falling_paper, balanced_forces, sound_vibration, sound_speed_race, magnet_lab, dot_plot_collect, pie_explorer, jar_rain, cycle_diagram, proportion_drilldown, smog_sources, oil_spill_cleanup |
| Thiên văn | 5 | solar_system_models, earth_orbit, seasons, sun_earth_moon, satellite_uses |
| Công cụ / khám phá | 2 | virtual_microscope, figure_explorer |

Theo `mechanism`:

| mechanism | Số mục |
|---|---|
| hoat_hinh_dung_bang_ma | 26 |
| mo_phong_tham_so | 16 |
| cong_cu_ao | 7 |
| khac | 4 |
| kham_pha_hinh | 2 |
| mo_hinh_3d | 1 |
| thao_tac_phan_mem | 1 |

`keo_tha` không có mục riêng. Kéo-thả chỉ xuất hiện trong các dạng bài sort/order, mà các dạng này thuộc thư viện bài tập.

## 3. Video hoạt hình dựng bằng mã: phân nhóm cảnh

Cả 7 cuốn đều có loại video này. Có 3 khung phát: `sim.scene_player` (6 cuốn), `sim.picture_story` (adabiyot5) và `sim.screen_demo` (informatika5). Bên trong, các cảnh chia thành những kiểu có tham số như sau. Số liệu là số cảnh.

| Kiểu cảnh → sim | mat5 | inf5 | kim8 | fiz8 | tab5 | bio5 |
|---|---|---|---|---|---|---|
| lines → scene_text_lines | 133 | 69 | 177 | 211 | | |
| steps → scene_steps | | 62 | 193 | 229 | | |
| img / VK.photo → scene_page_image | 67 | 136 | 203 | 311 | 8 | 35 |
| VK.cards → scene_cards | | | | | 14 | 80 |
| cIcons / VK.grid → scene_icon_grid | | | 29 | 27 | 14 | 13 |
| VK.explain → scene_explain | | | | | 12 | 85 |
| keys, blocks | | 12, 10 | | | | |
| sheet → spreadsheet_mini | | 12 | | | | |
| Toán (pv, shift, frac, area, tri, cuboid, ratio) | 76 | | | | | |
| Hóa (cReact 55, cMol 30, cShell, cIonic, cTube 15) | | | 139 | 9 | | |
| Lý (pCircuit 83, pField 43, pCharge, pGraph, pElectro 11) | | | 5 | 182 | | |
| Cảnh hóa cố định (8 loại) | | | 8 | | | |
| Vẽ tay draw(p,s,L) → scene_custom_draw | | | | | ~42 | 0 (V.v1–v6 chết) |
| **Tổng cảnh** | 276 | 301 | 754 | 969 | ~90 | 213 |

adabiyot5 dùng `picture_story`: 20 bài thơ và 19 bài văn xuôi, có 15 cảnh minh hoạ cắt từ trang. informatika5 có thêm 81 kịch bản `screen_demo` với 1426 bước.

**Nhận xét.**
- Họ A (Toán, Tin, Hóa, Lý) lưu cảnh dưới dạng **dữ liệu JSON** `{k, ...tham số}`. Dạng này tách được khỏi mã.
- tabiiy5 và biologiya5 lưu cảnh dưới dạng **hàm** `draw(p,s,L)`. Ở biologiya5, cả 213 cảnh đều gọi mẫu VK (photo/grid/cards/explain), nên chuyển thẳng được sang JSON. Ở tabiiy5, khoảng một nửa (48/~90) gọi mẫu VK; nửa còn lại vẽ tay, gắn cứng vào từng bài (số này là ước lượng).
- Bước ④ nên lấy định dạng dữ liệu của họ A làm chuẩn, cộng thêm 4 mẫu VK làm kiểu cảnh chung.

## 4. Các cặp đã gộp (cùng nghĩa, khác tên)

- `openVideo` (họ A) và `class Player` (tabiiy5, biologiya5) → `sim.scene_player`. Player có thêm CC, tốc độ 0,8/1/1,25× và toàn màn hình.
- `V() k='img'` (crop ảnh trang), `crop()` (adabiyot5) và `VK.photo` (ảnh tệp, Ken Burns) → `sim.scene_page_image`.
- `cIcons` (emoji) và `VK.grid` (ảnh) → `sim.scene_icon_grid`.
- Cảnh `sheet` và mô hình `sheet` + `sheetVal` → `sim.spreadsheet_mini`, với 2 chế độ.
- 7 mô hình toán: cảnh và `openModel` → mỗi mô hình một mục, 2 chế độ.
- `openFig` (kimyo8, fizika8), `fxOpen`/`fxEdit` (biologiya5), `mountFlower` và `ACT.types92` (tabiiy5) → `sim.figure_explorer`, với `background` = page_crop | image | svg.
- `ACT.lab13` và `WB sim` (tabiiy5) → `sim.germination_lab`.
- `ACT.ruler61` và `ACT.pitch62` → `sim.sound_vibration`. Cả hai dùng chung `tone()`.
- `ACT.magnet71` và `ACT.distance72` → `sim.magnet_lab`, với `variant`.
- `cShell`, `cIonic`, `pCharge`, `pGraph`: cùng một hàm, dùng ở cả kimyo8 và fizika8 → mỗi hàm một mục, `sources` ghi cả hai cuốn.

## 5. Các trường hợp tách

- **Trùng tên khác nghĩa:** `cReact` (`W.cReact`, có tham số `eq`) và `cReact0` (`function cReact()` của script "Hoạt hình hoá học", cố định). Tách thành `sim.chem_reaction` và một giá trị trong `sim.chem_fixed_scene`.
- `pGraph` (vẽ dữ liệu cho sẵn) tách khỏi `heat41` (mô phỏng tự sinh số liệu đồ thị).
- `redi3` (chỉ dự đoán rồi hiện kết quả) tách khỏi `germination_lab` (có tham số và diễn biến theo ngày).
- 4 mô phỏng thiên văn (`models101`, `orbit101`, `seasons101`, `moon102`) và `sat102` để riêng từng mục. Chúng khác cơ chế và khác tham số, chỉ chung `family: thien_van`.
- `dots72` (thu số liệu dạng biểu đồ chấm) tách khỏi `magnet_lab`.

**Ngoài phạm vi** (`sim_id = ngoai_pham_vi`, chuyển sang thư viện bài tập `ex.*`):
- Các ACT phân loại/sắp xếp: `key11`, `sort12`, `order12`, `db62`, `key71`, `bin92`.
- `GACT`, `sorter`.
- WB `plate`, WB `sketch`.

## 6. Ghi chú mã thừa chép chéo (bước ④ KHÔNG mang theo)

| Cuốn | Mã thừa | Nguồn gốc |
|---|---|---|
| informatika5 | `V()`/`openModel` nhánh pv, shift, frac, area, tri, cuboid, ratio; `PVN`, `digs`, `fmt`, `FR`, `rng` (nhãn 'Surat/Maxraj') | matematika5 |
| kimyo8 | Như trên + nhánh keys, sheet, blocks, `sheetVal`, `afterV` | matematika5, informatika5 |
| kimyo8 | `__DRAW.pCircuit`, `pField`, `pElectro` | bộ chung với fizika8 |
| fizika8 | Nhánh Toán/Tin trong `V()`/`openModel`; chuỗi `U.uz.type`, `U.*.shh` | matematika5, informatika5 |
| fizika8 | `__DRAW.cReact`, `cMol`, `cTube`, `__chemBalance`, `geom`; toàn bộ script "Hoạt hình hoá học" (cBond…cReact0) | kimyo8 |
| biologiya5 | 32/34 hàm `ACT` (mọi ACT trừ `redi3`, `micro3`); `key11`/`sort12` trỏ tới ảnh không tồn tại | tabiiy5 |
| biologiya5 | `mountFlower`, `VIDEO_HELPERS.flower`/`PARTS`, `V.v1–v6` (bị ghi đè) | tabiiy5 (chủ đề hoa) |
| tabiiy5 | `viewHome`, `viewLesson`, `viewVideos`… (bản "Sách số"); nhánh TTS trong Speaker không bao giờ chạy | bản cũ của chính cuốn |
| adabiyot5 | `B.task` nhánh `input==='draw'` + `initDraw()` | không rõ (không chắc) |

Ngoài ra có **dữ liệu media thừa** gắn với mô phỏng/video:
- biologiya5: ~71 MB `fx-*.mp3`. Đây là lời đọc cho 400 điểm của `figure_explorer`, nhưng `fxOpen` không gọi `Speaker.play`.
- tabiiy5: `audio/` ~84 MB.
- adabiyot5: `audio/u*_p*_N.mp3` ~45 MB.

Cả ba đều không được mã nào dùng.

**Rủi ro khi tái dụng:**
- Nhãn điều khiển viết cứng tiếng Uzbek: 'Son', 'Surat', 'Maxraj', 'Uzunlik'… (Toán); 'Chap tugma', 'New Message' (screen_demo).
- `PVN` viết cứng.
- Tỉ lệ ảnh trang viết cứng khác nhau giữa các cuốn: 1241×1635, 1241×1595, 1241×1879, 1000×1415.
- Hầu hết ACT của tabiiy5 chỉ có `uz`/`vi`, `ru` lấy qua `RUDICT`.
- Nội dung mô phỏng KHTN (vật thử, kết quả, ngưỡng) viết trong mã. Bước ④ phải đưa ra thành `params`.

## 7. Liên quan nhưng không phải mô phỏng

Thay video bằng video thật của giáo viên (`__VM`, `MED`/`setMed`, `playMedia`): lưu ở db `media/<id>` (adabiyot5: collection `quiz`, biologiya5: `edit/m-<id>`), kèm `assets` và `user.canEdit`. Cơ chế này gắn vào `scene_player`, `screen_demo`, `picture_story` dưới dạng tính năng `media_override`. Thành phần thuộc Schema (`media`) và Giao diện, nên không lập mục `sim.*`.

## 8. Đề xuất bổ sung (chưa cuốn nào có, KHÔNG đưa vào danh mục chính)

1. Chế độ `interactive` cho `sim.circuit`, `sim.magnetic_field`, `sim.chem_reaction`, `sim.chem_molecule_3d`. Hiện chúng chỉ chạy được dưới dạng cảnh video, mà tham số đã sẵn sàng cho thanh trượt hoặc nút.
2. Phát `fx-*.mp3` trong `figure_explorer`, vì audio đã có sẵn.
3. Bản `kaa` (Karakalpak) cho nhãn của mọi mô phỏng.
4. Mô phỏng cho cấp tuổi 0–2 và 3–4. Chưa cuốn nào thuộc các cấp này, nên mọi `grade_bands` hiện chỉ suy ra từ lớp 5 và lớp 8.
5. Ghi kết quả mô phỏng (dự đoán, lượt chạy) lên db để giáo viên xem. Hiện kết quả chỉ nằm trong bộ nhớ trang.

## Đã chốt ở D2 (18/11/2026)
1. Giữ 3 chế độ `scene` / `interactive` / `player` (một hàm cho cả cảnh video lẫn mô hình, như matematika5).
2. Chuẩn cảnh: dữ liệu JSON (họ A) + 4 mẫu VK làm kiểu cảnh chung; hàm `draw` vẽ tay chỉ là đường lui (`sim.scene_custom_draw`).
3. Duyệt các cặp đã gộp: `figure_explorer`, `germination_lab`, `sound_vibration`, `magnet_lab`.
4. Giá trị trục 3/6 theo `tu-dien-truc.json` (đã điều hòa).
5. 19 mô phỏng KHTN (agent áp dụng chọn): ở bước ④ chỉ tách **dữ liệu chữ đa ngữ và số liệu** ra `params`; giữ logic vẽ trong mã. Ít rủi ro nhất, không đổi hành vi.
6. `sim.figure_explorer` có tham số chính thức `background_src` (mặc định `sim/<id>.svg`, theo đề xuất R1/R2).
