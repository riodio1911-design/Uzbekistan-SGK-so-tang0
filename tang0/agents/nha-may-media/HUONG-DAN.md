# Hướng dẫn: hệ multi-agent sản xuất media trong mỗi cuốn (tầng 0, thử nghiệm 1)

## Bối cảnh
Đọc trước `$R/tang0/agents/hop-nhat/HUONG-DAN.md` (bối cảnh dự án, quyết định D1, quy ước chung).
`$R` = `/tmp/claude-0/-home-claude/e3e1398d-f184-5955-a6fb-f2c5412374f6/scratchpad`

Tầng 0 v0.9 nháp đã có: `tang0/schema/` (book.schema.json có `$defs` media, clip, video, media_override; `media.clips[id][lang]` có `source_hash` sha256), `tang0/thu-vien/mo-phong/` (57 `sim.*`, video dựng bằng mã = chuỗi cảnh, mỗi cảnh một sim), `tang0/thu-vien/bai-tap/`, `tang0/gia-su/`, `tang0/tri-thuc/` (thuật ngữ 3 thứ tiếng, `cap-tuoi.md`), `tang0/tu-dien-truc.json` (nguồn duy nhất giá trị 9 trục; giá trị trục mới phải thêm vào đây và ghi ở BAO-CAO, không tự đặt tên khác).

Ý đồ của người dùng: **trong mỗi cuốn lại có một hệ multi-agent sản xuất audio, video minh họa và các hình thức khác để sách sinh động.** Các cuốn dùng chung một "nhà máy media" (dịch vụ dùng chung, nhận phiếu đặt hàng, không làm lại file đã có nhờ `source_hash`). Mỗi cuốn có một tổ sản xuất (đạo diễn + các agent chuyên môn) tự lập phiếu từ book.json/features.json rồi gửi nhà máy.

Công cụ ngoài dự kiến (chỉ thiết kế, phiên này KHÔNG gọi được mạng ngoài):
- ElevenLabs: TTS; tiếng Uzbek chỉ có ở mô hình Eleven v3; Scribe (speech-to-text) dùng để kiểm tra ngược bản thu.
- HeyGen: video người dẫn (avatar), có tiếng Uzbek.
- Video hoạt hình dựng bằng mã (HTML/SVG/canvas từ `sim.*`) — 7 cuốn đều đã có, có thể quay thành mp4 bằng Playwright khi cần.
- Ảnh minh họa: công cụ tạo ảnh (chưa chốt), luôn qua kiểm duyệt nội dung theo cấp lớp.

Ràng buộc artifact đã biết: tổng dung lượng gần giới hạn ~256 MB/cuốn (kimyo8 ~118 MB), mỗi asset tối đa ~20 MB; 4 cuốn họ A dùng giọng trình duyệt cho uz/ru (chỉ tiếng Việt thu sẵn); ~200 MB audio thừa đã gỡ 6/11 (audio fx của biologiya5 là lời đọc 400 điểm hình chưa nối vào).

## Quy tắc chung
- Chỉ đọc mọi thứ ngoài thư mục được giao; không publish, không sửa artifact, không gọi API ngoài.
- Không bịa số: số đếm lấy từ mã/file; ước lượng phải ghi "ước lượng" và cách tính.
- Khóa máy tiếng Anh snake_case hoặc theo quy ước schema; tài liệu tiếng Việt.
- Kết thúc bằng `BAO-CAO.md` (≤ 250 chữ) trong thư mục của mình; trả lời ngắn: file đã tạo + 5 dòng nổi bật.

## M1. Kiểm kê media → `$R/tang0/nha-may-media/kiem-ke/`
Nguồn: `$R/kiem-ke/<cuon>.json` (mục media, kich_thuoc), mã HTML (`$R/fix2/{tabiiy5,adabiyot5}/index.html`, còn lại `$R/fix/<cuon>/index.html`; không Read cả file, dùng `python3 -I`), danh sách file của artifact (công cụ Artifact action "list", scope "files", url trong kiem-ke json — chỉ đọc). Có thể tái dùng `$R/tang0/tri-thuc/_scripts/dump.js` (chạy script của sách trong vm, DOM giả) để lấy dữ liệu thật.
Đầu ra:
- `media-hien-co.csv`: mỗi dòng một nhóm media đang có: `book, loai (thuyet_minh|doc_theo_cau|video_ma|video_nguoi_dan|anh_trang|anh_minh_hoa|hieu_ung|khac), ngon_ngu, nguon (file thu san|tts_trinh_duyet|dung_bang_ma), so_luong, mb, gan_voi (trang/bài/khối), ghi_chu`.
- `nhu-cau.json`: theo từng cuốn, mỗi "điểm cần media" (trang, bài, khối, hình khám phá, bài tập có lời đọc, cảnh video): id ổn định (theo id trong schema/vi-du nếu có), loại media cần, ngôn ngữ, văn bản nguồn (độ dài ký tự; KHÔNG chép nguyên văn dài, chỉ ký tự + 80 ký tự đầu), trạng thái `co_san|thieu|chi_tts_trinh_duyet|thua`.
- `tong-hop.csv`: theo cuốn × ngôn ngữ: số điểm, tổng ký tự cần TTS, số đã có bản thu, số thiếu, số phút ước lượng (ghi công thức, ví dụ ~900 ký tự/phút), MB ước lượng ở mp3 64 kbps.
- `BAO-CAO.md`.

## M2. Thiết kế nhà máy + tổ sản xuất → `$R/tang0/nha-may-media/`
(không ghi vào `kiem-ke/` — thư mục đó của M1)
- `danh-muc-loai-media.json`: các loại media sách có thể đặt (thuyết minh trang/bài, đọc theo câu có mốc thời gian, lời đọc điểm hình, video hoạt hình dựng bằng mã, video người dẫn, ảnh minh họa, hiệu ứng âm thanh, phụ đề, bản quay mp4 của mô phỏng…). Mỗi loại: id `media.*`, mô tả, công cụ sản xuất, đầu vào cần, định dạng ra (codec, bitrate, kích thước tối đa), tiêu chí kiểm tra, trục liên quan (giá trị từ tu-dien-truc.json), cấp lớp phù hợp.
- `phieu-dat-hang.schema.json` (JSON Schema 2020-12): phiếu = {book, item_id, media_type, lang, source (văn bản/kịch bản/tham số cảnh), voice/persona, constraints, source_hash (sha256 của mọi đầu vào ảnh hưởng kết quả), priority, status vòng đời: moi → kich_ban → san_xuat → kiem_tra → dat|lam_lai → giao}. Phải khớp `book.schema.json` `$defs.clip/media/video` (đọc trước; nếu cần thêm trường thì ghi "đề xuất sửa schema" trong BAO-CAO, không sửa schema).
- `ket-qua.schema.json`: biên bản giao: file, thời lượng, mốc câu, kết quả kiểm tra (vd. sai số STT), người/agent duyệt.
- `to-san-xuat.md`: sơ đồ (mermaid trong code block) và đặc tả từng agent trong tổ của MỖI cuốn và trong nhà máy dùng chung: Đạo diễn media (lập phiếu từ book.json + features.json), Biên kịch (lời thuyết minh/kịch bản theo cấp lớp, dựa `tri-thuc/cap-tuoi.md`, thuật ngữ chuẩn từ `thuat-ngu.csv`), Giọng đọc (TTS), Kiểm âm (STT ngược, phát âm thuật ngữ), Dựng cảnh (video từ `sim.*`), Người dẫn (HeyGen), Minh họa, Đồng bộ & phụ đề, Kiểm duyệt nội dung (phù hợp trẻ, đúng kiến thức), Đóng gói (đặt file vào artifact, giữ dưới giới hạn dung lượng). Mỗi agent: đầu vào, đầu ra, quy tắc, "xong khi", điểm cần người duyệt (ví dụ duyệt giọng đọc mẫu cho mỗi ngôn ngữ, duyệt avatar).
- `quy-tac-cache.md`: tính source_hash, khi nào làm lại, cách tái dùng giữa các cuốn (cùng thuật ngữ, cùng cảnh sim), đặt tên file, thư mục `audio/<lang>/`, `video/`.
- `agents/<vai-tro>.md`: bản hướng dẫn ngắn để chạy được từng agent (theo mẫu của `$R/kiem-ke/HUONG-DAN.md`).
- `lap-phieu.py`: script của agent Đạo diễn: đọc `kiem-ke/nhu-cau.json` (do M1 tạo; nếu chưa có thì viết sao cho chạy được khi có, và tự thử bằng dữ liệu giả nhỏ trong `_thu/`), sinh phiếu hợp lệ theo schema vào `phieu/<cuon>/*.json` cho các điểm `thieu|chi_tts_trinh_duyet`, kèm tổng hợp. Kiểm tra phiếu bằng jsonschema.
- `BAO-CAO.md`.
