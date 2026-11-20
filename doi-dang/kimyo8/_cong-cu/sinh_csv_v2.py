# Sinh bang-doi-dang-v2.csv: lấy các cột mô tả bản cũ từ bang-doi-dang.csv (v1), ghi trạng thái v2 + cột so với v1.
import csv, os, collections
D = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
v1 = list(csv.DictReader(open(os.path.join(D, 'bang-doi-dang.csv'), encoding='utf-8')))
# id: (trạng thái v2, chênh lệch v2 / bằng chứng, ảnh-id v2, ưu tiên còn lại, ghi chú thành phần)
V2 = {
 'R01': ('ngang', 'Robot SVG nổi góc phải (đo .rb-btn svg = 1), components/tutor/robo.js', 'F08'),
 'R02': ('ngang', 'Tư thế rb-wave khi chào; đủ 5 tư thế theo R (giữ lớp .rb-*)', 'F08'),
 'R03': ('ngang', 'Bong bóng hiện khi mở sách (ảnh F08: bong bóng bài + Đố nhanh/Hỏi đáp/+ Nhắc bài tập)', 'F08'),
 'R04': ('hơn', 'Lật p19→p21: bong bóng "Bài 4…" + Đố nhanh + Hỏi đáp + Nhắc bài tập (đo bổ sung do-them-v2.js, ảnh F14b). Kịch bản chính F14 không bắt được bong bóng vì 2,2 s sau một lần lật, nhưng đo lại thấy có', 'F14b'),
 'R05': ('ngang', 'Chat có ngữ cảnh trang, 3 tin, stream, nút Dừng (đo F09: chips 4, msgs 3)', 'F09'),
 'R06': ('ngang', 'open_lesson / add_reminder / list_reminders truyền vào sample (theo R; AI giả lập không gọi tool nên chưa kiểm hành vi tool thật)', 'F09'),
 'R07': ('ngang', '4 chip giống bản cũ', 'F09'),
 'R08': ('hơn', 'Đố nhanh chấm ngay, thêm nút "Câu khác"', 'F10'),
 'R09': ('ngang', 'Tab Nhiệm vụ thêm task (đo tasks 1, cards 3 – bằng bản cũ)', 'F11'),
 'R10': ('ngang', 'Task quá hạn → bong bóng ⏰ + Xong/Nhắc lại sau 10 phút, badge 1', 'F13'),
 'R11': ('ngang', 'Giờ học hằng ngày + Bước tiếp theo (card) có trong tab Nhiệm vụ', 'F11'),
 'R12': ('ngang', 'Hướng dẫn 4 card (bằng bản cũ). Còn nhỏ: biểu tượng ghim chỉ có màu, chưa có hình', 'F12'),
 'R13': ('ngang', 'Nút 🔊 Nghe + chọn UZ/VI/RU riêng trong bảng Robo', 'F09'),
 'R14': ('ngang', 'Như v1', 'F15'),
 'L01': ('ngang', 'Mặc định không ?lang= → T0.lang = vi (đo F02 lang=vi)', 'F02'),
 'L02': ('ngang', 'Bong bóng: dòng uz gốc + dòng vi + nút Nghe', 'F03'),
 'L03': ('ngang', 'Ô ngôn ngữ có "Việt+Рус"/"Рус+Việt"; bong bóng uz + VI + RU', 'F04'),
 'L04': ('ngang', 'Nhãn kép "uz · vi" (Tarjima · Bản dịch, Tekshirish · Kiểm tra…), nút UZ để tắt dòng gốc', 'F02'),
 'L05': ('ngang', 'Mở video ở mặc định: phát vi_1.mp3 (Audio đang chạy, t=3,4 s – do-them-v2.js)', 'F44b'),
 'L06': ('ngang', 'Phụ đề uz + vi trong trình phát', 'V-cShell'),
 'L07': ('ngang', 'Nhãn trong SVG hai dòng uz/vi như TL() cũ', 'V-cShell'),
 'L08': ('ngang', 'Như v1', 'F15'),
 'G01': ('ngang', 'Select chương/bài (52 mục) từ units/lessons', 'F06'),
 'G02': ('ngang', 'Chân trang chú giải màu ghim + "4–5 / 208"', 'F02'),
 'G03': ('ngang', 'Nút [data-act=thumbs] → 208 hình thu nhỏ', 'F06'),
 'G04': ('hơn', 'Panel cạnh/tấm đáy giữ mở khi lật: ghi chú + đề bài tập có nút Mở, hai ngôn ngữ', 'F05'),
 'G05': ('ngang', 'Khối OCR bản Nga (.pm-ocr = 1) trong ngăn dịch', 'F05'),
 'G06': ('ngang', 'Như v1', 'F07'),
 'G07': ('ngang', 'Trải chẵn trái/lẻ phải (4–5, 20–21) như bản cũ', 'F05'),
 'G08': ('ngang', '#p37 mở đúng trang; lật → URL #p38', 'F43'),
 'G09': ('ngang', 'Như v1', 'F01'),
 'G10': ('ngang', 'Theo hệ thống tối (rgb 10,20,28) + nút đổi tay', 'F42'),
 'G11': ('hơn', 'Như v1', 'F03'),
 'B01': ('ngang', 'Như v1, nhãn kép', 'F15'),
 'B02': ('ngang', 'Lưu → "Saqlandi · Đã lưu" + LỜI GIẢI MẪU, ghim p37.q1 thành done (do-them-v2.js)', 'F16'),
 'B03': ('ngang', 'Như v1 (5 câu một lượt)', 'F17'),
 'B04': ('hơn', 'Như v1', 'F18'),
 'B05': ('ngang', 'Như v1', 'F19'),
 'B06': ('kém', 'Xử lý khi phát hành vào URL cũ (9aUM…): migrate.js + robo.js nhập kim8.ans/gul:done/robo.kim:*. Không tính chặn', ''),
 'B07': ('hơn', 'Như v1', 'F40'),
 'V01': ('ngang', 'Tự chạy khi mở, nút ‹ ❚❚ › 🔊, thanh tiến độ, "4 / 8"', 'V-cReact'),
 'V02': ('ngang', 'Như v1', 'V-img'), 'V03': ('ngang', 'Như v1', 'V-lines'), 'V04': ('ngang', 'Như v1', 'V-steps'),
 'V05': ('ngang', 'svg 136/131 phần tử, nhãn song ngữ', 'V-cReact'),
 'V06': ('ngang', '119/116 phần tử', 'V-cMol'),
 'V07': ('ngang', 'Vẽ lại theo __DRAW: 146/139 phần tử, electron quay, tô electron hóa trị', 'V-cShell'),
 'V08': ('ngang', 'cIonic 140/135, cTube 126/124, pGraph 115/111, pCharge 136/133', 'V-cTube'),
 'V09': ('ngang', 'Như v1', 'V-cFountain'),
 'V10': ('ngang', 'Như L05', 'F44b'),
 'T01': ('ngang', 'Nút "🎬 Videoni almashtirish · Thay video" trong trình phát, form chọn tiếng/URL/MP4', 'F41'),
 'T02': ('ngang', 'Nút 🎬 trên thanh trên → quản lý hàng loạt, bảng 134 hàng (133 video)', 'F40'),
 'T03': ('ngang', 'Như v1', 'F41'),
 'K01': ('ngang', 'Như v1', ''),
}
A = lambda i, s: '' if not i else (f"v2/{i}-{s}-390.png" if i.endswith('b') else f"v2/{i}-{s}-390.png;v2/{i}-{s}-1280.png")
H = list(v1[0].keys()) + ['trang_thai_v1', 'so_voi_v1']
rows = []
for r in v1:
    st, ch, img = V2[r['id']]
    old = r['trang_thai_ban_moi']
    rank = {'thiếu': 0, 'kém': 1, 'ngang': 2, 'hơn': 3}
    so = 'giữ nguyên' if st == old else ('tốt lên' if rank[st] > rank[old] else 'xấu đi')
    n = dict(r)
    n['trang_thai_v1'] = old; n['so_voi_v1'] = f'{so} ({old} → {st})'
    n['trang_thai_ban_moi'] = st; n['chenh_lech_cu_the'] = ch
    if img: n['anh_cu'] = A(img[:-1], 'cu') if img.endswith('b') else A(img, 'cu'); n['anh_moi'] = A(img, 'moi')
    if st in ('ngang', 'hơn'): n['uu_tien'] = '—'; n['uoc_luong_cong'] = '—'; n['thanh_phan_can_sua'] = '—' if old in ('ngang', 'hơn') else 'đã sửa (đợt R/L/N): ' + r['thanh_phan_can_sua']
    if r['id'] == 'B06': n['uu_tien'] = 'không chặn (xử lý khi phát hành)'
    rows.append(n)
with open(os.path.join(D, 'bang-doi-dang-v2.csv'), 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=H); w.writeheader(); w.writerows(rows)
c = collections.Counter(x['trang_thai_ban_moi'] for x in rows); print(len(rows), dict(c))
print(collections.Counter(x['so_voi_v1'].split(' (')[0] for x in rows))
