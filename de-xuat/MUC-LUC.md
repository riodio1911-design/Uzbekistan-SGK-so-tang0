# Mục lục đề xuất bổ sung tầng 0 (sau v0.9.0) – chuẩn bị D3

Agent ⑥ Tiêu chuẩn, 19/11/2026. Đầu vào: bước ④ (7 cuốn: `books/*/tu-che.md`, `BAO-CAO.md`, `doi-chieu.json`, đếm lại trên `book.json`) và khảo sát sóng 0 (12 mẫu: `khao-sat/*/<ma>.json`: `con_thieu`, `media_dac_thu`, `rui_ro`). Đối chiếu tầng 0 v0.9.0 (`tu-dien-truc.json`, `schema/`, `thu-vien/`, `gia-su/prompts.json`, `nha-may-media/`, `dau-doc/`). Không sửa tầng 0.

## Thống kê
- **377 chỗ thiếu thô** (`tong-hop-cho-thieu.csv`): 103 từ bước ④, 274 từ khảo sát (149 `con_thieu` + 125 `media_dac_thu`/`rui_ro`).
- Gộp thành **65 đề xuất**: P0 15 · P1 35 · P2 15. 11 dòng không thành đề xuất (đã có ở D2, việc dịch T3, lỗi bản in, giới hạn nền tảng – ghi `khong_de_xuat`).
- Theo loại: media 67, quy_trinh 63, ex 52, schema 46, dau_doc_renderer 46, ban_quyen 22, block 18, truc 17, sim 14, id 11, gia_su 11, che_do_doc 10.
- 34 đề xuất có bằng chứng từ ≥ 3 nguồn (cuốn/mẫu) khác nhau.
- Đầu đọc hiện có: 5 renderer bài tập, 4 component mô phỏng. Trên 7 cuốn: **203/2.515 bài** và **1.849/3.712 cảnh** video hiện "Chưa hỗ trợ"; **142/144 mô phỏng tương tác** chưa chạy; **1.869 ô** trên trang vở không vẽ.

## Bảng đề xuất
| số | tên | ưu tiên | độ khó | 7 cuốn ảnh hưởng | nguồn (cuốn/mẫu) | phụ thuộc |
|---|---|---|---|---|---|---|
| [001](001-renderer-canh-chu-the.md) | Renderer 7 loại cảnh video dạng chữ và thẻ | P0 | thấp | matematika5, informatika5, tabiiy5, biologiya5, kimyo8, fizika8 | 6 | 012 |
| [002](002-renderer-ex-order.md) | Renderer ex.order (xếp thứ tự) và ảnh cho bước | P0 | thấp | informatika5, tabiiy5, biologiya5, kimyo8, fizika8 | 5 | – |
| [003](003-renderer-16-dang-bai-con-lai.md) | Renderer 16 dạng bài còn lại đã có trong thư viện | P0 | vừa | tabiiy5, biologiya5, adabiyot5, informatika5 | 3 | – |
| [004](004-renderer-mo-phong-hoa-ly.md) | Renderer 10 mô phỏng Hóa – Lý dùng chung | P0 | vừa | kimyo8, fizika8 | 2 | – |
| [005](005-renderer-mo-phong-toan.md) | Renderer 7 mô phỏng Toán và chuỗi đa ngữ của chúng | P0 | vừa | matematika5 | 1 | 012 |
| [006](006-screen-demo-va-bang-tinh.md) | sim.screen_demo, mẫu màn hình dùng chung và bảng tính | P0 | vừa | informatika5 | 1 | – |
| [007](007-mo-phong-khtn-va-canh-ve-tay.md) | Mô phỏng KHTN tabiiy5/biologiya5 và 88 cảnh vẽ tay | P0 | cao | tabiiy5, biologiya5 | 2 | – |
| [008](008-o-nhap-tren-trang-vo.md) | Vẽ ô nhập trên trang vở và mở rộng $defs/field | P0 | vừa | matematika5, tabiiy5, adabiyot5 | 3 | – |
| [009](009-giao-dien-vo-giao-bai-ket-qua-lop.md) | Giao diện vở, giao bài, kết quả lớp và công cụ giáo viên | P0 | cao | matematika5, informatika5, tabiiy5, biologiya5, adabiyot5, kimyo8, fizika8 | 3 | 008, 014, 015 |
| [010](010-che-do-trang-cho-trang-dung-lai-chu.md) | Chế độ trang cho trang dựng lại chữ và nền xóa chữ | P0 | vừa | biologiya5, adabiyot5 | 2 | 018 |
| [011](011-ghim-va-khoi-chua-mo-duoc.md) | Ghim và khối chưa mở được, khóa bộ mục lệch | P0 | thấp | tabiiy5, biologiya5, adabiyot5, matematika5 | 3 | 009 |
| [012](012-ky-phap-toan-noi-dong.md) | Dựng ký pháp toán nội dòng và dòng hướng dẫn gõ | P0 | thấp | matematika5, kimyo8 | 1 | – |
| [013](013-picture-story-chinh-thuc.md) | sim.picture_story có tham số block_ref và renderer | P1 | vừa | adabiyot5 | 1 | – |
| [014](014-chuyen-du-lieu-chay-cu.md) | Chuyển dữ liệu chạy cũ (localStorage, db) sang id mới | P0 | vừa | matematika5, informatika5, tabiiy5, biologiya5, adabiyot5, kimyo8, fizika8 | 5 | 015 |
| [015](015-quy-tac-id-ben-thong-nhat.md) | Quy tắc id bền thống nhất và trường exercise.series | P0 | thấp | matematika5, informatika5, tabiiy5, biologiya5, adabiyot5, kimyo8, fizika8 | 5 | – |
| [016](016-chuoi-trung-tinh-zxx.md) | Khóa zxx trong i18n cho chuỗi không ngôn ngữ | P1 | thấp | matematika5, kimyo8, fizika8 | 2 | – |
| [017](017-truong-mo-rong-x.md) | Trường mở rộng x_* thay dấu _tu_che | P1 | thấp | matematika5, informatika5, tabiiy5, biologiya5, adabiyot5, kimyo8, fizika8 | 2 | – |
| [018](018-hinh-hoc-trang-va-chu-in.md) | Kích thước trang, tỉ lệ ảnh, font in, meta OCR | P1 | thấp | matematika5, tabiiy5, biologiya5, adabiyot5, fizika8 | 5 | – |
| [019](019-truong-noi-dung-nho-buoc4.md) | Trường nội dung nhỏ còn thiếu từ bước ④ | P1 | thấp | informatika5, tabiiy5, biologiya5, adabiyot5 | 4 | 017 |
| [020](020-sua-lech-thu-vien-dau-doc-cong-cu.md) | Sửa lệch giữa thư viện, đầu đọc, ví dụ và công cụ | P0 | thấp | kimyo8, informatika5, adabiyot5 | 3 | – |
| [021](021-truc1-truc9-nguon-pdf-moi.md) | Giá trị trục 1 và trục 9 mới cho loại nguồn PDF | P1 | thấp | – | 8 | 010 |
| [022](022-sach-giao-vien-companion.md) | Loại sách giáo viên riêng đi kèm sách học sinh (companion) | P1 | vừa | – | 4 | 015 |
| [023](023-giao-an-lesson-plan.md) | $defs/lesson_plan: giáo án theo bài/tiết | P1 | vừa | – | 3 | 022, 025, 026 |
| [024](024-dap-an-chi-gv-xem.md) | Đáp án chỉ giáo viên xem và nối đáp án SGV vào bài của sách HS | P1 | vừa | – | 5 | 022 |
| [025](025-chuan-dau-ra-va-ke-hoach-tiet.md) | Chuẩn đầu ra, tiêu chí đánh giá, kế hoạch tiết, mức khó | P2 | vừa | – | 4 | 022, 023 |
| [026](026-thu-vien-phuong-phap-va-du-an.md) | Thư viện phương pháp dạy học method.* và dự án nhóm | P2 | vừa | – | 3 | 023 |
| [027](027-che-do-giao-an-trinh-chieu.md) | Chế độ "giáo án" và trình chiếu lớp | P1 | vừa | – | 3 | 022, 023, 024 |
| [028](028-gia-su-tro-ly-giao-vien.md) | Gia sư vai trò trợ lý giáo viên có nguồn thật | P1 | vừa | – | 3 | 023, 024 |
| [029](029-che-do-pre-reader.md) | Chế độ người học chưa biết đọc (pre_reader) | P1 | cao | – | 3 | 030, 034, 035, 062 |
| [030](030-khoi-am-chu.md) | Khối âm – chữ: sơ đồ âm, dải chữ đã học, bảng chạm nghe, rebus | P1 | vừa | – | 2 | 062 |
| [031](031-doc-theo-am-tiet.md) | Lớp đọc văn ở mức âm tiết | P1 | vừa | adabiyot5 | 1 | 030 |
| [032](032-dang-bai-tien-doc-viet.md) | Dạng bài tiền đọc – viết và trò chơi chữ cho cấp 0–2 | P1 | vừa | – | 3 | 003, 029, 034, 056 |
| [033](033-tap-viet-net.md) | Tập viết theo nét (tô chữ) và nền ô li / dòng kẻ | P2 | cao | – | 3 | 008, 034, 062 |
| [034](034-cach-nhap-cho-tre-chua-go.md) | Cách nhập cho trẻ chưa biết gõ: bàn phím chữ có tiếng, viết tay, trả lời bằng chạm | P1 | vừa | – | 2 | 008, 030 |
| [035](035-luat-gia-su-0-2.md) | Luật gia sư cấp 0–2 cho người chưa biết đọc và người mới học ngoại ngữ | P1 | vừa | – | 1 | 029, 030, 037 |
| [036](036-luat-gia-su-theo-mon-moi.md) | subject_rules mới cho 5 môn: tiếng mẹ đẻ, Sử, Vẽ kỹ thuật, Nhạc, Ngoại ngữ | P2 | vừa | – | 5 | 035 |
| [037](037-ngon-ngu-dich-en-va-ipa.md) | Ngôn ngữ đích (en) tách khỏi ngôn ngữ giảng dạy; IPA; từ điển tranh | P1 | vừa | informatika5 | 1 | – |
| [038](038-khoi-nghe-khong-in.md) | Khối bài nghe không in (audiomatn) có điểm dừng câu hỏi | P1 | vừa | – | 4 | 059, 061, 062 |
| [039](039-bai-nghe-roi-chon.md) | Dạng bài nghe rồi chọn/chạm (đề là audio) | P1 | thấp | – | 3 | 003, 056 |
| [040](040-ghi-am-va-cham-noi.md) | Ghi âm trong trình duyệt, nghe lặp lại, biểu diễn; chính sách chấm phát âm | P1 | cao | adabiyot5 | 4 | 003, 062 |
| [041](041-chinh-ta-nghe-viet-va-chep.md) | Chính tả nghe – viết, chép lại, chính tả tranh | P2 | vừa | – | 3 | 034, 062 |
| [042](042-hoi-thoai-dong-vai.md) | Khối hội thoại (bong bóng thoại) và đóng vai với gia sư | P1 | vừa | – | 1 | 037, 040 |
| [043](043-bai-hat-va-loi-dong-bo.md) | Bài hát/chant và lời đồng bộ (karaoke) | P2 | vừa | – | 2 | 051, 059, 061 |
| [044](044-tro-choi-lop-va-van-dong.md) | Thư viện trò chơi lớp, vận động theo lời (TPR), trò chơi thẻ nhóm | P2 | vừa | – | 2 | 026, 027 |
| [045](045-ban-do.md) | Bản đồ: khối bản đồ nhiều lớp, sim.map_view, bản đồ lịch sử theo thời gian, địa danh đa ngữ | P1 | cao | tabiiy5 | 4 | 059, 061 |
| [046](046-bai-tap-ban-do-toa-do.md) | Bài tập trên bản đồ và tọa độ: map_locate, map_blank, coordinate_read, dung sai | P1 | vừa | – | 4 | 045 |
| [047](047-dong-thoi-gian.md) | Dòng thời gian và bài đặt sự kiện lên trục năm (TCN/CN) | P1 | vừa | – | 1 | 002 |
| [048](048-bieu-do-so-lieu.md) | Khối biểu đồ vẽ từ số liệu và bài đọc biểu đồ | P1 | vừa | kimyo8, fizika8, tabiiy5 | 1 | 004 |
| [049](049-so-do-to-chuc-kien-thuc.md) | Sơ đồ tổ chức kiến thức (cụm, Venn, cây) – khối và bài tập | P2 | vừa | – | 2 | 026 |
| [050](050-tu-lieu-goc-nhan-vat-hien-vat.md) | Tư liệu gốc, phân tích nguồn, thẻ nhân vật, ảnh hiện vật | P1 | thấp | adabiyot5 | 2 | 059 |
| [051](051-khuong-nhac.md) | Khối khuông nhạc (MusicXML/ABC) và trình theo dõi nốt | P2 | cao | – | 1 | 043, 052 |
| [052](052-ban-thu-nhac-va-trinh-nghe.md) | media.music_recording, ghim "nghe" và trình phát danh sách | P2 | vừa | – | 1 | 059, 060, 061 |
| [053](053-dung-hinh-va-3d.md) | Hoạt hình dựng hình thước–compa và mô hình 3D có hình chiếu | P2 | cao | matematika5 | 1 | 005 |
| [054](054-ban-ve-ao.md) | Bàn vẽ ảo (thước, êke, compa) và bài dựng hình có chấm | P2 | cao | – | 1 | 053, 055 |
| [055](055-nop-bai-ve-va-cham-tieu-chi.md) | Nộp ảnh bài vẽ/bài làm giấy và GV chấm theo bảng tiêu chí có trọng số | P1 | vừa | tabiiy5 | 2 | 009 |
| [056](056-phuong-an-la-hinh.md) | Phương án trắc nghiệm và cột nối là hình | P1 | thấp | biologiya5, tabiiy5 | 2 | – |
| [057](057-dang-bai-tieng-me-de.md) | Dạng bài tiếng mẹ đẻ: chọn từ trong văn bản, sửa lỗi, chữ cái, viết có khung, tốc độ đọc | P1 | vừa | adabiyot5 | 2 | 003 |
| [058](058-quy-tac-chuyen-trac-nghiem-in.md) | Quy tắc chuyển trắc nghiệm in: nhãn A-B-D-E, tổ hợp mã hóa, câu phủ định | P2 | thấp | – | 2 | 002, 003 |
| [059](059-ban-quyen-media-rights.md) | Trường bản quyền rights{} và cổng chặn xuất bản | P1 | thấp | informatika5, kimyo8, adabiyot5 | 8 | – |
| [060](060-qr-va-lien-ket-ngoai.md) | Mã QR trên trang: ánh xạ sang media nội bộ hoặc liên kết ngoài | P1 | thấp | – | 4 | 059 |
| [061](061-nguon-goc-tu-nxb.md) | Quy trình xin nguồn gốc từ NXB: multimedia, nhãn dán, audio nghe, atlas, PDF sạch | P1 | thấp | – | 8 | – |
| [062](062-loai-media-moi.md) | Loại media.* mới cho nhà máy media | P1 | vừa | biologiya5 | 8 | 059, 061 |
| [063](063-bo-muc-moi.md) | Khái niệm bộ mục (rubric) mới | P1 | thấp | – | 4 | 029 |
| [064](064-diem-toi-da-theo-phan.md) | Điểm tối đa theo phần trong bài kiểm tra (Progress check) | P2 | thấp | – | 1 | 009 |
| [065](065-trang-phu-huynh-ho-so.md) | Trang hồ sơ học sinh và mục phụ huynh | P2 | thấp | – | 2 | 040 |

## Lộ trình đề nghị theo đợt

### Đợt 1 – P0: thay được 7 cuốn đang chạy (tầng 0 v0.10)
Không đổi khung 9 trục; chủ yếu là renderer đầu đọc, cộng 2 thay đổi schema nhỏ (015 `exercise.series`, 008 `field.type/part`) và 1 bước chuyển dữ liệu.

| bước | đề xuất | mở khóa trên 7 cuốn |
|---|---|---|
| 1a. Chốt trước khi publish | 015 id bền thống nhất, 020 sửa lệch | khóa lưu ổn định cho `res/`; sinh lại id m5, inf5, kim8 |
| 1b. Renderer dễ, phủ rộng | 001 cảnh chữ/thẻ, 012 phân số, 002 `ex.order`, 011 ghim/khối | 1.370 cảnh, ≈6.300 phân số, 80 bài, 124 ghim + 64 khối |
| 1c. Bài tập và trang | 003 16 dạng bài, 008 ô trên trang vở, 010 trang dựng lại chữ | 123 bài, 1.907 ô, 96 trang biologiya5, 1.432 điểm chạm adabiyot5 |
| 1d. Mô phỏng | 004 Hóa–Lý, 005 Toán, 006 screen_demo, 007 KHTN (tạm: chạy mã cũ / video) | 303 + 76 + 12 + 88 cảnh; 33 + 81 + 3 + 28 mô phỏng tương tác |
| 1e. Lớp học và dữ liệu cũ | 009 vở/giao bài/kết quả lớp, 014 chuyển localStorage + db | tính năng lớp học của cả 7 cuốn; giữ bài làm và video GV đã gắn |

Thứ tự thay cuốn gợi ý (theo phần còn thiếu, ngoài phần chung 009, 014, 015, 020 cho mọi cuốn): kimyo8 (sau 001, 002, 004) → fizika8 (cùng gói) → matematika5 (001, 005, 008, 009, 012) → informatika5 (001, 002, 006) → adabiyot5 (003, 008, 010) → biologiya5 (001, 002, 003, 007, 010, 011) → tabiiy5 (nhiều nhất: 003, 007, 008, 011).
Đi kèm (P1, không chặn): 013, 016, 017, 018, 019.
**Khởi động ngay song song:** 061 (xin nguồn NXB) vì thời gian chờ dài và chặn đợt 2.

### Đợt 2 – P1: mở khóa loại sách mới (tầng 0 v0.11)
| gói | đề xuất | mở khóa mẫu sóng 0 |
|---|---|---|
| 2a. Nền chung | 021 trục nguồn PDF, 059 bản quyền, 060 QR, 062 loại media mới, 063 bộ mục mới, 056 phương án là hình | mọi mẫu |
| 2b. Sách giáo viên | 022 companion, 023 lesson_plan, 024 đáp án chỉ GV, 027 chế độ giáo án, 028 gia sư trợ lý GV | 3 metodika |
| 2c. Chưa biết đọc | 029 pre_reader, 030 khối âm–chữ, 031 đọc âm tiết, 032 dạng bài tiền đọc, 034 cách nhập, 035 luật gia sư 0–2 | alifbe1 ×2 |
| 2d. Ngôn ngữ và nghe–nói | 037 en/IPA, 038 khối nghe, 039 nghe–chọn, 040 ghi âm, 042 hội thoại, 057 dạng bài tiếng mẹ đẻ | ingliz2 ×2, onatili3 ×2 |
| 2e. Địa – Sử | 045 bản đồ, 046 bài bản đồ, 047 dòng thời gian, 048 biểu đồ, 050 tư liệu gốc | geografiya7 ×2, tarix7 ×2 |
| 2f. Nộp bài vẽ | 055 nộp ảnh + chấm tiêu chí | chizmachilik8 (phần bài tập), ingliz2_daftar |

### Đợt 3 – P2: hoàn thiện
025 chuẩn đầu ra, 026 thư viện phương pháp, 033 tập viết nét, 036 luật gia sư theo môn, 041 chính tả, 043 bài hát, 044 trò chơi lớp, 049 sơ đồ, 051 khuông nhạc, 052 bản thu, 053 dựng hình/3D, 054 bàn vẽ ảo, 058 trắc nghiệm in, 064 điểm theo phần, 065 trang phụ huynh. musiqa5 và chizmachilik8 đầy đủ chỉ sau đợt này.

## Câu hỏi cần nhóm duyệt quyết ở D3
Mỗi câu kèm phương án đề xuất. Năm câu đầu chặn đợt 1.

1. **Phạm vi đợt 1** (001–012, 014, 015, 020): thay 7 cuốn chỉ khi đủ P0 của cuốn đó, hay cho phép thay sớm khi còn cảnh "chưa hỗ trợ"? → Đề xuất: thay theo từng cuốn khi P0 của cuốn đó xong; không publish bản có khung "Chưa hỗ trợ".
2. **Quy tắc id bền** (015): chốt `p<trang>[.<series>].q<số>` với token `m<N>`/`test`/`amaliy`/`g<k>` và bảng slug (★→star…); sinh lại id của m5, inf5, kim8? → Đề xuất: có, theo cách của fizika8.
3. **Mô phỏng tabiiy5** (007): chấp nhận chạy mã cũ (`sim.legacy_embed`) hoặc video ghi sẵn để thay cuốn trước khi có renderer chuẩn? → Đề xuất: có, gắn cờ trục 9 `ma_cu_nhung_tam`, hạn gỡ ở đợt 2.
4. **Dữ liệu học sinh cũ** (014): chuyển localStorage + db `media/`, `edit/`, `quiz/` sang id mới hay chấp nhận làm lại? → Đề xuất: chuyển một lần, tự động khi mở bản mới.
5. **Mẫu stage của screen_demo** (006): tài sản thư viện (preset) hay của cuốn? → Đề xuất: preset trong thư viện; `stage_def` chỉ để mở rộng.
6. **Ngân sách fizika8**: gói ≈ 244 MB sau khi tách RU (mục tiêu D2 ≤ 230 MB, trần 256 MB). Chuyển thêm gì sang artifact đồng hành? → Đề xuất: chuyển audio ru sang artifact đồng hành như ảnh `pages_ru/`; giữ 64 kbps.
7. **Sách giáo viên** (022): book riêng liên kết `companion_of` hay volume trong book HS? → Đề xuất: book riêng (quyền xem khác, giới hạn 256 MB).
8. **Đáp án chỉ GV** (024): lưu ở đâu để HS không đọc được qua mã trang? → Đề xuất: db có luật đọc theo `canEdit`; cần xác nhận nền tảng hỗ trợ trước khi làm 3 metodika.
9. **Giáo án AI sinh** (023): bài không có giáo án (≈18/60 ở geografiya7) có cho AI sinh theo khung? → Đề xuất: có, nhãn "bản nháp AI" tới khi GV duyệt.
10. **Ngôn ngữ đích** (037): bản vi có dịch nội dung tiếng Anh không? → Đề xuất: không; chỉ dịch chỉ dẫn và ghi chú cho người duyệt.
11. **Giọng nói trẻ em** (040): lưu bản ghi không, bao lâu, ai nghe? Nhận dạng giọng nói có được tính điểm? → Đề xuất: chỉ GV lớp nghe, xóa khi chấm xong/hết năm học, cần đồng ý phụ huynh cho cấp 0–4; nhận dạng chỉ gợi ý, không tính điểm.
12. **Chính sách giọng** (062): loại media nào bắt buộc giọng người? → Đề xuất: âm vị uz, phát âm en mẫu, đọc diễn cảm thơ; còn lại TTS có duyệt CER như D2.
13. **Nguồn từ NXB** (061, 038): ai liên hệ Novda/RTM/eduportal, hạn chót; nếu không có audio/multimedia gốc thì sao? → Đề xuất: hoãn ingliz2 và musiqa5 đến khi có nguồn; alifbe1 thu âm lại âm vị; không tự soạn bài nghe thay sách.
14. **Bản tải lại có watermark** (021): dùng idum.uz/eduportal.uz làm nguồn publish? → Đề xuất: chỉ để khảo sát; publish phải từ bản gốc sạch.
15. **Bản quyền** (059): loại tệp nào bắt buộc có `rights` trước khi publish, ai xác nhận? → Đề xuất: bản thu nhạc, video ngoài, bản đồ nền, ảnh người còn sống; đầu mối NXB của nhóm xác nhận.
16. **Bản đồ** (045): nền bản đồ của NXB hay bản đồ mở; ranh giới theo chuẩn nào? → Đề xuất: xin NXB; nếu không, bản đồ mở + ghi "không phải bản in"; ranh giới theo bản đồ chính thức của Uzbekistan.
17. **Gia sư môn Sử** (036): được trả lời ngoài nội dung sách (tôn giáo, dân tộc)? → Đề xuất: không; ngoài phạm vi thì chuyển GV.
18. **Tập viết và vẽ** (033, 054): chấm tự động tập viết/dựng hình có vào điểm? Làm bàn vẽ ảo ở v1? → Đề xuất: tự động chỉ phản hồi, điểm do GV; v1 chỉ nộp ảnh bài vẽ giấy.
19. **Tô màu** (032): gộp "tô theo mã" (en) và "tô theo luật" (uz) thành một `ex.color_regions`? → Đề xuất: gộp.
20. **Trắc nghiệm in** (058): giữ dạng tổ hợp "A) 1, 2, 4, 5" như đề thi hay chuyển dạng gốc? → Đề xuất: chuyển dạng gốc, có nút xem "như bản in".
21. **Chuẩn quốc gia** (025): đưa DTS vào tầng 0 thành danh mục dùng chung `tri-thuc/chuan/`? → Đề xuất: có, nhập dần từ SGV.

## Ghi chú phương pháp
- Mỗi dòng CSV có `gop_vao` (số đề xuất hoặc `khong_de_xuat` kèm lý do trong `ghi_chu`). Mỗi file đề xuất liệt kê lại các dòng thô của nó, nên truy được bằng chứng tới cuốn/trang.
- Số đếm renderer lấy bằng cách đếm `exercises[].kind`, `simulations[].kind`, `videos[].scenes[].visual.kind`, `pages[].fields` trên `books/*/book.json` và đối chiếu `registerEx`/`registerSim` trong `dau-doc/components/`. Khớp với `tu-che.md` của từng cuốn.
- Mẫu sóng 0 là trích đoạn (alifbe1 56/88 trang, musiqa5 tr.28–82, onatili3 chỉ tập 1): danh sách đợt 2 có thể còn thiếu.
