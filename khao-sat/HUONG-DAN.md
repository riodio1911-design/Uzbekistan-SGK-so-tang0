# Hướng dẫn khảo sát mẫu (sóng 0) – 12 file PDF, tìm phần tầng 0 còn thiếu

`$R` = `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad`, `$T` = `$R/tang0`. PDF ở `$R/khao-sat/pdf/` (CHỈ ĐỌC).

## Bối cảnh
Đọc nhanh `$T/agents/hop-nhat/HUONG-DAN.md` (dự án, khung 9 trục, D1) và `$T/quyet-dinh/D2.md`. Tầng 0 v0.9.0 được dựng từ 7 cuốn lớp 5 và lớp 8 (Toán, Tin, KHTN, Sinh, Văn, Hóa, Lý). Mỗi file PDF ở đây được chọn vì đại diện cho đặc tính CHƯA CÓ trong 7 cuốn đó. Nhiệm vụ của bạn: đọc mẫu và chỉ ra chính xác tầng 0 còn thiếu gì để làm được loại sách này.

Tầng 0 hiện có (đối chiếu với các file này, không đoán):
- `$T/tu-dien-truc.json` – mọi giá trị đã có của 9 trục.
- `$T/schema/book.schema.json`, `features.schema.json` – loại khối (`block.type`), loại ghim, cấu trúc trang, `reading`, `teacher`, `classroom`.
- `$T/thu-vien/bai-tap/danh-muc.json` (dạng `ex.*`), `$T/thu-vien/mo-phong/danh-muc.json` (`sim.*`).
- `$T/gia-su/prompts.json` (vai trò, luật theo cấp lớp — cấp 0-2, 3-4 chỉ là đề xuất).
- `$T/tri-thuc/rubric-bo-sach.json` (39 khái niệm bộ mục), `cap-tuoi.md`.
- `$T/nha-may-media/danh-muc-loai-media.json` (13 loại `media.*`).
- `$T/dau-doc/` (3 chế độ: pin, lesson, reading).

## Cách đọc (rộng nhưng nông, có bằng chứng)
- `pdfinfo`, `pdftotext -layout` (nhiều file là bản quét không có lớp chữ: ghi rõ "không có lớp chữ, cần OCR"). Chụp trang bằng `pdftoppm -r 60 -png -f N -l N` rồi xem bằng công cụ Read (ảnh). Xem ít nhất: bìa và 2–4 trang đầu (lời nói đầu, ký hiệu quy ước/bộ mục), mục lục, và 10–20 trang đại diện rải đều cả cuốn (bài mở đầu, bài giữa, ôn tập, phụ lục). Không đọc hết cuốn.
- Lưu ảnh đã chụp trong `$R/khao-sat/<ma>/_anh/` (chỉ những trang bạn trích dẫn).

## Đầu ra cho MỖI cuốn (`<ma>` = tên file không đuôi), trong `$R/khao-sat/<ma>/`
1. `<ma>.json`:
```json
{
 "ma": "geografiya7_darslik", "ten": "...", "lop": 7, "mon": "...", "loai": "darslik|daftar|metodika",
 "so_trang": 0, "lop_chu": "co|khong (ban quet)|mot_phan", "ngon_ngu_in": "uz (Latin)|uz (Kirin)|ru|en…",
 "cau_truc": "chương/bài/… mô tả ngắn, số bài ước lượng",
 "bo_muc_rubric": [{"ten_goc": "...", "y_nghia": "...", "khop_khai_niem": "<id trong rubric-bo-sach.json hoặc null>"}],
 "ho_so_9_truc": {"1": [...], "2": [...], "3": [...], "4": [...], "5": [...], "6": [...], "7": "...", "8": "...", "9": [...]},
 "da_co_trong_tang0": [{"truc": "3", "gia_tri": "<id có trong tu-dien-truc.json>", "bang_chung": "trang N"}],
 "con_thieu": [{"truc": "3|4|5|6|...", "de_xuat_id": "snake_case", "mo_ta": "...", "bang_chung": ["trang N: ..."], "tan_suat": "hiếm|thường|khắp cuốn", "thanh_phan_can": "block.type|ex.*|sim.*|media.*|che_do_doc|gia_su|schema|khac", "do_kho": "thấp|vừa|cao", "dung_lai_cho": "môn/lớp khác dùng được"}],
 "media_dac_thu": ["vd. nghe nhạc mẫu, phát âm tiếng Anh bản ngữ, bản đồ…"],
 "rui_ro": ["bản quyền ảnh/nhạc, OCR khó, chữ viết tay…"],
 "ghi_chu": "..."
}
```
2. `<ma>.md` (≤ 250 chữ): đặc tính nổi bật nhất, 3–5 thứ tầng 0 thiếu quan trọng nhất, cuốn nên làm bằng chế độ nào (pin / lesson / reading / chế độ mới?), rủi ro.

Quy tắc: CHỈ ĐỌC; chỉ ghi điều thấy trong PDF, mỗi mục "con_thieu" phải có trang làm bằng chứng; không sửa tầng 0; không publish; viết tiếng Việt, giữ nguyên tên gốc tiếng Uzbek/Anh. Kiểm tra JSON hợp lệ trước khi báo xong. Trả lời ngắn: file đã tạo + 5 dòng nổi bật (tập trung vào cái tầng 0 thiếu).
