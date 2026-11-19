# 032 – Dạng bài tiền đọc – viết và trò chơi chữ cho cấp 0–2

**Ưu tiên:** P1 · **Độ khó:** vừa · **Phụ thuộc:** [003](003-renderer-16-dang-bai-con-lai.md), [029](029-che-do-pre-reader.md), [034](034-cach-nhap-cho-tre-chua-go.md), [056](056-phuong-an-la-hinh.md) · **Số chỗ thiếu thô gộp vào:** 15

## Thay đổi gì
Thêm vào `thu-vien/bai-tap/danh-muc.json` (id, data_shape, chấm):
| id | gộp từ | chấm |
|---|---|---|
| `ex.word_search` | alifbe1_daftar C5 (tên từ bằng tranh), ingliz2_daftar C3 | tự động; ô "o‘" là một ô |
| `ex.color_regions` | alifbe1_daftar C1 `color_by_rule`, ingliz2_daftar C2 `colour_by_code` | tự động theo màu của vùng; chế độ tô tự do = `khong_cham` |
| `ex.dot_to_dot` | alifbe1_daftar C4, ingliz2_daftar C1 | thứ tự |
| `ex.find_in_picture` | alifbe1_darslik C8; ingliz2_daftar C7 `find_differences` (biến thể 2 tranh) | tập vùng đúng |
| `ex.syllable_split` | alifbe1_darslik C2 | số âm tiết / vị trí vạch |
| `ex.syllable_join` | alifbe1_darslik C9 (quạt âm tiết, nhiều–một) | tự động + đọc to từ ghép |
| `ex.sentence_scheme` | alifbe1_darslik C3 | số từ, chữ hoa đầu, dấu chấm |
| `ex.sound_scheme` | alifbe1_daftar C8 (dựa trên khối 030) | tự động |
| `ex.letter_change` | alifbe1_darslik C10 (đổi một chữ, sửa chữ sai) | tự động, bàn phím chỉ chữ đã học (034) |
| `ex.letter_discrimination` | alifbe1_daftar C3 (chữ lật gương, mê cung, gạch chữ) | tập ô đúng |
| `ex.sticker_place` | alifbe1_daftar C7 (21 ô "stiker uchun joy") | ô chấm + ô thưởng |
`ex.odd_one_out` (ingliz2_daftar C8) không thành dạng riêng: dùng `ex.choice_single` có phương án là hình (056).
Media: tranh nét vector hóa thành vùng kín; bộ nhãn dán số.

## Vì sao + bằng chứng
Bằng chứng theo bảng; ví dụ word_search: alifbe1_daftar tr.40 (lưới 9×9), tr.47; ingliz2_daftar tr.18, 49, 70. Tô màu: alifbe1_daftar tr.11, 26, 29; ingliz2_daftar tr.22, 23, 31. Nối điểm: alifbe1_daftar tr.29, 38; ingliz2_daftar tr.6, 9.

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** alifbe1_darslik, alifbe1_daftar, ingliz2_daftar, ingliz2_darslik.
- **Mở khóa:** Phần lớn bài của alifbe1_daftar và nửa bài viết của ingliz2_daftar.
- **Nguồn đã nêu chỗ thiếu này:** alifbe1_daftar, alifbe1_darslik, ingliz2_daftar

## Tương thích ngược
Có. Thêm id mới vào thư viện và trục 4.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P1
- Phụ thuộc: [003](003-renderer-16-dang-bai-con-lai.md), [029](029-che-do-pre-reader.md), [034](034-cach-nhap-cho-tre-chua-go.md), [056](056-phuong-an-la-hinh.md)

## Cần người quyết
Tô màu: gộp "tô theo mã" (en) và "tô theo luật" (uz) thành một `ex.color_regions` có `rule` không? Đề xuất: gộp.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 105 | alifbe1_daftar | ex | ex.color_by_rule | Tô màu tranh nét: (a) tô theo mã (vùng có O‘ tô màu 1, o‘ màu 2…), (b) tô bóng bay/ô theo luật (âm tiết mở đỏ, đóng xanh), (c) tô tranh có … |
| 107 | alifbe1_daftar | ex | ex.letter_discrimination | Phân biệt hình chữ: chọn chữ viết đúng giữa chữ bị lật gương/xoay (N vs ꓠ, n vs u), đi theo đường chữ M đúng qua mê cung, gạch bỏ chữ N bằn… |
| 108 | alifbe1_daftar | ex | ex.dot_to_dot | Nối các điểm theo thứ tự số để hiện chữ/từ rồi nói từ đó. Cần dạng bài: danh sách điểm có số, người học chạm/kéo lần lượt, hình hiện dần; c… |
| 109 | alifbe1_daftar | ex | ex.word_search | Lưới chữ tìm từ (ngang/dọc), tên từ cho bằng TRANH chứ không bằng chữ. Khác ex.crossword (điền ô theo gợi ý). Cần: lưới chữ, danh sách từ =… |
| 111 | alifbe1_daftar | ex | ex.sticker_place | Nhãn dán thưởng/đáp án: 21 ô 'stiker uchun joy' và bài 'Rasmlarga mos so‘zlarni toping' có ô stiker. Tờ nhãn dán không có trong PDF. Cần bộ… |
| 116 | alifbe1_daftar | media | media_dac_thu[1] | Tranh nét (line art) vector hóa thành vùng kín để tô màu; bộ nhãn dán số |
| 127 | alifbe1_darslik | ex | ex.syllable_split | Chia từ thành âm tiết / đếm âm tiết: khung chữ nhật chia ô theo số âm tiết dưới tranh; trẻ nói từ, vỗ tay theo âm tiết, chọn số ô. Bản số: … |
| 128 | alifbe1_darslik | ex | ex.sentence_scheme | Sơ đồ câu (gap chizmasi): dãy hình chữ nhật = số từ, ô đầu có vạch đứng (chữ hoa), cuối là dấu chấm. Trẻ nghe/nhìn tranh, nói một câu rồi đ… |
| 133 | alifbe1_darslik | ex | ex.find_in_picture | Tìm vật trong tranh lớn: chạm các vật có hình giống chữ / có âm đang học; tranh có nhiều vùng ẩn đáp án. kham_pha_hinh (sim.figure_explorer… |
| 134 | alifbe1_darslik | ex | ex.syllable_join | Ghép âm tiết: sơ đồ quạt nối nhiều âm tiết vào một âm tiết giữa (yo/ba/ta/laq → qa → ror/tor/tiq/yiq) hoặc chọn âm tiết thứ hai để thành từ… |
| 135 | alifbe1_darslik | ex | ex.letter_change | Biến đổi từ theo chữ: đổi một chữ thành từ mới (ot→on→ota→ana→ona), sửa chữ sai trong nhãn tranh (to‘di→to‘ti, to‘mka→to‘nka), khung chữ đọ… |
| 222 | ingliz2_daftar | ex | ex.dot_to_dot | Nối điểm theo thứ tự (chữ cái a→f, A→H, số) để hiện hình; tô màu và nói tên hình. |
| 223 | ingliz2_daftar | ex | ex.colour_by_code | Tô màu theo mã (1=red, 2=green…) hoặc tô theo câu ('a pink mouse'): vùng tô được định nghĩa sẵn, chấm tự động theo màu đúng của vùng. Kiểm … |
| 224 | ingliz2_daftar | ex | ex.word_search | Tìm từ trong lưới chữ (ngang/dọc), khoanh rồi viết ra. ex.crossword không phủ được (không có gợi ý, chỉ có lưới + danh sách/ số từ cần tìm). |
| 228 | ingliz2_daftar | ex | ex.find_differences | Tìm điểm khác nhau giữa hai tranh rồi viết câu (Picture A/Picture B: 'a white hat' / 'a red hat'). |
