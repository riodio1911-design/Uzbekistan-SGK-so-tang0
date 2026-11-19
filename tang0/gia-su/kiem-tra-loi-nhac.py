#!/usr/bin/env python3
"""Kiểm tra lời nhắc gia sư (tầng 0, bản nháp v0.9).

Mở rộng từ ana/kiem_tra_sach.py:
  (1) prompts.json không chứa giá trị viết cứng (môn, lớp, tuổi, tên sách, ngôn ngữ, tên nhân vật, id bài);
  (2) điền thử mọi vai trò cho 7 hồ sơ cuốn thật + 3 hồ sơ giả định (lớp 1 tiếng Nga, lớp 11, sách giáo viên)
      rồi kiểm tra lớp / tuổi / môn / ngôn ngữ / nhân vật khớp hồ sơ, không còn {{...}};
  (3) vẫn quét file HTML như bản cũ (BOOK_PROFILE, "Grade N", "N-year-old", môn lạ), thêm cảnh báo viết cứng.

Cách chạy:
  python3 -I kiem-tra-loi-nhac.py                       # (1)+(2) với prompts.json cạnh file này
  python3 -I kiem-tra-loi-nhac.py --html a.html b.html  # thêm (3)
  python3 -I kiem-tra-loi-nhac.py --prompts khac.json --show chat:kimyo8:vi   # in một lời nhắc đã điền
Mã thoát 0 = đạt; 1 = có lỗi ở (1), (2) hoặc lỗi kiểu cũ ở (3). Cảnh báo (⚠) không làm trượt.
"""
import re, sys, json, os, argparse

HERE = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------- từ khóa môn (mở rộng từ bản cũ)
SUBJ = {'matematika': 'mathematics', 'fizika': 'physics', 'kimyo': 'chemistry', 'informatika': 'informatics',
        'biologiya': 'biology', 'tabiiy': 'natural_science', 'adabiyot': 'literature'}
KW = {'mathematics': r'\bmaths?\b|mathematics', 'physics': r'\bphysics\b', 'chemistry': r'\bchemistry\b',
      'informatics': r'\bICT\b|informatics', 'biology': r'\bbiology\b', 'natural_science': r'natural science',
      'literature': r'\bliterature\b', 'history': r'\bhistory\b', 'geography': r'\bgeography\b'}
SCIENCE_PARTS = ('physics', 'chemistry', 'biology')

# Mẫu "viết cứng" cấm trong phần mẫu của prompts.json
HARD = [
    ('lớp viết cứng', r'\b[Gg]rade\s+\d|\d{1,2}-sinf|\blớp\s*\d|\d+\s*класс'),
    ('tuổi viết cứng', r'\d{1,2}\s*(?:[–-]\s*\d{1,2})?[- ]years?[- ]old|\b(?:about|aged)\s+\d|\b\d{1,2}\s*[–-]\s*\d{1,2}\s*(?:tuổi|yosh|лет)'),
    ('khoảng số viết cứng', r'(?<![\d/|])\b\d{1,2}\s*[–-]\s*\d{1,2}\b(?![/\d])'),
    ('môn viết cứng', r'\bmaths?\b|mathematics|\bphysics\b|\bchemistry\b|\bbiology\b|\bliterature\b|\bICT\b|informatics|\bscien(?:ce|tific)\b|\bhistory\b|\bgeography\b'
                      r'|matematika|fizika|kimyo|biologiya|adabiyot|informatika|tabiiy|ilmiy'
                      r'|математик|физик|хими|биолог|литератур|информатик|научн'
                      r'|\btoán\b|vật lý|hóa học|sinh học|văn học|tin học|khoa học'),
    ('tên sách viết cứng', r'Encarta|\bAHA\b|Matematika|Informatika|Tabiiy|Biologiya|Adabiyot|Kimyo|Fizika'),
    ('ngôn ngữ viết cứng', r'\bUzbek(?:istan)?\b|\bVietnamese\b|\bRussian\b|\bKarakalpak\b|Latin script'),
    ('tên nhân vật viết cứng', r'\bRobo\b|\bOqilbek\b|Робо|Окилбек'),
    ('id bài viết cứng', r'\b[tl]\d{1,3}\b'),
]


def walk_template_strings(P):
    """Sinh (đường_dẫn, chuỗi, miễn_trừ) cho mọi chuỗi là MẪU (không phải bảng giá trị)."""
    for r in P.get('roles', []):
        if r.get('template'):
            yield f"roles[{r['id']}].template", r['template'], set()
        if r.get('behavior'):
            yield f"roles[{r['id']}].behavior", r['behavior'], set()
        for k, v in (r.get('ui') or {}).items():
            for lg, t in v.items():
                yield f"roles[{r['id']}].ui.{k}.{lg}", t, set()
    for t in P.get('tools', []):
        yield f"tools[{t['name']}].description", t['description'], set()
    for a, v in P.get('audiences', {}).items():
        for k in ('audience_line', 'safety_rules', 'assistant_kind', 'user_noun'):
            if k in v:
                yield f"audiences.{a}.{k}", v[k], set()
    for ar in P.get('age_rules', []):
        yield f"age_rules[{ar['grade_band'] or ar.get('audience')}].style", ar['style'], set()
    for sr in P.get('subject_rules', []):
        # luật theo môn được phép nhắc tên môn của chính nó (được chọn theo applies_to)
        yield f"subject_rules[{sr['id']}].text", sr['text'], {'môn viết cứng'}
    for lid, lr in P.get('layer_rules', {}).items():
        yield f"layer_rules.{lid}.text", lr['text'], set()
    ui = P.get('ui_strings', {})
    for k, v in ui.items():
        if k in ('sources', 'error_codes'):
            continue
        items = v if isinstance(v, list) else [v]
        for i, o in enumerate(items):
            for lg, t in o.items():
                if lg in ('uz', 'ru', 'vi', 'kaa'):
                    yield f"ui_strings.{k}[{i}].{lg}", t, set()


PH = re.compile(r'\{\{\s*([#^/]?)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}')


def check_hardcoded(P):
    errs = []
    known = set(P.get('params', {}).keys())
    n = 0
    for path, s, exempt in walk_template_strings(P):
        n += 1
        for name, rx in HARD:
            if name in exempt:
                continue
            for m in re.finditer(rx, s, flags=0 if name in ('id bài viết cứng',) else re.I if name == 'môn viết cứng' else 0):
                errs.append(f"{path}: {name} «{m.group(0)}»")
        for m in PH.finditer(s):
            if m.group(2) not in known:
                errs.append(f"{path}: tham số chưa khai báo trong params «{{{{{m.group(1)}{m.group(2)}}}}}»")
        # cân bằng section
        stack = []
        for m in PH.finditer(s):
            op, nm = m.group(1), m.group(2)
            if op in '#^' and op:
                stack.append(nm)
            elif op == '/':
                if not stack or stack.pop() != nm:
                    errs.append(f"{path}: section lệch ở «{nm}»")
        if stack:
            errs.append(f"{path}: section chưa đóng {stack}")
    # vai trò AI phải có template + sources; mọi thành phần có sources
    for r in P.get('roles', []):
        if r.get('ai') and not r.get('template'):
            errs.append(f"roles[{r['id']}]: vai trò AI thiếu template")
        if not r.get('sources'):
            errs.append(f"roles[{r['id']}]: thiếu sources")
    for pz in P.get('personas', []):
        if 'uz' not in pz.get('name', {}):
            errs.append(f"personas[{pz['id']}]: name thiếu 'uz'")
    return n, errs


# ---------------------------------------------------------------- điền mẫu
def render(tpl, params, depth=0):
    def sec(m):
        op, nm, body = m.group(1), m.group(2), m.group(3)
        val = params.get(nm)
        truthy = bool(val) and val not in ('0', 'false')
        return body if (truthy if op == '#' else not truthy) else ''
    prev = None
    s = tpl
    while prev != s:  # section lồng nhau đơn giản: lặp tới khi ổn định
        prev = s
        s = re.sub(r'\{\{\s*([#^])\s*(\w+)\s*\}\}(.*?)\{\{\s*/\s*\2\s*\}\}', sec, s, flags=re.S)
    s = re.sub(r'\{\{\s*(\w+)\s*\}\}', lambda m: str(params.get(m.group(1), '')) if params.get(m.group(1)) is not None else m.group(0), s)
    if '{{' in s and depth < 3:
        return render(s, params, depth + 1)
    s = re.sub(r'\n{3,}', '\n\n', s)
    s = re.sub(r'\n\s*\n(?=Lessons in the book)', '\n', s)
    return s.strip()


def grade_band(grade, audience=None):
    # Cap LOP (grade band, khong phai tuoi) - tang0/tu-dien-truc.json truc 7
    g = int(grade)
    return '0-2' if g <= 2 else '3-4' if g <= 4 else '5-7' if g <= 7 else '8-9' if g <= 9 else '10-11'


def age_rule(P, band, audience):
    # Sach giao vien dung luat audience=giao_vien; con lai chon theo cap lop
    if audience == 'giao_vien':
        r = next((a for a in P['age_rules'] if a.get('audience') == 'giao_vien'), None)
        if r: return r
    return next(a for a in P['age_rules'] if a.get('grade_band') == band)


def build_params(P, prof, lang, runtime=None):
    langs = P['languages']
    persona = next(p for p in P['personas'] if p['id'] == prof['tutor']['persona'])
    aud = P['audiences'][prof['audience']]
    band = grade_band(prof['grade'], prof['audience'])
    ar = age_rule(P, band, prof['audience'])
    sid = prof['subject_id']
    srules = '\n'.join(r['text'] for r in P.get('subject_rules', []) if sid in r['applies_to'])
    p = {
        'title': prof['title'], 'subject': prof['subject'], 'subject_id': sid,
        'subject_scope': prof['tutor'].get('subject_scope') or P['params']['subject_scope']['default'],
        'grade': str(prof['grade']), 'age': prof['age'], 'grade_band': band, 'audience': prof['audience'],
        'country': prof['country'], 'lang_base': prof['lang_base'], 'lang': lang,
        'base_lang_name': langs[prof['lang_base']]['name'],
        'reply_lang': langs[lang]['prompt_name'], 'ui_lang_name': langs[lang]['name'],
        'bilingual': 'yes' if lang != prof['lang_base'] else '',
        'persona': persona['id'],
        'persona_name': persona['name']['uz'],
        'persona_name_ui': persona['name'].get(lang) or persona['name']['uz'],
        'persona_origin': prof['tutor'].get('persona_origin') or persona['origin'],
        'user_noun': aud['user_noun'], 'audience_line': aud['audience_line'],
        'assistant_kind': aud['assistant_kind'], 'safety_rules': aud['safety_rules'],
        'style': ar['style'], 'max_words': ar['max_words'], 'hint_sentences': ar['hint_sentences'],
        'feedback_sentences': ar['feedback_sentences'], 'grade_feedback_sentences': ar['grade_feedback_sentences'],
        'subject_rules': srules,
        'reading_layer': 'yes' if 'reading' in prof.get('layers', []) else '',
        'reading_rules': P['layer_rules']['reading']['text'],
        'software_list': prof['tutor'].get('software_list', ''),
        'tools': 'yes' if prof['tutor'].get('tools', True) else '',
        'now': 'Wed Nov 18 2026 09:00:00 GMT+0500',
        'lesson_id_example': prof.get('first_lesson_id', 'l1'),
        'book_usage_guide': usage_guide(prof),
        'lesson_list': f"{prof.get('first_lesson_id', 'l1')}: 1 <title {prof['lang_base']}> / <title {lang}>",
        'current_chapter': 'Current chapter: 1. <chapter>',
        'context': 'Current page content:\n<page text>',
        'exercise': '<exercise text>', 'correct_answer': '<answer>', 'pupil_answer': '(nothing yet)',
        'question': '<question>', 'question_ui': '<question ui>' if lang != prof['lang_base'] else '',
        'question_kind': P['params']['question_kind']['default'],
        'good_answer': P['params']['good_answer']['default'],
    }
    p.update(runtime or {})
    return p, ar


def usage_guide(prof):
    pins = prof.get('pins') or []
    if not pins:
        return ''
    parts = [f"{c} = {l}" if c else l for c, l in pins]
    return 'the original pages are shown; tapping a text shows its translation; pins on pages: ' + ', '.join(parts) + '.'


# ---------------------------------------------------------------- hồ sơ thử (fixture)
# 7 cuốn: giá trị lấy từ window.BOOK_PROFILE trong mã + kiểm kê (persona, layers, ghim).
PROFILES = [
    dict(id='matematika5', title='Matematika', subject='mathematics', subject_id='mathematics', grade=5, age='10–11',
         lang_base='uz', ui_langs=['uz', 'vi', 'ru'], audience='hoc_sinh', country='Uzbekistan', first_lesson_id='t1',
         tutor=dict(persona='robo', subject_scope='maths questions'), layers=[], html='fix/matematika5/index.html',
         pins=[('blue', 'explainer video'), ('green', 'exercise with automatic checking'), ('red', 'interactive model'), ('purple', 'quiz')]),
    dict(id='informatika5', title='Informatika va axborot texnologiyalari', subject='informatics and ICT', subject_id='informatics', grade=5, age='10–11',
         lang_base='uz', ui_langs=['uz', 'vi', 'ru'], audience='hoc_sinh', country='Uzbekistan', first_lesson_id='t1',
         tutor=dict(persona='robo', subject_scope='ICT and computer questions', software_list='Microsoft Word, Paint, Excel, Scratch, web browsers and e-mail'),
         layers=[], html='fix/informatika5/index.html',
         pins=[('blue', 'explainer video'), ('green', 'task'), ('red', 'interactive activity'), ('purple', 'quiz')]),
    dict(id='tabiiy5', title='Tabiiy fanlar', subject='natural science', subject_id='natural_science', grade=5, age='10–11',
         lang_base='uz', ui_langs=['uz', 'vi', 'ru'], audience='hoc_sinh', country='Uzbekistan', first_lesson_id='l1',
         tutor=dict(persona='robo', subject_scope='science questions'), layers=['lesson'], html='fix2/tabiiy5/index.html',
         pins=[('orange', 'audio'), ('blue', 'video'), ('green', 'activity'), ('red', 'model'), ('purple', 'quiz')]),
    dict(id='biologiya5', title='Biologiya', subject='biology', subject_id='biology', grade=5, age='10–11',
         lang_base='uz', ui_langs=['uz', 'vi', 'ru'], audience='hoc_sinh', country='Uzbekistan', first_lesson_id='l1',
         tutor=dict(persona='robo'), layers=['lesson'], html='fix/biologiya5/index.html',
         pins=[('', 'figure'), ('', 'video'), ('', 'thinking task'), ('', 'test'), ('', 'question')]),
    dict(id='adabiyot5', title='Adabiyot', subject='literature', subject_id='literature', grade=5, age='10–11',
         lang_base='uz', ui_langs=['uz', 'vi', 'ru'], audience='hoc_sinh', country='Uzbekistan', first_lesson_id='u1',
         tutor=dict(persona='oqilbek', tools=False), layers=['lesson', 'reading'], html='fix2/adabiyot5/index.html',
         pins=[('', 'quiz'), ('', 'picture film'), ('', 'writing lines')]),
    dict(id='kimyo8', title='Kimyo', subject='chemistry', subject_id='chemistry', grade=8, age='13–14',
         lang_base='uz', ui_langs=['uz', 'vi', 'ru'], audience='hoc_sinh', country='Uzbekistan', first_lesson_id='t1',
         tutor=dict(persona='robo'), layers=[], html='fix/kimyo8/index.html',
         pins=[('blue', 'videos'), ('teal magnifier', 'figure explorer with numbered parts'), ('green', 'exercise'), ('red', 'activity (order / sort)'), ('purple', 'quiz')]),
    dict(id='fizika8', title='Fizika', subject='physics', subject_id='physics', grade=8, age='13–14',
         lang_base='uz', ui_langs=['uz', 'vi', 'ru'], audience='hoc_sinh', country='Uzbekistan', first_lesson_id='t1',
         tutor=dict(persona='robo'), layers=[], html='fix/fizika8/index.html',
         pins=[('blue', 'videos'), ('teal magnifier', 'figure explorer with numbered parts'), ('green', 'exercise'), ('red', 'activity (order / sort)'), ('purple', 'quiz')]),
    # 3 hồ sơ giả định
    dict(id='gia_dinh_lop1_ru', title='Математика 1', subject='mathematics', subject_id='mathematics', grade=1, age='6–7',
         lang_base='ru', ui_langs=['ru', 'uz'], audience='hoc_sinh', country='Uzbekistan', first_lesson_id='l1',
         tutor=dict(persona='robo'), layers=['lesson'], pins=[('', 'listen'), ('', 'exercise')]),
    dict(id='gia_dinh_lop11', title='Tarix 11', subject='history', subject_id='history', grade=11, age='16–17',
         lang_base='uz', ui_langs=['uz', 'ru', 'vi'], audience='hoc_sinh', country='Uzbekistan', first_lesson_id='l1',
         tutor=dict(persona='robo'), layers=['lesson'], pins=[]),
    dict(id='gia_dinh_giao_vien', title='Biologiya 5 – O‘qituvchi kitobi', subject='biology', subject_id='biology', grade=5, age='10–11',
         lang_base='uz', ui_langs=['uz', 'ru'], audience='giao_vien', country='Uzbekistan', first_lesson_id='l1',
         tutor=dict(persona='robo'), layers=['lesson'], pins=[('', 'lesson plan'), ('', 'answer key')]),
]

AGE_ROLES = ('chat', 'hint', 'open_feedback', 'open_grade')


def verify_render(text, prof, role, lang, P, params):
    errs = []
    if '{{' in text or '}}' in text:
        errs.append('còn {{...}} chưa điền')
    g = prof['grade']
    if f'Grade {g}' not in text:
        errs.append(f'thiếu "Grade {g}"')
    for m in re.finditer(r'[Gg]rade (\d{1,2})\b', text):
        if int(m.group(1)) != g:
            errs.append(f'ghi "Grade {m.group(1)}" nhưng hồ sơ là lớp {g}')
    if role in AGE_ROLES and prof['age'] not in text:
        errs.append(f'thiếu tuổi "{prof["age"]}"')
    ok_ages = {g + 5, g + 6}
    for m in re.finditer(r'(\d{1,2})(?:\s*[–-]\s*(\d{1,2}))?[- ]year[- ]old', text):
        ages = {int(x) for x in m.groups() if x}
        if not ages & ok_ages:
            errs.append(f'tuổi {m.group(0)} lệch lớp {g}')
    for m in re.finditer(r'about (\d{1,2})\s*[–-]\s*(\d{1,2}) years', text):
        if {int(m.group(1)), int(m.group(2))} != ok_ages:
            errs.append(f'tuổi {m.group(0)} lệch lớp {g} (kỳ vọng {min(ok_ages)}–{max(ok_ages)})')
    if prof['subject'] not in text:
        errs.append(f'thiếu môn "{prof["subject"]}"')
    sid = prof['subject_id']
    for k, rx in KW.items():
        if k == sid or (sid == 'natural_science' and k in SCIENCE_PARTS):
            continue
        if re.search(rx, text, re.I):
            errs.append(f'nhắc môn "{k}" nhưng hồ sơ là "{sid}"')
    if role == 'chat' and prof['title'] not in text:
        errs.append('thiếu tên sách')
    if params['reply_lang'] not in text:
        errs.append(f'thiếu ngôn ngữ trả lời "{params["reply_lang"]}"')
    if role == 'hint' and params['bilingual'] and params['base_lang_name'] not in text:
        errs.append('gợi ý hai thứ tiếng nhưng thiếu ngôn ngữ gốc')
    if params['persona_name'] not in text:
        errs.append(f'thiếu tên nhân vật "{params["persona_name"]}"')
    other = [n for pz in P['personas'] for n in pz['name'].values() if pz['id'] != params['persona']]
    for n in other:
        if re.search(r'\b' + re.escape(n) + r'\b', text):
            errs.append(f'lẫn tên nhân vật khác "{n}"')
    if prof['audience'] == 'giao_vien':
        if 'pupils, about' in text:
            errs.append('sách giáo viên nhưng lời nhắc nói với học sinh')
        if 'teacher' not in text:
            errs.append('sách giáo viên nhưng không nhắc "teacher"')
    if prof['audience'] == 'hoc_sinh' and role == 'chat' and 'pupils' not in text:
        errs.append('sách học sinh nhưng thiếu đối tượng "pupils"')
    if role == 'chat' and 'reading' in prof.get('layers', []) and 'poems' not in text:
        errs.append('bật lớp đọc văn nhưng thiếu luật đọc văn')
    if role == 'chat' and 'reading' not in prof.get('layers', []) and 'poems' in text:
        errs.append('không bật lớp đọc văn nhưng có luật đọc văn')
    return errs


def check_fill(P, verbose=False):
    rows, total_err, n = [], 0, 0
    for prof in PROFILES:
        roles = [r for r in P['roles'] if r.get('ai') and prof['audience'] in r.get('audiences', [])]
        perr = []
        for r in roles:
            for lang in prof['ui_langs']:
                params, ar = build_params(P, prof, lang)
                text = render(r['template'], params)
                n += 1
                for e in verify_render(text, prof, r['id'], lang, P, params):
                    perr.append(f"{r['id']}/{lang}: {e}")
        # mô tả tool cũng phải điền hết
        for t in P.get('tools', []):
            params, _ = build_params(P, prof, prof['ui_langs'][0])
            d = render(t['description'], params)
            if '{{' in d or re.search(r'\b[tl]50\b|\bl21\b', d):
                perr.append(f"tool {t['name']}: mô tả chưa điền hết «{d}»")
        band = grade_band(prof['grade'], prof['audience'])
        st = age_rule(P, band, prof['audience'])['status']
        rows.append((prof, roles, band, st, perr))
        total_err += len(perr)
    return n, rows, total_err


# ---------------------------------------------------------------- (3) quét HTML như bản cũ (+ cảnh báo)
def check_html(path):
    s = open(path, encoding='utf8').read()
    title = (re.search(r'<title>(.*?)</title>', s) or [None, ''])[1]
    low = title.lower()
    subj = next((v for k, v in SUBJ.items() if k in low), None)
    g = re.search(r'(\d{1,2})-sinf', s) or re.search(r'\b(\d{1,2})\b', title)
    grade = int(g.group(1)) if g else None
    prof = re.search(r'window\.BOOK_PROFILE\s*=\s*(\{.*?\});', s)
    issues, warns = [], []
    if prof:
        p = prof.group(1)
        pg = re.search(r'grade:\s*(\d+)', p)
        grade = int(pg.group(1)) if pg else grade
    else:
        issues.append('THIẾU hồ sơ BOOK_PROFILE (môn/lớp/tuổi đang viết cứng trong lời nhắc)')
    prompts = [m.group() for m in re.finditer(r'You are[^`]{0,4000}', s)]
    if not prompts:
        issues.append('không tìm thấy lời nhắc gia sư')
    ok_ages = {grade + 5, grade + 6} if grade else set()
    for t in prompts:
        head = t[:80].replace('\n', ' ')
        for m in re.finditer(r'[Gg]rade (\d{1,2})\b', t):
            if grade and int(m.group(1)) != grade:
                issues.append(f'lời nhắc ghi "Grade {m.group(1)}" nhưng sách là lớp {grade}: «{head}…»')
        for m in re.finditer(r'(\d{1,2})(?:\s*[–-]\s*(\d{1,2}))?[- ]year[- ]old', t):
            ages = {int(x) for x in m.groups() if x}
            if ok_ages and not ages & ok_ages:
                issues.append(f'lời nhắc ghi tuổi {m.group(0)} nhưng lớp {grade} khoảng {min(ok_ages)}–{max(ok_ages)} tuổi')
        for k, rx in KW.items():
            if k != subj and re.search(rx, t, re.I) and not (subj == 'natural_science' and k in SCIENCE_PARTS):
                issues.append(f'lời nhắc nhắc tới môn "{k}" nhưng sách là "{subj}": «{head}…»')
        # cảnh báo mới: giá trị viết cứng còn lại trong lời nhắc (không sai môn nhưng chưa tham số hoá)
        for lab, rx in (('môn viết trong Scope', r'Scope: ([^(]{3,40}?) questions'),
                        ('ngôn ngữ gốc viết cứng', r'\((?:Uzbek|Uzbek original)\)|in Uzbek \(Latin script\)|Lesson text \(Uzbek\)|Question \(uz\)'),
                        ('"scientific" viết cứng', r'\bscientific\b'),
                        ('nước viết cứng', r'\bUzbek(?:istan)? Grade|\(Uzbekistan textbook'),
                        ('hướng dẫn dùng sách viết tay', r'How to use the book:')):
            m = re.search(rx, t)
            if m:
                warns.append(f'{lab}: «{m.group(0)[:60]}» trong «{head[:40]}…»')
    if re.search(r'id like [tl]\d+', s):
        warns.append('mô tả tool open_lesson có id ví dụ viết cứng: «' + re.search(r'id like [tl]\d+', s).group(0) + '»')
    if subj not in ('natural_science', 'biology', 'chemistry', 'physics') and ('ilmiy savollarga' in s or 'câu hỏi khoa học' in s):
        warns.append('chữ giới thiệu Robo ghi "câu hỏi khoa học / ilmiy savollarga" trong sách không phải môn khoa học')
    if "localStorage.getItem('gul:" in s:
        warns.append("gia sư đọc khóa localStorage 'gul:' (tên cuốn khác)")
    return {'sach': title, 'mon': subj, 'lop': grade, 'so_loi_nhac': len(prompts),
            'loi': sorted(set(issues)), 'canh_bao': sorted(set(warns))}


# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--prompts', default=os.path.join(HERE, 'prompts.json'))
    ap.add_argument('--html', nargs='*', default=[])
    ap.add_argument('--show', help='role:profile_id:lang — in lời nhắc đã điền')
    a = ap.parse_args()
    P = json.load(open(a.prompts, encoding='utf8'))
    bad = 0

    if a.show:
        rid, pid, lg = a.show.split(':')
        prof = next(p for p in PROFILES if p['id'] == pid)
        r = next(r for r in P['roles'] if r['id'] == rid)
        print(render(r['template'], build_params(P, prof, lg)[0]))
        return 0

    print('== (1) prompts.json không chứa giá trị viết cứng')
    n, errs = check_hardcoded(P)
    print(('✓' if not errs else '✗') + f' đã quét {n} chuỗi mẫu, {len(errs)} lỗi')
    for e in errs:
        print('    -', e)
    bad += bool(errs)

    print('\n== (2) điền thử 7 hồ sơ cuốn + 3 hồ sơ giả định')
    n, rows, terr = check_fill(P)
    for prof, roles, band, st, perr in rows:
        mark = '✓' if not perr else '✗'
        stn = '' if st == 'da_thay' else (' (luật tuổi: duyệt D2)' if st == 'duyet_d2' else ' (luật tuổi: ĐỀ XUẤT)')
        print(f"{mark} {prof['id']:<20} lớp={prof['grade']:<2} tuổi={prof['age']:<6} môn={prof['subject_id']:<15} gốc={prof['lang_base']} "
              f"đối tượng={prof['audience']:<7} nhân vật={prof['tutor']['persona']:<7} cấp={band}{stn} | vai trò: {','.join(r['id'] for r in roles)}")
        for e in perr:
            print('    -', e)
    print(f'   tổng {n} lời nhắc đã điền, {terr} lỗi')
    bad += bool(terr)

    if a.html:
        print('\n== (3) quét file HTML (kiểu cũ + cảnh báo viết cứng)')
        for p in a.html:
            r = check_html(p)
            hard = [i for i in r['loi'] if not i.startswith('THIẾU')]
            bad += bool(hard)
            print(('✗ ' if hard else '✓ ') + f"{r['sach']} | môn={r['mon']} lớp={r['lop']} | {r['so_loi_nhac']} lời nhắc | {len(r['canh_bao'])} cảnh báo")
            for i in r['loi']:
                print('    -', i)
            for w in r['canh_bao']:
                print('    ⚠', w)
    print('\nKẾT QUẢ:', 'ĐẠT' if not bad else 'CHƯA ĐẠT')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
