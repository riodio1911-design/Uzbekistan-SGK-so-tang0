# fizika8: phần tầng 0 v0.9.0 chưa biểu diễn được

Bước ④, ngày 19/11/2026. Nguồn: `fix/fizika8/index.html` và danh sách 358 file của artifact cũ.

**Kết luận.** Mọi dữ liệu nội dung đã vào được `book.json` mà không phải chế thêm trường. Book.schema đặt `additionalProperties: false`, và không có mục nào cần đến chỗ trống `"_tu_che"`. Vì vậy cột `tu_che` trong `doi-chieu.json` bằng 0 ở mọi dòng.

Các mục dưới đây gồm: chỗ đầu đọc còn thiếu, quy ước tôi phải tự chọn vì D2 chưa nói tới, và thông tin cũ chưa có trường để chứa. Không mục nào được đưa vào tầng 0.

## TC-1. Khóa trạng thái học sinh cũ ở cấp ý bài
- **Mô tả.** Mã cũ lưu đáp án vào `localStorage['fiz8.ans']` theo khóa `${n}.${i}.${j}`: trang, chỉ số bài trong `PG[n].ex`, chỉ số ý. Tiến độ trắc nghiệm lưu ở `gul:done` dạng `q:<chủ đề>`.
- **Vị trí trong mã cũ.** `exKey` và `exDone` (gần `const HI=`); `openQuiz` ghi `gul:done`.
- **Số lượng.** 510 ý, 60 bộ trắc nghiệm.
- **Cách tạm xử lý.** `exercises[].legacy_ids = ["p<n>.ex<i>"]`. Id ý (`items[].id`) lấy theo nhãn in (`a`, `b`…); ý không có nhãn thì lấy `j+1`. Vì vậy khóa cũ `n.i.j` đổi được thành `<id bài>.<id ý>` bằng quy tắc, không cần bảng tra. Khóa `q:t1` tương ứng với `t1.quiz`.
- **Đề xuất cho tầng 0.** Thêm `exercise_item.legacy_ids`, hoặc ghi quy tắc đổi khóa vào README của schema.

## TC-2. Id bền khi một trang có nhiều dãy số trùng nhau
- **Mô tả.** Quy tắc D2 S7 là `p21.q5`. Nhưng trên cùng một trang thường có hai dãy số bắt đầu lại từ 1: câu hỏi cuối bài, rồi dãy bài trong "N-mashq". Còn có test ôn chương, và các bước thực hành đánh dấu ★.
- **Vị trí trong mã cũ.** `PG[n].ex[].no`. Có 54 cặp trùng trên cùng một trang.
- **Số lượng.** 482 bài. Có 54 lần trùng số trên cùng một trang. Quy ước dưới đây gỡ được bằng tên dãy in sẵn; còn lại 16 bài phải dùng hậu tố nhóm.
- **Cách tạm xử lý** (`_work/convert.py`):
  - Bài thuộc dãy "N-mashq" có id `p21.m4.q1`. Dãy này được xác định bằng tiêu đề `tr` dạng "N-mashq" và kéo sang trang sau cho tới tiêu đề "N-§" kế tiếp.
  - Test ôn chương có id `p166.test.q1`.
  - Số còn trùng thì thêm nhóm `.g2`, `.g3` theo thứ tự in: `p55.g2.q1`, `p47.g2.qstar`.
  - Ký tự đặc biệt trong số in: `★` thành `star`, `*` thành `s`, `–` thành `-`.
- **Đề xuất cho tầng 0.** Đưa quy ước `m<N>`, `test`, `g<k>` vào README của schema (quy ước id bền). Cân nhắc thêm trường `exercise.series`, ví dụ `{kind: "mashq", no: 4}`, để không phải mã hóa thông tin này vào id.

## TC-3. Tỉ lệ ảnh trang
- **Mô tả.** Mã cũ viết cứng kích thước ảnh trang 1241×1879 khi cắt ảnh cho cảnh `img`. Thư viện mô phỏng (`sim.scene_page_image.page_aspect`) nói giá trị này "phải lấy từ profile", nhưng book.schema chưa có trường nào chứa nó.
- **Số lượng.** 311 cảnh, 1 giá trị cho cả cuốn.
- **Cách tạm xử lý.** Không ghi. Đầu đọc tự đo kích thước ảnh, và cắt đúng trong bản xem trước.
- **Đề xuất cho tầng 0.** Thêm `profile.volumes[].page_px: [w, h]`.

## TC-4. Đầu đọc còn thiếu renderer
Các mục này có đủ dữ liệu trong `book.json`, nhưng đầu đọc hiện khung "chưa hỗ trợ". Số liệu đo bằng `_work/thu-ho-tro.js`.

| kind | số lượng | mã cũ |
|---|---|---|
| `ex.order` | 37 bài | `openModel` k='order' |
| `sim.scene_steps` | 229 cảnh | `V()` k='steps' |
| `sim.scene_text_lines` | 211 cảnh | `V()` k='lines' |
| `sim.circuit` | 83 cảnh | `__DRAW.pCircuit` |
| `sim.magnetic_field` | 43 cảnh | `__DRAW.pField` |
| `sim.scene_icon_grid` | 27 cảnh | `__DRAW.cIcons` |
| `sim.electric_charges` | 24 cảnh | `__DRAW.pCharge` |
| `sim.graph_plot` | 21 cảnh | `__DRAW.pGraph` |
| `sim.electrolysis` | 11 cảnh | `__DRAW.pElectro` |
| `sim.ionic_bond` | 1 cảnh | `__DRAW.cIonic` |

- Đã có renderer: `sim.scene_page_image` (311 cảnh), `sim.atom_shells` (8 cảnh), `ex.short_answer`, `ex.open_response`, `ex.choice_single`, `ex.sort_bins`.
- Tổng cộng 650/969 cảnh và 37/541 bài chưa hiện được. Tham số đã tách đúng theo `params` của thư viện (M5).
- **Đề xuất.** Ưu tiên `scene_steps` và `scene_text_lines`: dễ làm, phủ 440 cảnh. Sau đó tới `circuit` và `ex.order`. Không viết lại core.

## TC-5. Cảnh báo chất lượng OCR
- **Mô tả.** Ngăn "Tarjima" của mã cũ ghi chú rằng văn bản OCR bản tiếng Nga có thể sai ở công thức. Schema chưa có trường cho mức tin cậy của `pages[].ocr`.
- **Số lượng.** 1 cảnh báo, áp cho 175 trang. Trang 157 có OCR rỗng.
- **Cách tạm xử lý.** Ghi trong `profile.edition.note` và trong `features.json`.
- **Đề xuất.** Thêm `print_text`/`ocr` meta, ví dụ `{source: "ocr", reviewed: false}`.

## TC-6. Gán bài trang vào bài học
- **Mô tả.** Mã cũ không gắn bài tập trên trang với chủ đề TP. Nhưng D2 chọn giao bài theo `lesson`.
- **Cách tạm xử lý.** Mỗi bài trên trang được gán `lesson` = chủ đề `t*` có khoảng trang chứa trang đó. Khoảng trang tính từ `TP[t].page` tới trang trước `t` kế tiếp. Kết quả: 482/482 bài được gán, ghi vào `lessons[].exercise_refs` và `page_range`. Đây là phần suy ra, không phải dữ liệu gốc. Giáo viên nên xem lại các bài ở ranh giới giữa hai bài học.

## Không chuyển (mã thừa theo kiểm kê)
Không mang sang:
- Các nhánh `V()`/`openModel` của Toán và Tin: pv, shift, frac, area, tri, cuboid, ratio, sheet, keys, blocks.
- Script "Hoạt hình hoá học" và các hàm `__DRAW.cReact` / `cMol` / `cTube`.
- Chuỗi `U.*` của cuốn Toán/Tin.
- `window.DM` rỗng.
- Chữ "Encarta" trong `<title>`.

Chuỗi giao diện chung thuộc `tang0/giao-dien`.

Robo (tools `open_lesson`, nhắc việc, đố nhanh lấy từ `t*.quiz`) và trình quản lý video hàng loạt của giáo viên là tính năng, không phải dữ liệu. Chúng đã được khai báo ở `features.json`: `tutor_chat`, `reminders`, `teacher_bulk_media`.
