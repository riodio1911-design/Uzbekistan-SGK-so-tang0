# Tầng 0 · Gia sư (bản nháp v0.9)

Thành phần này gom mọi lời nhắc gia sư AI (Robo, Oqilbek) và các vai trò không dùng AI đi kèm (đố nhanh, nhắc việc, đọc to) của 7 cuốn thành **một bộ mẫu có tham số**. Không mẫu nào còn viết cứng môn, lớp, tuổi, tên sách, ngôn ngữ, nước, tên nhân vật hay id bài.

| File | Nội dung |
|---|---|
| `prompts.json` | Tham số, bảng ngôn ngữ, 2 nhân vật, 2 đối tượng (học sinh, giáo viên), luật theo cấp tuổi, luật theo môn, luật lớp "đọc văn", 7 vai trò, 3 tool, giao diện host, chuỗi giao diện đa ngữ |
| `kiem-tra-loi-nhac.py` | Bộ kiểm tra (1) không viết cứng, (2) điền thử 10 hồ sơ, (3) quét HTML như bản cũ và thêm cảnh báo |
| `BAO-CAO.md` | Báo cáo cho D2 |

Quy ước: khóa máy viết tiếng Anh `snake_case`. Lời nhắc viết tiếng Anh như 7 cuốn đang dùng. Chuỗi hiện cho người dùng là object `{uz, ru, vi, kaa?}`. Mục nào chưa cuốn nào có thì gắn `"status": "de_xuat"` và để `sources: []`.

## 1. Nguồn đã trích

Có 14 lời nhắc AI, mỗi cuốn đúng 2 (đếm theo `You are…`, khớp với `ana/kiem_tra_sach.py`). Không cuốn nào có lời nhắc thứ ba hay `role:'system'`.

| Cuốn | Lời nhắc 1 (vai trò) | Lời nhắc 2 (vai trò) | Phần không AI |
|---|---|---|---|
| matematika5 | `rules()` Robo, chat có tool | `openEx` → gợi ý, `modelTier:'quick'` | localQuiz, nhắc việc, speak |
| informatika5 | `rules()` (như trên) | `openEx` gợi ý, quick | như trên |
| kimyo8 | `rules()` | `openEx` gợi ý, quick (*kiểm kê ghi "không chỉ định", nhưng mã có `modelTier:'quick'`*) | như trên |
| fizika8 | `rules()` | `openEx` gợi ý, quick | như trên |
| tabiiy5 | `rules()` | VBT `open` → `sample.json` chấm 0/1/2, quick | như trên |
| biologiya5 | `rules()` | `feedback()` nhận xét câu mở, stream | như trên |
| adabiyot5 | `chat()` Oqilbek, không tool, giữ 6 lượt | `feedback()` nhận xét câu thảo luận/tự luận | không có |

## 2. Vai trò (`roles[]`)

| id | Kiểu (kiểm kê) | AI | Gộp từ |
|---|---|---|---|
| `chat` | tro_chuyen | sample, mặc định, stream, tool tùy chọn | `rules()` của 6 cuốn + `chat()` của adabiyot5 |
| `hint` | goi_y | sample, quick | `openEx` của mat5, inf5, kim8, fiz8 (4 bản giống hệt nhau) |
| `open_feedback` | chấm bài mở, nhận xét chữ | sample, stream | `feedback` của biologiya5 + adabiyot5 |
| `open_grade` | chấm bài mở, có điểm JSON 0/1/2 | sample.json, quick | VBT tabiiy5 |
| `quick_quiz` | đố nhanh | không | `localQuiz/answerQuiz` (6 cuốn) |
| `reminders` | nhắc việc | không | `addTask/checkDue/nextStep` (6 cuốn) |
| `read_aloud` | "cuốn sách biết nói" (đọc to) | không | `speak()` (6 cuốn) |

`open_feedback` và `open_grade` để riêng vì đầu ra khác nhau: một bên là chữ chạy (stream), một bên là JSON có điểm. "Cuốn sách biết nói" vừa là tính cách của nhân vật Oqilbek (`personas`), vừa là chức năng đọc to của Robo. Vì vậy có vai trò `read_aloud`, còn Oqilbek là một nhân vật chứ không phải vai trò.

## 3. Tham số

Danh sách đầy đủ, kèm nguồn của từng tham số, nằm ở `prompts.json → params`. Có ba nhóm:

- **Từ hồ sơ cuốn** (`profile`): `title, subject, subject_id, grade, age, audience, country, lang_base, tutor.persona`. Ba trường tùy chọn là `tutor.subject_scope`, `tutor.software_list`, `tutor.persona_origin`. Thêm `layers` (có `reading` thì bật luật đọc văn).
- **Suy ra:** `grade_band` (0-2 | 3-4 | 5-7 | 8-9 | 10-11); sách giáo viên dùng luật `audience = giao_vien`. Từ đó lấy `style, max_words, hint_sentences, feedback_sentences, grade_feedback_sentences`. Ngoài ra suy ra `base_lang_name, reply_lang, bilingual, persona_name, persona_origin, user_noun, audience_line, safety_rules, subject_rules`.
- **Lúc chạy** (đầu đọc cung cấp): `lang, now, lesson_list, current_chapter, context, lesson_id_example, book_usage_guide, exercise, correct_answer, pupil_answer, question, question_ui, question_kind, good_answer`.

Cú pháp là một phần nhỏ của Mustache: `{{x}}`, `{{#x}}…{{/x}}`, `{{^x}}…{{/x}}`. Giá trị có thể chứa `{{…}}` lồng bên trong; bộ điền thay tối đa 3 vòng.

**Đề nghị agent Schema** thêm vào `profile` các trường `subject_id`, `audience`, `country`, `tutor{persona, subject_scope?, software_list?, persona_origin?, roles?}`. Hiện `window.BOOK_PROFILE` chỉ có `title, subject, grade, age`.

## 4. Nhân vật (`personas`)

| | Robo | Oqilbek |
|---|---|---|
| Là ai | chú robot trong sách, vẽ bằng SVG, có 5 tư thế | "cuốn sách biết nói", nhân vật có thật trong sách (*Men Oqilbek, qo‘lingizdagi kitobman*); ảnh cắt từ trang sách |
| Giọng | ấm áp, khích lệ, ngắn; vi: "mình – em", ru: "ты" | ngắn gọn, tử tế; vi: "bạn", ru: "вы" |
| Cấp đã dùng | 5-7 (lớp 5), 8-9 (lớp 8) | 5-7 (lớp 5) |
| Vai trò | chat (có tool), gợi ý, nhận xét, chấm, đố nhanh, nhắc việc, đọc to | chat (không tool), nhận xét |

Trong lời nhắc, tên nhân vật luôn viết bằng chữ Latin (`persona_name`). Tên theo từng ngôn ngữ (Робо, Окилбек) chỉ dùng trên giao diện (`persona_name_ui`).

## 5. Luật theo cấp tuổi

- **Đã thấy:** 5-7 và 8-9. Hai cấp dùng **cùng một bộ luật**: tối đa khoảng 120 từ, từ đơn giản, có 1 ví dụ đời thường, **in đậm** thuật ngữ, nhiều nhất 1 emoji. Gợi ý dài 2–3 câu, nhận xét 2–4 câu, chấm có điểm tối đa 2 câu. Kimyo 8 và Fizika 8 không viết khác gì cho tuổi 13–14.
- **Đã duyệt ở D2** (`status: duyet_d2`, chưa cuốn nào có, cần thử thật): 0-2 (≤40 từ, không markdown, hợp để đọc to), 3-4 (≤80 từ), 10-11 (≤180 từ, đúng thuật ngữ, không emoji), đối tượng `giao_vien` (≤250 từ, giọng chuyên môn, **được** đưa đáp án và lời giải mẫu).

## 6. Cách gắn vào đầu đọc

1. Đầu đọc đọc `profile` của cuốn và nạp `prompts.json`.
2. Host cung cấp `TUTOR_HOST`, thay cho `window.ROBO_HOST`, gồm `context()`, `open(id)`, `onRoute(cb)` và hàm mới `usageGuide()`. `usageGuide()` sinh câu "How to use the book" từ **chú giải ghim thật** của cuốn, thay cho đoạn viết tay.
3. Mỗi lần gọi AI: `params = profile + suy ra + runtime`, rồi `text = render(role.template, params)`, rồi gọi `claude.use('sample')`. Trong lệnh gọi, `model_tier`, `cache`, `stream`, `tools` lấy từ `role.call`. Với `chat`, lời nhắc được gửi như tin nhắn `user` đầu tiên, tiếp theo là `assistant_ack`, rồi tới các lượt hội thoại, giống 7 cuốn đang làm.
4. Lỗi `not_granted / rate_limited / queue_overflow` được đổi thành chuỗi trong `ui_strings` theo `error_codes`.
5. Trước khi xuất bản: chạy `python3 -I kiem-tra-loi-nhac.py --html <file>`.

`kiem-tra-loi-nhac.py` có sẵn hàm tham chiếu `render()` và `build_params()`, đầu đọc JS chỉ cần chép lại đúng logic này.

## 7. Khác biệt giữa 7 cuốn đã gộp thế nào

| Khác biệt trong mã gốc | Cách xử lý trong tầng 0 |
|---|---|
| Dòng `Scope:` viết cứng: maths / ICT and computer / science / chemistry / physics | `{{subject_scope}}`, mặc định là `{{subject}} questions`; hồ sơ có thể ghi đè |
| "How to use the book" viết tay, có 4 bản khác nhau. Bản của biologiya5 đã lỗi thời (sai màu ghim, thiếu RU) | `{{book_usage_guide}}` do `usageGuide()` sinh từ dữ liệu ghim |
| Luật riêng theo môn nằm lẫn trong đoạn hướng dẫn (phân số; bước bấm menu; công thức + đơn vị + an toàn) | Tách thành `subject_rules[]`, chọn theo `applies_to` ⊇ `subject_id` |
| Danh sách phần mềm của sách Tin viết cứng | `{{software_list}}` trong hồ sơ |
| "Uzbek Grade N", "(Uzbekistan textbook" | `{{country}}` |
| "Exercise (Uzbek)", "Lesson text (Uzbek)", "first in Uzbek (Latin script)", "Question (uz)" | `{{base_lang_name}}`. Sách gốc tiếng Nga sẽ tự ra "(Russian)". Gợi ý chỉ viết hai thứ tiếng khi `lang ≠ lang_base` |
| Gợi ý: ngôn ngữ thứ hai chỉ chọn được vi/ru; informatika5 và matematika5 không chọn được uz | `{{reply_lang}}` lấy từ ngôn ngữ giao diện, có đủ uz/ru/vi/kaa |
| "scientific" trong lời nhắc chấm VBT và nhận xét của Sinh | Bỏ. `good_answer` mặc định là "a correct, relevant answer based on the textbook"; câu sửa lỗi đổi thành "correct any factual mistake gently" |
| Nhận xét bio ("correct … mistake") và Oqilbek ("hint to deepen") khác nhau | Gộp: "say what is right, correct any factual mistake gently, give one hint to improve or deepen" |
| Lời nhắc chat của Oqilbek ngắn và không có tool | Dùng chung mẫu `chat`. Tool bật hay tắt theo `tools`. Câu "Explain words, plots, poems…" thành `layer_rules.reading`, chỉ bật khi cuốn có lớp đọc văn (đúng quyết định D1) |
| Ví dụ id trong mô tả tool `open_lesson`: `t50` / `l21` | `{{lesson_id_example}}` |
| Chữ giới thiệu Robo ghi "trả lời câu hỏi **khoa học**" ở cả sách Toán và Tin | `ui_strings.abilities` bỏ chữ "khoa học / ilmiy / научные" |
| Giữ 10 lượt (Robo) hoặc 6 lượt (Oqilbek); ngữ cảnh 9000 / 7000 / 6000 ký tự | `call.turns_kept`, `context.max_chars` ghi trong từng vai trò |

## 8. Lỗi thấy khi trích (chuyển cho bước ④, không mang theo)

- `onRoute()` tìm khối `think` và `workbook`, nhưng 4 cuốn kiểu ghim không có hai khối này, nên bong bóng "O‘ylab ko‘ring" và nút "+ Nhắc bài tập" không bao giờ hiện.
- `#mini` (thanh phát nhạc) không tồn tại ở matematika5 và kimyo8.
- `nextStep()` đọc `gul:done`. `lang()` của tabiiy5 và biologiya5 đọc `gul:text`. Tầng 0 nên lấy tiền tố localStorage từ `profile.id`.
- Từ điển `RRU` của Robo chứa chuỗi của cuốn khác. Tầng 0 viết `ru` thẳng vào từng chuỗi, không tra theo chuỗi uz nữa.
- Kết quả chấm và nhận xét của AI chỉ hiện tại chỗ hoặc lưu localStorage, giáo viên không xem được.

## 9. Đề xuất bổ sung (chưa cuốn nào có, không đưa vào danh mục chính)

1. Luật cấp tuổi 0-2, 3-4, 10-11 và đối tượng `giao_vien` – **đã duyệt ở D2** (`status: duyet_d2`).
2. Tên ngôn ngữ `kaa` (Karakalpak) trong bảng `languages`.
3. `TUTOR_HOST.usageGuide()` và `profile.tutor.roles` (cuốn chọn bật vai trò nào, ví dụ adabiyot5 chỉ bật `chat` + `open_feedback`).
4. Lưu kết quả `open_grade` / `open_feedback` lên `db` để giáo viên xem (hiện chỉ matematika5 lưu kết quả lên db, và chỉ với bài chấm tự động).
5. Vai trò dành cho giáo viên: soạn câu hỏi, gợi ý cách chấm. Trong 7 cuốn chưa có lời nhắc nào cho vai trò này.

## 10. Chạy kiểm tra

```
python3 -I kiem-tra-loi-nhac.py --html <7 file index.html>
```
Kết quả lần chạy này được dán ở `BAO-CAO.md`. Dùng `--show chat:kimyo8:ru` để in một lời nhắc đã điền và đọc thử.

## Đã chốt ở D2 (18/11/2026)
1. Luật cấp tuổi 0-2, 3-4, 10-11 và đối tượng `giao_vien`: duyệt theo đề xuất (`status: duyet_d2`).
2. Chấp nhận các thay đổi câu chữ khi gộp (bỏ "scientific"/"khoa học", gộp hai lời nhắc nhận xét làm một).
3. `profile` có thêm `subject_id`, `country`, `country_code`, `tutor{persona, persona_origin, subject_scope, software_list}` (book.schema v0.9.0).
4. "How to use the book" sinh từ dữ liệu ghim (`host.usageGuide()`), không viết tay.
5. Kết quả AI chấm/nhận xét (`open_grade`, `open_feedback`) lưu lên db cùng bài làm `res/<bộ>_<uid>.answers[…].ai`; điểm GV (`grade/`) là điểm cuối (trục 5 `giao_vien` bật ở v1).
