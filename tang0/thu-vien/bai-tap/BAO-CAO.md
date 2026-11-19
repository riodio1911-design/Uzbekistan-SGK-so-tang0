# Báo cáo: B. Thư viện bài tập

**Đã làm:** đọc 7 bản kiểm kê và kiểm tra lại mã chấm trong HTML: `nrm/right` (4 cuốn), `grade/accept/genItem` (tabiiy5), `sorter/GACT/redi3/feedback` (biologiya5), `BLANK/task/feedback` (adabiyot5). Kết quả gồm `danh-muc.json` (22 dạng `ex.*` và 2 trợ giúp), `bang-anh-xa.csv` (84 dòng), `README.md` và `kiem_tra.py`.

**Tiêu chí "Xong khi": đạt.** `kiem_tra.py` báo không lỗi.
- 59/59 mã `loai_bai_tap` có dòng ánh xạ, kể cả 17 mã WB và lớp ô trên trang của tabiiy5.
- Mọi id trong danh mục đều có nguồn.
- Không có id hoặc tên trùng.
- 6 trường hợp cùng tên khác nghĩa đã tách và ghi chú: label, hint, table, ex.ans/ex.open, sim, WB mcq.

**Cần nhóm quyết ở D2:**
1. Chọn một bộ chuẩn hoá đáp án. `nrm_v1` bỏ dấu nháy, còn `accept_v2` đổi dấu nháy về ‘, nên với o‘/g‘ hai bộ cho kết quả khác nhau.
2. Cách chấm mặc định cho `ex.order`: theo vị trí, hay tất cả hoặc không.
3. `age_levels` đang hiểu là **cấp lớp** (lớp 5 → 5-7). Cần thống nhất với agent Schema và agent Thuật ngữ.
4. Có bật trục 5 `giao_vien` (giáo viên chấm câu mở) ở v1 không.
5. Ô tự do sinh từ WBGEO (không gắn đề) đang xếp tạm vào `ex.mark_done` và `ex.open_response`.

**Rủi ro:**
- Số lượng ở `sources` lấy từ kiểm kê. Riêng tách 21/8 của WB mcq là tự đếm bằng regex.
- `age_levels.suggested` là đề xuất, chưa kiểm chứng.
- Nhiều dạng của tabiiy5 viết cứng dữ liệu trong renderer.
