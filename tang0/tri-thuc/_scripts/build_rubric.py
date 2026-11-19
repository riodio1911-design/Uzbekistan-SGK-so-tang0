# Dựng rubric-bo-sach.json (trục 2) từ các quan sát trong mã/dữ liệu 7 cuốn.
# Mỗi mục rubric gốc: book, code (khóa khối / tiêu đề in / kind TP), label {uz,vi,ru}, origin, count, where.
# origin: "ban_in" = có trong sách in (tiêu đề in hoặc khối dựng lại từ mục in); "them_khi_so_hoa" = do bản số thêm vào.
import json

def L(uz, vi=None, ru=None):
    d = {'uz': uz}
    if vi: d['vi'] = vi
    if ru: d['ru'] = ru
    return d

def S(book, code, label, origin='ban_in', count=None, where=None, note=None):
    d = {'book': book, 'code': code, 'label': label, 'origin': origin}
    if label is None: d['label_note'] = 'không có tiêu đề in; chỉ là ghim/khối do bản số thêm'
    if count is not None: d['count'] = count
    if where: d['where'] = where
    if note: d['note'] = note
    return d

C = []
def concept(cid, name, desc, position, members, note=None):
    d = {'id': cid, 'name': name, 'description': desc, 'position': position, 'axes': {'2': [cid]},
         'members': members, 'books': sorted({m['book'] for m in members})}
    if note: d['note'] = note
    C.append(d)

TAB = 'window.BOOK blocks[].type + const UI'
BIO = 'window.BOOK blocks[].type + const UI / renderBlock'
ADB = 'DATA.units[].blocks[].t + const UI (rub())'
MAT = 'PG.tr (tiêu đề in) – định nghĩa ở trang 1–2'
MWB = 'WBP.tr (vở bài tập) – định nghĩa ở trang 1–2'
INF = 'PG.tr (tiêu đề in) – định nghĩa ở trang 5'
KIM = 'PG.tr (tiêu đề in, h:1) – ký hiệu ở trang 2'
FIZ = 'PG.tr (tiêu đề in) – ký hiệu ở trang 2 (chỉ có vi/ru)'

concept('objectives', {'uz': 'Maqsadlar', 'vi': 'Mục tiêu', 'ru': 'Цели'},
        'Danh sách điều người học sẽ đạt được trong bài/mô-đun.', 'dau_bai',
        [S('tabiiy5', 'objectives', L('Mavzuni o‘rganish davomida:', 'Trong bài học này, em sẽ:'), count=23, where=TAB),
         S('informatika5', 'Modul maqsadlari / Bu modulda quyidagilarni o‘rganasiz', L('Modul maqsadlari', 'Mục tiêu của mô-đun', 'Цели модуля'), count=16, where=INF, note='cấp mô-đun, không phải cấp bài')])

concept('prior_knowledge', {'uz': 'Eslang', 'vi': 'Ôn lại kiến thức cũ', 'ru': 'Вспомните'},
        'Nhắc lại kiến thức nền đã học trước khi vào chủ đề mới.', 'dau_bai',
        [S('matematika5', 'Eslang', L('Eslang', 'Ôn lại', 'Вспомните'), count=9, where=MAT),
         S('matematika5', 'Eslang (vở)', L('Eslang', 'Ôn lại', 'Вспомните'), count=7, where=MWB),
         S('informatika5', 'Darsni boshlashdan avval', L('Darsni boshlashdan avval', 'Trước khi bắt đầu bài học', 'Перед началом урока'), count=6, where=INF,
           note='không có trong trang giải thích mục ở tr.5, chỉ thấy là tiêu đề in')])

concept('think_prompt', {'uz': 'O‘ylab ko‘ring', 'vi': 'Suy nghĩ', 'ru': 'Подумайте'},
        'Câu hỏi gợi suy nghĩ trước khi học/đọc/làm bài.', 'dau_bai_hoac_truoc_bai_tap',
        [S('tabiiy5', 'think', L('O‘ylab ko‘ring', 'Suy nghĩ'), count=23, where=TAB, note='đầu bài'),
         S('biologiya5', 'think', L('O‘ylab ko‘ring', 'Suy nghĩ'), count=18, where=BIO, note='câu hỏi gợi mở đầu bài'),
         S('adabiyot5', 'think', L('O‘ylab ko‘ring', 'Hãy suy nghĩ', 'Подумайте'), count=8, where=ADB, note='đứng trước pre/văn bản đọc, có ô ghi ý nghĩ'),
         S('matematika5', 'O‘ylab ko‘ring', L('O‘ylab ko‘ring', 'Suy nghĩ', 'Подумайте'), count=7, where=MAT, note='trước khi làm nhiệm vụ/bài tập (định nghĩa tr.1)'),
         S('informatika5', 'Oʻylab koʻring', L('Oʻylab koʻring', 'Hãy suy nghĩ', 'Подумайте'), count=6, where=INF)],
        note='Cùng tên ở 5 cuốn; vị trí hơi khác (đầu bài / trước bài tập) nhưng cùng chức năng nên gộp.')

concept('lesson_question', {'uz': 'Dars savoli', 'vi': 'Câu hỏi của bài', 'ru': 'Вопрос урока'},
        'Một câu hỏi mở đầu bài, câu trả lời nằm trong bài.', 'dau_bai',
        [S('kimyo8', 'Dars savoli', L('Dars savoli', 'Câu hỏi của bài', 'Вопрос урока'), count=16, where=KIM)],
        note='Gần với think_prompt nhưng yêu cầu tìm đáp án trong bài; để riêng để D2 quyết có gộp không.')

concept('discussion', {'uz': 'Muhokama', 'vi': 'Thảo luận', 'ru': 'Обсуждение'},
        'Trò chuyện/thảo luận có câu hỏi định hướng.', 'dau_bai_hoac_sau_doc',
        [S('matematika5', 'Muhokama qiling', L('Muhokama qiling', 'Thảo luận', 'Обсудите'), count=11, where=MAT, note='mở đầu, GV dẫn dắt theo tranh/video'),
         S('adabiyot5', 'talk', L('Keling, suhbatlashamiz', 'Cùng trò chuyện', 'Давайте побеседуем'), count=32, where=ADB, note='sau văn bản đọc, 143 câu, AI nhận xét')])

concept('pre_reading', {'uz': 'Mutolaadan oldin', 'vi': 'Trước khi đọc', 'ru': 'Перед чтением'},
        'Gợi ý chuẩn bị trước khi đọc văn bản.', 'truoc_van_ban',
        [S('adabiyot5', 'pre', L('Mutolaadan oldin…', 'Trước khi đọc', 'Перед чтением'), count=7, where=ADB)])

concept('author_intro', {'uz': 'Tanishing', 'vi': 'Làm quen (tác giả)', 'ru': 'Знакомьтесь'},
        'Tiểu sử/giới thiệu tác giả.', 'dau_don_vi',
        [S('adabiyot5', 'bio', L('Tanishing', 'Làm quen', 'Знакомьтесь'), count=9, where=ADB)])

concept('main_reading', {'uz': 'Zavqli mutolaa', 'vi': 'Giờ đọc thú vị', 'ru': 'Увлекательное чтение'},
        'Văn bản nghệ thuật chính (thơ/văn xuôi) để đọc.', 'than_bai',
        [S('adabiyot5', 'poem|prose (rub read)', L('Zavqli mutolaa', 'Giờ đọc thú vị', 'Увлекательное чтение'), count=39, where=ADB, note='poem 20 + prose 19')])

concept('core_content', {'uz': 'O‘rganamiz', 'vi': 'Nội dung bài học', 'ru': 'Изучаем'},
        'Phần lý thuyết/giảng giải chính của bài.', 'than_bai',
        [S('tabiiy5', 'learn', L('Birgalikda o‘rganamiz!', 'Cùng nhau học!'), count=44, where=TAB),
         S('biologiya5', 'learn', L('Birgalikda o‘rganamiz!', 'Cùng nhau học!'), count=118, where=BIO),
         S('matematika5', 'Qarang va o‘rganing', L('Qarang va o‘rganing', 'Quan sát và học', 'Смотрите и изучайте'), count=41, where=MAT, note='giới thiệu khái niệm qua hình')])

concept('guided_inquiry', {'uz': 'Tadqiq etamiz', 'vi': 'Cùng khám phá', 'ru': 'Исследуем'},
        'Hoạt động khám phá/điều tra theo nhóm, thường kèm hoạt động sort/order.', 'than_bai',
        [S('tabiiy5', 'explore', L('Birgalikda tadqiq etamiz!', 'Cùng nhau khám phá!'), count=25, where=TAB),
         S('biologiya5', 'explore', L('Birgalikda tadqiq etamiz!', 'Cùng nhau khám phá!'), count=18, where=BIO)])

concept('worked_example', {'uz': 'Namunaviy yechim', 'vi': 'Bài mẫu', 'ru': 'Образец решения'},
        'Ví dụ/bài toán có lời giải mẫu từng bước.', 'than_bai',
        [S('matematika5', 'Misol', L('Misol', 'Ví dụ', 'Пример'), count=11, where=MAT),
         S('kimyo8', 'NAMUNAVIY MISOL, MASALA VA MASHQLAR', L('Namunaviy misol, masala va mashqlar', 'Bài mẫu, bài toán và bài tập có lời giải', 'Образцы примеров, задач и упражнений'), count=15, where=KIM),
         S('fizika8', 'Masala yechish namunasi', L('Masala yechish namunasi', 'Bài toán mẫu', 'Образец решения задачи'), count=16, where=FIZ)])

concept('problem_solving_lesson', {'uz': 'Masalalar yechish', 'vi': 'Bài giải bài tập', 'ru': 'Решение задач'},
        'Cả một bài (§) dành cho giải bài tập.', 'ca_bai',
        [S('fizika8', 'N-§. MASALALAR YECHISH', L('Masalalar yechish', 'Giải bài tập', 'Решение задач'), count=12, where=FIZ)])

concept('practice', {'uz': 'Mashqlar', 'vi': 'Luyện tập', 'ru': 'Упражнения'},
        'Bài tập luyện sau phần học.', 'sau_ly_thuyet',
        [S('matematika5', 'Bajaring va o‘rganing', L('Bajaring va o‘rganing', 'Thực hành và học', 'Выполняйте и изучайте'), count=39, where=MAT),
         S('kimyo8', 'MUSTAQIL YECHISH UCHUN MASALA VA MASHQLAR', L('Mustaqil yechish uchun masala va mashqlar', 'Bài toán và bài tập tự giải', 'Задачи и упражнения для самостоятельного решения'), count=15, where=KIM),
         S('fizika8', 'N-mashq', L('N-mashq', 'Bài tập N', 'Упражнение N'), count=35, where=FIZ),
         S('matematika5', 'Topshiriq D1/D2/D3 (vở)', L('Topshiriq (D1 / D2 / D3)', 'Bài tập mức 1 / 2 / 3', 'Задание уровня 1 / 2 / 3'), where=MWB, note='bài tập vở chia 3 mức độ; ~54 tiêu đề D1 đếm được')])

concept('hands_on', {'uz': 'Amaliy mashq', 'vi': 'Thực hành bằng tay / trò chơi', 'ru': 'Практическое упражнение'},
        'Hoạt động dùng đồ dùng trực quan, trò chơi, CNTT.', 'than_bai',
        [S('matematika5', 'Qo‘lda bajariladigan mashq', L('Qo‘lda bajariladigan mashq', 'Bài tập thực hành bằng tay', 'Практическое упражнение'), count=12, where=MAT),
         S('matematika5', 'O‘ynang va o‘rganing', L('O‘ynang va o‘rganing', 'Chơi và học', 'Играйте и изучайте'), count=2, where=MAT),
         S('matematika5', 'AKT mashqi', L('AKT mashqi', 'Bài tập CNTT', 'Задание по ИКТ'), count=3, where=MAT)])

concept('collaboration', {'uz': 'Hamkorlik', 'vi': 'Làm việc cặp/nhóm, chia sẻ', 'ru': 'Работа в паре'},
        'Làm việc theo cặp, chia sẻ điều đã học.', 'than_bai',
        [S('matematika5', 'Juftlikda ishlang', L('Juftlikda ishlang', 'Làm việc theo cặp', 'Работайте в парах'), count=24, where=MAT),
         S('matematika5', 'O‘rganing va bo‘lishing', L('O‘rganing va bo‘lishing', 'Học và chia sẻ', 'Изучайте и делитесь'), count=11, where=MAT)])

concept('practical_task', {'uz': 'Amaliy ko‘nikma / topshiriq', 'vi': 'Kỹ năng/bài thực hành', 'ru': 'Практическое задание'},
        'Hoạt động để thể hiện/thử kiến thức-kỹ năng đã học, có tự đánh giá.', 'cuoi_phan',
        [S('informatika5', 'N-amaliy ko‘nikma', L('Amaliy ko‘nikma', 'Kỹ năng thực hành', 'Практический навык'), count=41, where=INF),
         S('matematika5', 'Amaliy topshiriq (vở)', L('Amaliy topshiriq', 'Bài thực hành', 'Практическое задание'), count=6, where=MWB)])

concept('problem_task', {'uz': 'Muammoli topshiriq', 'vi': 'Nhiệm vụ giải quyết vấn đề', 'ru': 'Проблемное задание'},
        'Nhiệm vụ tình huống/vấn đề, giải theo các bước.', 'cuoi_bai_hoac_chuong',
        [S('tabiiy5', 'problem', L('Muammoli topshiriq', 'Nhiệm vụ giải quyết vấn đề'), count=6, where=TAB),
         S('matematika5', 'Muammoli topshiriq (vở)', L('Muammoli topshiriq', 'Bài toán thử thách', 'Проблемное задание'), count=6, where=MWB, note='quy trình 4 bước: Reja / Yechish / Tekshirish …')])

concept('challenge', {'uz': 'Masala', 'vi': 'Thử thách', 'ru': 'Задача'},
        'Hoạt động khó hơn, ngoài chương trình.', 'tuy_chon',
        [S('informatika5', 'Masala', L('Masala', 'Thử thách', 'Задача'), count=5, where=INF, note='đếm theo dòng tiêu đề riêng'),
         S('fizika8', '* (bài khó)', L('*', 'bài toán tương đối khó', 'задачи повышенной сложности'), where=FIZ, note='ký hiệu dấu * trong ký hiệu quy ước')])

concept('real_life', {'uz': 'Hayotda qo‘llash', 'vi': 'Gắn với đời sống', 'ru': 'Применение в жизни'},
        'Ứng dụng vào đời sống, nghề nghiệp, tình huống thực.', 'cuoi_bai',
        [S('matematika5', 'Turmushda matematika', L('Turmushda matematika', 'Toán học trong đời sống', 'Математика в жизни'), count=4, where=MAT),
         S('tabiiy5', 'career', L('Ilm-fan kundalik hayotda', 'Khoa học trong đời sống'), count=13, where=TAB, note='tiêu đề lấy từ title của khối'),
         S('informatika5', 'Ssenariy', L('Ssenariy', 'Tình huống', 'Сценарий'), count=9, where=INF)])

concept('enrichment', {'uz': 'Bilasizmi?', 'vi': 'Em có biết / mở rộng', 'ru': 'Знаете ли вы?'},
        'Thông tin thú vị, kiến thức mở rộng, không bắt buộc.', 'xen_ke',
        [S('informatika5', 'Bilasizmi?', L('Bilasizmi?', 'Em có biết?', 'Знаете ли вы?'), count=13, where=INF),
         S('matematika5', 'Qiziqarli matematika', L('Qiziqarli matematika', 'Toán học vui', 'Занимательная математика'), count=11, where=MAT),
         S('adabiyot5', 'know', L('Bilib oling', 'Nên biết', 'Это полезно знать'), count=2, where=ADB)])

concept('tip', {'uz': 'Maslahat', 'vi': 'Lời khuyên', 'ru': 'Совет'},
        'Gợi ý để làm nhiệm vụ.', 'xen_ke',
        [S('informatika5', 'Maslahat', L('Maslahat', 'Lời khuyên', 'Совет'), count=39, where=INF)])

concept('attention_note', {'uz': 'Diqqat!', 'vi': 'Chú ý! / Hãy ghi nhớ', 'ru': 'Внимание!'},
        'Thông tin giúp tránh sai sót / điều cần nhớ.', 'xen_ke',
        [S('informatika5', 'Diqqat!', L('Diqqat!', 'Chú ý!', 'Внимание!'), count=7, where=INF),
         S('fizika8', '(dấu chấm than)', L('(!)', 'hãy ghi nhớ', 'запомните'), where=FIZ, note='ký hiệu hình, không có chữ uz trong dữ liệu')])

concept('safety_warning', {'uz': 'Ehtiyot bo‘ling!', 'vi': 'Hãy cẩn thận!', 'ru': 'Будьте осторожны!'},
        'Cảnh báo an toàn.', 'xen_ke',
        [S('informatika5', 'Ehtiyot bo‘ling!', L('Ehtiyot bo‘ling!', 'Hãy cẩn thận!', 'Будьте осторожны!'), count=4, where=INF)])

concept('definition_box', {'uz': 'Ta’rif / formula', 'vi': 'Định nghĩa, định luật, công thức quan trọng', 'ru': 'Определение / формула'},
        'Khung nổi bật định nghĩa đại lượng, định luật, công thức.', 'xen_ke',
        [S('fizika8', '(ô xanh có mũi tên) / (ô vàng)', L('(belgi)', 'định nghĩa đại lượng, định luật cơ bản / công thức quan trọng', 'определения, основные законы / важные формулы'), where=FIZ, note='chỉ là ký hiệu đồ họa; bản số chưa tách thành khối riêng')])

concept('key_terms', {'uz': 'Kalit so‘zlar', 'vi': 'Từ khoá', 'ru': 'Ключевые слова'},
        'Danh sách từ khoá/khái niệm then chốt của bài (có thể kèm định nghĩa).', 'cuoi_bai',
        [S('biologiya5', 'keywords', L('Kalit so‘zlar', 'Từ khoá', 'Ключевые слова'), count=18, where=BIO),
         S('informatika5', 'Kalit so‘zlar.', L('Kalit so‘zlar', 'Từ khóa', 'Ключевые слова'), count=70, where=INF, note='có định nghĩa ngắn kèm từng từ'),
         S('kimyo8', 'Tayanch tushunchalar:', L('Tayanch tushunchalar', 'Khái niệm then chốt', 'Опорные понятия'), count=14, where=KIM, note='tr.4 gọi là «BKM elementlari»')])

concept('glossary', {'uz': 'Lug‘at / Ilmiy atamalar', 'vi': 'Bảng thuật ngữ / sổ từ', 'ru': 'Словарь терминов'},
        'Danh sách thuật ngữ có định nghĩa ở cuối chương/đơn vị/sách.', 'cuoi_chuong_hoac_sach',
        [S('tabiiy5', 'glossary', L('Ilmiy atamalar', 'Thuật ngữ khoa học'), count=85, where=TAB, note='cuối mỗi chương; 84 ghim term'),
         S('biologiya5', 'glossary', L('Ilmiy atamalar', 'Thuật ngữ khoa học'), count=35, where=BIO),
         S('adabiyot5', 'gloss', L('Lug‘at', 'Sổ từ', 'Словарик'), count=56, where=ADB, note='theo đơn vị, tự gạch chân trong văn bản'),
         S('informatika5', 'Glossariy (tr.129–175)', L('Glossariy', 'Bảng thuật ngữ', 'Глоссарий'), count=810, where=INF, note='cuối sách, có nhãn lĩnh vực và tên tiếng Anh')])

concept('end_questions', {'uz': 'Savol va topshiriqlar', 'vi': 'Câu hỏi cuối bài', 'ru': 'Вопросы и задания'},
        'Câu hỏi/bài tập ôn cuối bài.', 'cuoi_bai',
        [S('biologiya5', 'questions', L('Savollar', 'Câu hỏi', 'Вопросы'), count=18, where=BIO, note='98 câu, Robo nhận xét'),
         S('kimyo8', 'SAVOL VA TOPSHIRIQLAR', L('Savol va topshiriqlar', 'Câu hỏi và bài tập', 'Вопросы и задания'), count=44, where=KIM),
         S('fizika8', '(dấu hỏi)', L('(?)', 'hãy trả lời câu hỏi', 'ответьте на вопросы'), where=FIZ, note='ký hiệu hình')])

concept('knowledge_check', {'uz': 'Bilimingizni sinab ko‘ring', 'vi': 'Kiểm tra kiến thức', 'ru': 'Проверьте свои знания'},
        'Trắc nghiệm/tự kiểm tra kiến thức, chấm tự động trong bản số.', 'cuoi_bai',
        [S('tabiiy5', 'quiz', L('Bilimingizni sinab ko‘ring!', 'Kiểm tra kiến thức!'), count=23, where=TAB),
         S('biologiya5', 'quiz', L('Bilimingizni sinab ko‘ring!', 'Kiểm tra kiến thức', 'Проверьте свои знания!'), count=18, where=BIO),
         S('matematika5', 'O‘zingizni tekshiring', L('O‘zingizni tekshiring', 'Tự kiểm tra', 'Проверьте себя'), count=21, where=MAT),
         S('kimyo8', 'TEST SAVOLLARI', L('Test savollari', 'Câu hỏi trắc nghiệm', 'Тестовые вопросы'), count=2, where=KIM),
         S('adabiyot5', 'quiz', L('Tezkor savollar', 'Câu hỏi nhanh', 'Быстрые вопросы'), origin='them_khi_so_hoa', count=29, where=ADB, note='gắn nhãn «không có trong sách»'),
         S('matematika5', 'TP[].quiz', None, origin='them_khi_so_hoa', count=37, where='window.TP'),
         S('informatika5', 'TP[].quiz', None, origin='them_khi_so_hoa', count=28, where='window.TP'),
         S('kimyo8', 'TP[].quiz', None, origin='them_khi_so_hoa', count=44, where='window.TP'),
         S('fizika8', 'TP[].quiz', None, origin='them_khi_so_hoa', count=60, where='window.TP')])

concept('skills_self_assessment', {'uz': 'Ko‘nikmalar', 'vi': 'Tự đánh giá kỹ năng', 'ru': 'Самооценка навыков'},
        'Danh sách «em đã…» để người học tự tick.', 'cuoi_bai',
        [S('tabiiy5', 'skills', L('Quyidagi qaysi ko‘nikmalarni egalladingiz?', 'Em đã đạt được những kỹ năng nào?'), count=23, where=TAB)])

concept('learning_journal', {'uz': 'Kundalik', 'vi': 'Nhật ký học tập', 'ru': 'Дневник'},
        'Ghi suy nghĩ về quá trình học.', 'cuoi_phan',
        [S('matematika5', 'Matematika kundaligi (vở)', L('Matematika kundaligi', 'Nhật ký toán học', 'Математический дневник'), count=7, where=MWB)])

concept('review', {'uz': 'Takrorlash', 'vi': 'Ôn tập', 'ru': 'Повторение'},
        'Ôn tập củng cố cuối phần.', 'cuoi_chuong',
        [S('matematika5', 'Takrorlash (vở) / WBS r1,r2', L('Takrorlash', 'Ôn tập', 'Повторение'), where=MWB, note='2 bộ ôn tập r1, r2 trong WBS'),
         S('kimyo8', 'TP kind=summary', None, origin='them_khi_so_hoa', count=44, where='window.TP', note='video tổng kết mỗi bài'),
         S('fizika8', 'TP kind=summary', None, origin='them_khi_so_hoa', count=60, where='window.TP'),
         S('informatika5', 'TP kind=summary', None, origin='them_khi_so_hoa', count=6, where='window.TP')])

concept('assignment', {'uz': 'Topshiriq', 'vi': 'Bài tập (viết/điền bảng)', 'ru': 'Задание'},
        'Bài tập làm trên lớp: viết, điền bảng.', 'sau_ly_thuyet',
        [S('biologiya5', 'task', L('Topshiriq', 'Bài tập', 'Задание'), count=23, where=BIO, note='input text 9 / table 14'),
         S('adabiyot5', 'task kind=topshiriq', L('Topshiriq', 'Bài tập', 'Задание'), count=18, where=ADB)])

concept('homework', {'uz': 'Uyga vazifa', 'vi': 'Bài về nhà', 'ru': 'Домашнее задание'},
        'Bài tập về nhà.', 'cuoi_bai',
        [S('adabiyot5', 'task kind=uyga', L('Uyga vazifa', 'Bài về nhà', 'Домашнее задание'), count=22, where=ADB),
         S('matematika5', 'Mashq daftari (vở, dùng ở nhà)', L('Mashq daftari', 'Vở bài tập', 'Рабочая тетрадь'), where=MWB, note='lời nói đầu vở: «chủ yếu dành cho việc học ở nhà»')])

concept('creative_task', {'uz': 'Ijodiy ish', 'vi': 'Bài sáng tạo', 'ru': 'Творческая работа'},
        'Bài viết/sáng tạo mở.', 'cuoi_bai',
        [S('adabiyot5', 'task kind=ijodiy', L('Ijodiy ish', 'Sáng tạo', 'Творческая работа'), count=3, where=ADB)])

concept('workbook_link', {'uz': 'Mashq daftariga o‘ting', 'vi': 'Chuyển sang vở bài tập', 'ru': 'Перейдите к рабочей тетради'},
        'Chỉ dẫn chuyển sang vở bài tập tương ứng.', 'cuoi_bai',
        [S('matematika5', 'Mashq daftariga o‘ting / WBS', L('Mashq daftariga o‘ting', 'Chuyển sang vở bài tập', 'Перейдите к рабочей тетради'), count=51, where=MAT, note='52 bộ WBS sinh ghim wb'),
         S('tabiiy5', 'workbook', L('Interaktiv mashq daftari', 'Vở bài tập tương tác'), count=23, where=TAB)])

concept('lab_work', {'uz': 'Laboratoriya ishi', 'vi': 'Bài thí nghiệm', 'ru': 'Лабораторная работа'},
        'Thí nghiệm có dụng cụ và trình tự tiến hành.', 'rieng',
        [S('biologiya5', 'lab kind=lab', L('Laboratoriya mashg‘uloti', 'Bài thực hành thí nghiệm', 'Лабораторная работа'), count=5, where=BIO),
         S('kimyo8', 'N- LABORATORIYA ISHI', L('Laboratoriya ishi', 'Bài thí nghiệm', 'Лабораторная работа'), count=10, where=KIM),
         S('fizika8', 'N-§. Laboratoriya ishi + Ishni bajarish tartibi', L('Laboratoriya ishi', 'Bài thực hành', 'Лабораторная работа'), count=7, where=FIZ)])

concept('practical_work', {'uz': 'Amaliy mashg‘ulot', 'vi': 'Bài thực hành', 'ru': 'Практическое занятие'},
        'Buổi thực hành (không nhất thiết có thí nghiệm).', 'rieng',
        [S('biologiya5', 'lab kind=amaliy', L('Amaliy mashg‘ulot', 'Bài thực hành', 'Практическое занятие'), count=10, where=BIO),
         S('kimyo8', 'N- amaliy ish', L('Amaliy ish', 'Bài thực hành', 'Практическая работа'), count=5, where=KIM),
         S('fizika8', '(mũi tên)', L('(belgi)', 'làm bài tập thực hành và ghi vào vở', 'выполните практические задания'), where=FIZ, note='ký hiệu hình')])

concept('companion_character', {'uz': 'Hamrohlar', 'vi': 'Nhân vật đồng hành', 'ru': 'Спутники'},
        'Nhân vật đi cùng người học, đặt câu hỏi/gợi ý.', 'xen_ke',
        [S('matematika5', 'Hamrohlar', L('Hamrohlar', 'Những người bạn đồng hành', 'Спутники'), where=MAT, note='Madina, Aziza, Akmal, Sardor, Robi'),
         S('tabiiy5', 'robot', L('Robo', 'Robo hỏi'), count=1, where=TAB)])

concept('lesson_video', {'uz': 'Video dars', 'vi': 'Video bài học', 'ru': 'Видеоурок'},
        'Video/hoạt hình bài học do bản số thêm.', 'xen_ke',
        [S('tabiiy5', 'video', L('VIDEO DARS', 'VIDEO BÀI HỌC'), origin='them_khi_so_hoa', count=26, where=TAB),
         S('biologiya5', 'video', L('VIDEO DARS', 'VIDEO BÀI HỌC'), origin='them_khi_so_hoa', count=18, where=BIO),
         S('matematika5', 'TP[].video', None, origin='them_khi_so_hoa', count=38, where='window.TP'),
         S('informatika5', 'TP[].video', None, origin='them_khi_so_hoa', count=41, where='window.TP'),
         S('kimyo8', 'TP[].video (kind null/intro)', None, origin='them_khi_so_hoa', count=133, where='window.TP'),
         S('fizika8', 'TP[].video (kind null/intro)', None, origin='them_khi_so_hoa', count=181, where='window.TP')])

out = {
    'version': '0.9-draft',
    'axis': 2,
    'description': 'Ánh xạ các mục (rubric) của từng bộ sách về khái niệm chung. members[].origin cho biết mục có trong sách in hay do bản số thêm.',
    'concepts': C,
    'not_rubric_blocks': {
        'note': 'Loại khối nội dung (trục 3), không phải mục của bộ sách; không ánh xạ ở đây.',
        'items': [
            {'book': 'tabiiy5', 'codes': ['widget', 'flower']},
            {'book': 'biologiya5', 'codes': ['figure', 'pic', 'table', 'widget']},
            {'book': 'adabiyot5', 'codes': ['p', 'img', 'link']},
            {'book': 'matematika5', 'codes': ['tr', 'ex', 'pin', 'model', 'wbset']},
            {'book': 'informatika5', 'codes': ['tr', 'demo', 'model']},
            {'book': 'kimyo8', 'codes': ['tr', 'fig', 'ex', 'model']},
            {'book': 'fizika8', 'codes': ['tr', 'fig', 'ex', 'model']}]},
    'book_structure': {
        'matematika5': {'levels': ['bob (6 chương)', 'mavzu (38 chủ đề TP)', 'mashq raqami (★ = khởi động)'], 'workbook': '52 bộ WBS'},
        'informatika5': {'levels': ['modul (6) + Glossariy', 'dars/mavzu (TP t*)']},
        'tabiiy5': {'levels': ['bob (10)', 'mavzu (23 bài, no 1.1…)', 'blocks']},
        'biologiya5': {'levels': ['bob (3)', 'mavzu (18 bài)', 'blocks']},
        'adabiyot5': {'levels': ['bo‘lim/unit (10, kind poem|tale|hadis|story|legend|intro)', 'blocks']},
        'kimyo8': {'levels': ['bob (7)', '§ (44)', 'TP i/t/s (mở đầu/bài/tổng kết)']},
        'fizika8': {'levels': ['bob (5 + phụ lục)', '§ (60)', 'TP i/t/s']}},
}
json.dump(out, open('../rubric-bo-sach.json', 'w'), ensure_ascii=False, indent=1)
print(len(C), 'concepts;', sum(len(c['members']) for c in C), 'members')
for c in C: print(f"{c['id']:24s} {len(c['books'])} cuốn: {', '.join(c['books'])}")
