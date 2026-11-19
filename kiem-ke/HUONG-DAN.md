# Hướng dẫn agent Kiểm kê (bước ① – dựng tầng 0)

Bối cảnh: dự án chuyển sách giáo khoa giấy K12 Uzbekistan thành sách số (mỗi cuốn hiện là một trang HTML artifact viết riêng).
Đã có 7 cuốn; đang rút "tầng 0" (bộ tiêu chuẩn + thư viện dùng chung) từ 7 cuốn này. Bạn kiểm kê MỘT cuốn.

## Quy tắc
- CHỈ ĐỌC. Không xuất bản, không sửa artifact, không sửa file HTML, không nhắn cho người dùng.
- File HTML rất lớn (1–3 MB, nhiều base64). Đừng Read cả file: dùng script Python chạy với `python3 -I`, bỏ các khối base64/blob dài, rồi đọc từng phần mã JS/CSS/dữ liệu cần thiết.
- Danh sách file đi kèm (ảnh trang, audio, ảnh…): gọi công cụ Artifact với action "list", scope "files", url của cuốn (chỉ đọc). Tóm tắt theo thư mục: số file, tổng MB.
- Chỉ ghi điều thấy trong mã/file. Không đoán; chỗ không chắc ghi rõ "không chắc".
- Viết bằng tiếng Việt; giữ nguyên mã/khóa gốc (ví dụ `mcq`, `window.PG`).

## Đầu ra (bắt buộc, đúng đường dẫn)
1. `<thư mục kiem-ke>/<ma-cuon>.json` theo khung sau (có thể thêm khóa, không bỏ khóa):
```json
{
 "ma_cuon": "kimyo8", "ten": "Kimyo 8", "url": "...", "html_path": "...",
 "ho_bo_may": "A ghim trên trang | B dựng lại bài học | C đọc văn | lai (ghi rõ)",
 "kich_thuoc": {"html_bytes": 0, "so_file": 0, "tong_mb": 0, "theo_thu_muc": {"pages/": {"so_file":0,"mb":0}}},
 "cau_truc_du_lieu": [{"ten": "window.PG", "vai_tro": "...", "khoa": ["tr","ex","pin"], "vi_du_ngan": "..."}],
 "che_do_hien_thi": ["..."],
 "loai_khoi": [{"ma": "learn", "ten_vi": "...", "so_luong": 0, "mo_ta": "..."}],
 "loai_bai_tap": [{"ma": "mcq", "ten_vi": "...", "so_luong": 0, "cach_cham": "tu_dong|ai|giao_vien|khong_cham", "mo_ta": "..."}],
 "mo_phong": [{"ten": "...", "co_che": "mo_phong_tham_so|mo_hinh_3d|keo_tha|cong_cu_ao|kham_pha_hinh|hoat_hinh|khac", "mo_ta": "...", "dung_lai_cho": "môn/lớp khác có thể dùng"}],
 "media": {"audio": "...", "video": "...", "anh": "..."},
 "ngon_ngu": {"goc": "uz", "ho_tro": ["vi","ru"], "ban_in_song_song": false, "doc_theo_cau": false, "ghi_chu": "..."},
 "gia_su": [{"nhan_vat": "Robo", "vai_tro": "goi_y|tro_chuyen|cham_bai", "doc_tu_BOOK_PROFILE": true, "model_tier": "..."}],
 "tinh_nang": {"giao_vien_thay_media": false, "tai_vo_bai_tap": false, "giao_bai_ve_nha": false, "luu_ket_qua": false, "che_do_toi": false, "khac": ["..."]},
 "capabilities_dung_trong_ma": ["sample","db","user","assets","downloads"],
 "ho_so_9_truc": {"1_ban_in_goc": "...", "2_bo_muc_rubric": ["..."], "3_dang_noi_dung": ["..."], "4_dang_bai_tap": ["..."], "5_cach_cham": ["..."], "6_co_che_tuong_tac": ["..."], "7_nguoi_hoc": "...", "8_ngon_ngu": "...", "9_di_kem_rang_buoc": ["..."]},
 "ma_thua_hoac_loi": ["mã/dữ liệu sao chép từ cuốn khác không dùng, lỗi thấy được"],
 "ung_vien_dung_chung": [{"ten": "...", "vi_sao": "...", "vi_tri_trong_ma": "hàm/biến"}],
 "ghi_chu": "..."
}
```
2. `<thư mục kiem-ke>/<ma-cuon>.md`: tóm tắt ≤ 300 chữ cho người duyệt (điểm đặc trưng nhất của cuốn, thành phần đáng đưa vào tầng 0, rủi ro).

Khi xong, trả lời ngắn: đường dẫn 2 file + 5 dòng nổi bật nhất.
