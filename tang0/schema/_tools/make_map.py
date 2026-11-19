"""Sinh bang-anh-xa.csv: moi loai_khoi va cau_truc_du_lieu cua 7 ban kiem ke -> schema_path.
Dang schema_path: 'book:/pages/*/tr' (duong dan trong ban ghi book.schema.json, * = phan tu mang / khoa bat ky),
'features:/axes/6' (features.schema.json), 'book:$defs/learner_state' (dinh nghia dung chung).
Chay: python3 -I make_map.py <R> <schema_dir>"""
import csv, json, os, sys

R, SD = sys.argv[1], sys.argv[2]
BOOKS = ["matematika5", "informatika5", "tabiiy5", "biologiya5", "adabiyot5", "kimyo8", "fizika8"]

# ---- cau truc du lieu (ten goc) -> [(schema_path, ghi_chu)]
DS = {
 "window.BOOK_PROFILE": [("book:/profile", "title/subject/grade/age -> profile; them grade_band, audience, lang_base, langs, edition, volumes")],
 "window.PG@A": [("book:/pages", "khoa so trang -> pages[].n"), ("book:/pages/*/tr", "tr {b,t,h} -> {box,text,heading}"),
                 ("book:/pages/*/pins", "pin {k,i|t,x,y} -> {kind,ref,x,y}"), ("book:/exercises", "ex {b,no,q,items} -> exercises[] (page, box)")],
 "window.PG@fig": [("book:/figures", "fig {b,no,cap,intro,items[x,y,name,desc]} -> figures[] (box, caption, intro, points)")],
 "window.TP": [("book:/lessons", "khoa b0/i*/t*/s* -> lessons[].id; kind book|intro|null|summary -> kind; sec, page, title"),
               ("book:/videos", "video[{t,n,v}] -> videos[].scenes[{title,narration,visual}]"),
               ("book:/exercises", "quiz[{q,a,c}] -> exercise kind ex.choice_single; model{k:order|sort|...} -> exercise ex.order/ex.sort_bins hoac simulation")],
 "window.TP@math": [("book:/simulations", "model{k:pv|shift|frac|area|tri|cuboid|ratio} -> simulations[] kind sim.place_value|decimal_shift|fraction_model|fraction_area|triangle_area|cuboid_volume|ratio_bars (params = cac truong con lai)")],
 "window.WBP": [("book:/pages", "trang vo -> pages[] voi volume='wb' (cung khung PG)"), ("book:/exercises", "ex vo -> exercises[] volume='wb'")],
 "window.WBS": [("book:/workbook_sets", "{id,tb,from,to,b,n,rev} -> {id, textbook_pin{page,box}, page_range, item_count, review}")],
 "window.WBI": [("book:/pages/*/fields", "{'i.j':[[x,y,w]]} -> fields[{type:'input', box:[x,y,w], exercise_ref, item_key}]")],
 "window.AUDIO": [("book:/media/clips", "{vi:{'<topic>-s<i>':[file,start,dur]}} -> clips[id][lang]={file:'audio_vi/vi_<file>.mp3',start,dur}")],
 "window.ROBO_HOST": [("book:/profile", "giao dien runtime, khong luu; context() dung lai tu profile + pages[].tr/ocr + lessons; tang0/gia-su quy dinh")],
 "CH": [("book:/units", "[trang,uz,vi,ru] -> units[{start_page,title}]")],
 "U": [("book:/ui_strings", "chuoi giao dien rieng cua cuon; chuoi chung chuyen sang tang 0 giao dien")],
 "Quy ước chuỗi": [("book:$defs/i18n", "danh dau noi dong {tu/mau} (phan so) va **dam** ghi trong mo ta i18n")],
 "window.DM@demo": [("book:/simulations", "81 kich ban {page,title,stage,init,add,blocks,steps} -> simulations[] kind sim.screen_demo; params={stage,init,add,blocks,steps}")],
 "window.DM@empty": [("book:/simulations", "rong {} - khong dung; khong mang sang (bo)")],
 "window.DEMO_STG": [("book:/simulations/*/params", "mau man hinh (stage) thuoc thu vien mo phong; cuon chi tham chieu ten stage")],
 "localStorage": [("book:$defs/learner_state", "ANS/done/cai dat -> learner_state (answers{v,ok,t}, done, settings, reminders)")],
 "window.BOOK": [("book:/units", "chapters[]/chapter -> units[] (no,page,pages,img,title,intro)"), ("book:/lessons", "lessons[{id,no,page,title,blocks}]"),
                 ("book:/lessons/*/blocks", "blocks[].type -> block.type + block.rubric"), ("book:/glossary", "glossary [[uz,vi,defUz,defVi,(chNo)]] -> glossary[]")],
 "RUDICT": [("book:/translation_memory", "tu dien uz->ru dung khi nhap lieu; buoc 4 do ru vao tung chuoi, bo getter Object.prototype.ru")],
 "VIDEOS": [("book:/videos", "{title,lesson,scenes[{min,n,draw}]} -> videos[{title,lesson,scenes[{min_seconds,narration,visual}]}]"),
            ("book:/videos/*/scenes/*/visual", "draw(p,s,L) ve tay -> visual sim.scene_custom_draw (params.code_ref); tham so hoa o buoc 4")],
 "VK/VIDEO_HELPERS": [("book:/videos/*/scenes/*/visual", "bo dung canh (VK.photo/cards/grid/explain...) -> visual.kind sim.scene_page_image|scene_cards|scene_icon_grid|scene_explain...; ma ve thuoc thu vien mo phong")],
 "SPRITE": [("book:/media/clips", "'<id>-<lang>':[file,start,dur] -> clips[id][lang]={file:'audio2/<file>',start,dur}")],
 "HOT@tabiiy": [("book:/pages/*/pins", "{k:audio|video|act|quiz|skills|flower|term|wb, ref, x,y,(w,h)} -> pins{kind,ref,x,y,w,h}")],
 "ACT": [("book:/simulations", "widget/mo phong -> simulations[] kind sim.*"), ("book:/exercises", "ACT la sorter/order (key11, sort12, order12...) -> exercises[] ex.sort_bins/ex.order")],
 "window.WB": [("book:/workbook_sets", "chapters[n].sections[] -> workbook_sets[] (kind,title,page,lesson,skills,need,steps,crop,noFree)"),
               ("book:/exercises", "items[{t,id,q,opts,a,rows,kw,hint,robot,crop,paper}] -> exercises[] kind ex.* (kw -> items[].answer_pattern; robot -> ai_feedback)")],
 "window.WBGEO": [("book:/pages/*/fields", "{l:[[x1,y,x2]], b:[[x,y,w,h]]} -> fields[{type:'underline', line}] / fields[{type:'box', box}]")],
 "ROBO": [("book:/profile", "doi tuong runtime cua gia su (svg, mount, bubble, localQuiz, addTask); khong luu - tang0/gia-su")],
 "__VM": [("book:/teacher/media_overrides", "db media/<id> {by:{all|uz|vi|ru:{mode,url|asset,at}}}")],
 "db media": [("book:/teacher/media_overrides", "db media/<topicId> {by:{...}}; rule read:view write:admin -> teacher.edit_role")],
 "PG@bio": [("book:/print_text", "W,H,st,T[] -> print_text{width,height,styles,paragraphs[{lesson,index,role,question,clip,text}]}"),
            ("book:/pages/*/text_lines", "pg{trang:[[x,y,w,size,style,text,tIdx]]} -> pages[].text_lines"),
            ("book:/pages/*/split_paragraphs", "fr{trang:{tIdx:[tu,den]}}"),
            ("book:/pages/*/pins", "figs{trang:[[n,x,y,w,h]]} -> pin kind figure; end{lesson:[trang,y]} -> pin kind quiz")],
 "db edit": [("book:/teacher/content_overrides", "edit/<key> {hidden, qs, v, ...}: q-l#-#, t-l#-#, x-<fig>, m-<video>")],
 "DATA.units": [("book:/units", "meta{no,kind,pages,title,sub,hero} -> units[{no,kind,page_range,title,subtitle,hero}]"),
                ("book:/lessons", "phan bai u<n>.<k> (theo bid) -> lessons[]")],
 "DATA.units.blocks": [("book:/lessons/*/blocks", "{t,pg,bid,...} -> block{type,rubric=t,page,id=bid}")],
 "sentence": [("book:$defs/sentence", "{uz,vi,ru,f,a,na} -> sentence{uz,vi,ru,audio_ref:'<f>#<a>',no_read}")],
 "gloss": [("book:/glossary", "{w,d,tr} -> {term{uz:w}, definition=d, short=tr, auto_underline}")],
 "SPR": [("book:/media/clips", "SPR[lang][f][a]=[fileIdx,start,dur] -> clips['<f>#<a>'][lang]={file:'audio/<lang>/<f>_<fileIdx>.mp3',...}"),
         ("book:/reading/audio_groups", "thu tu cau trong nhom f -> audio_groups[f][a] = id clip")],
 "HOT@adab": [("book:/reading/anchors", "[page,x,y,unitIdx,blockIdx,key] -> anchors{page,x,y,target:'<bid>/title|paras/i|stanzas/i/j'}"),
              ("book:/pages/*/pins", "moi anchor co mot pin kind text_anchor")],
 "LN_": [("book:/print_text/styles", "st[[font,bold,italic,color]]"), ("book:/pages/*/text_lines", "pg{n:[[x,y,w,size,style,text,hotIdx]]}")],
 "GEO": [("book:/pages/*/pins", "anch{bid:[page,y%]} -> pin (kind quiz/story/video)"),
         ("book:/pages/*/fields", "tbl{bid:[page,[[x,y,w,h,cell]]]} -> fields type table_cell; wl{page:[[x,y,w,h,lineH,rows]]} -> fields type write_lines")],
 "adab localStorage": [("book:$defs/learner_state", "S (cai dat) -> settings; A (cau tra loi) -> answers"), ("book:/teacher/content_overrides", "ovr: ban sua GV khi khong co db")],
 "db quiz": [("book:/teacher/content_overrides", "quiz/<id>: sua/an/them bo cau hoi (x…), nut video (l…) -> {qs,hidden,page,y,kind,title,deleted}"),
             ("book:/teacher/media_overrides", "quiz/m<bid> kind media -> thay phim tranh {mode,asset|url}")],
 "RUTXT": [("book:/pages/*/ocr", "{trang:[doan]} -> pages[].ocr.ru")],
}
DS_ROWS = {
 "matematika5": [("window.BOOK_PROFILE", "window.BOOK_PROFILE"), ("window.PG", "window.PG@A"), ("window.TP", "window.TP"), ("window.TP.model", "window.TP@math"),
                 ("window.WBP", "window.WBP"), ("window.WBS", "window.WBS"), ("window.WBI", "window.WBI"), ("window.AUDIO", "window.AUDIO"),
                 ("window.ROBO_HOST", "window.ROBO_HOST"), ("CH (hằng trong mã)", "CH"), ("U (hằng trong mã)", "U"), ("Quy ước chuỗi", "Quy ước chuỗi")],
 "informatika5": [("window.BOOK_PROFILE", "window.BOOK_PROFILE"), ("window.PG", "window.PG@A"), ("window.TP", "window.TP"), ("window.DM", "window.DM@demo"),
                  ("window.DEMO_STG", "window.DEMO_STG"), ("window.AUDIO", "window.AUDIO"), ("window.ROBO_HOST", "window.ROBO_HOST"),
                  ("CH (hằng trong script)", "CH"), ("localStorage", "localStorage")],
 "tabiiy5": [("window.BOOK_PROFILE", "window.BOOK_PROFILE"), ("window.BOOK", "window.BOOK"), ("window.RUDICT + ruOf()", "RUDICT"),
             ("window.VIDEOS / window.VK / window.VIDEO_HELPERS", "VIDEOS"), ("window.VK / window.VIDEO_HELPERS", "VK/VIDEO_HELPERS"),
             ("SPRITE / DUR", "SPRITE"), ("HOT", "HOT@tabiiy"), ("ACT", "ACT"), ("window.WB", "window.WB"), ("window.WBGEO", "window.WBGEO"),
             ("window.ROBO_HOST / window.ROBO", "window.ROBO_HOST"), ("window.ROBO", "ROBO"), ("window.__VM", "__VM")],
 "biologiya5": [("window.BOOK_PROFILE", "window.BOOK_PROFILE"), ("window.BOOK", "window.BOOK"), ("window.PG", "PG@bio"), ("window.VIDEOS", "VIDEOS"),
                ("window.VK", "VK/VIDEO_HELPERS"), ("window.VIDEO_HELPERS", "VK/VIDEO_HELPERS"),
                ("window.RUDICT + window.ruOf + getter Object.prototype.ru", "RUDICT"), ("const SPRITE / DUR", "SPRITE"),
                ("window.ROBO_HOST / window.ROBO", "window.ROBO_HOST"), ("Firestore-like db collection 'edit'", "db edit")],
 "adabiyot5": [("window.BOOK_PROFILE", "window.BOOK_PROFILE"), ("DATA.units[]", "DATA.units"), ("DATA.units[].blocks[]", "DATA.units.blocks"),
               ("đơn vị văn bản (para/line)", "sentence"), ("gloss[]", "gloss"), ("SPR", "SPR"), ("HOT", "HOT@adab"), ("LN_", "LN_"), ("GEO", "GEO"),
               ("localStorage adab5:S / adab5:A / adab5:ovr", "adab localStorage"), ("db collection 'quiz'", "db quiz")],
 "kimyo8": [("window.BOOK_PROFILE", "window.BOOK_PROFILE"), ("window.PG", "window.PG@A"), ("window.PG.fig", "window.PG@fig"), ("window.TP", "window.TP"),
            ("window.RUTXT", "RUTXT"), ("window.AUDIO", "window.AUDIO"), ("CH", "CH"), ("window.ROBO_HOST", "window.ROBO_HOST"),
            ("db: media/<topicId>", "db media"), ("window.DM", "window.DM@empty")],
 "fizika8": [("window.BOOK_PROFILE", "window.BOOK_PROFILE"), ("window.PG", "window.PG@A"), ("window.PG.fig", "window.PG@fig"), ("window.TP", "window.TP"),
             ("window.RUTXT", "RUTXT"), ("window.AUDIO", "window.AUDIO"), ("window.DM", "window.DM@empty"), ("CH (hằng trong mã)", "CH"),
             ("db media/<topicId>", "db media")],
}

# ---- loai khoi (ma goc) -> (schema_path, ghi_chu)
A_BLOCKS = {
 "tr": ("book:/pages/*/tr", "vung cham ghi chu dich"),
 "ex": ("book:/exercises", "bai tap SGK; pin kind exercise tren trang"),
 "pin": ("book:/pages/*/pins", "ghim mau"),
 "fig": ("book:/figures", "kham pha hinh; pin kind figure"),
 "video": ("book:/videos", "video hoat hinh dung bang ma (TP.video), phat bang sim.scene_player; v.k -> scenes[].visual.kind sim.*; pin kind video"),
 "quiz": ("book:/exercises", "kind ex.choice_single; lessons[].exercise_refs; pin kind quiz"),
 "model": ("book:/exercises", "order/sort -> ex.order/ex.sort_bins; mo hinh toan (matematika5) -> book:/simulations"),
 "wbset": ("book:/workbook_sets", "bo vo; pin kind workbook tren trang SGK"),
 "demo": ("book:/simulations", "mo phong thao tac phan mem; pin kind demo"),
 "glossary/chuong": ("book:/units", "6 mo-dun + Glossariy (CH) -> units[]"),
}
LESSON_BLOCKS = {
 "objectives": ("book:/lessons/*/blocks", "type list, rubric objectives"),
 "think": ("book:/lessons/*/blocks", "type prompt, rubric think (adabiyot5: co o ghi y nghi -> exercise ex.open_response khong cham)"),
 "explore": ("book:/lessons/*/blocks", "type text, rubric explore; activity -> exercise_refs (sort/order) hoac simulation_ref"),
 "learn": ("book:/lessons/*/blocks", "type text, rubric learn (paras, gallery, note, steps; audio_ref; video_ref neu co clip)"),
 "video": ("book:/lessons/*/blocks", "type video -> video_ref -> book:/videos"),
 "widget": ("book:/simulations", "block type simulation, simulation_ref -> simulations[] (ACT)"),
 "quiz": ("book:/exercises", "block type exercise rubric quiz -> exercises[] ex.choice_single"),
 "skills": ("book:/lessons/*/blocks", "type list, rubric skills, checkable=true (tu danh gia)"),
 "workbook": ("book:/lessons/*/blocks", "type workbook_link -> workbook_ref"),
 "career": ("book:/lessons/*/blocks", "type text, rubric career (anh + doan)"),
 "problem": ("book:/lessons/*/blocks", "type text, rubric problem; activity order -> exercise_refs"),
 "robot": ("book:/lessons/*/blocks", "type prompt, rubric robot"),
 "flower": ("book:/simulations", "block type simulation (mountFlower, PARTS) -> simulations[] kind sim.figure_explorer"),
 "glossary (thuật ngữ)": ("book:/glossary", "[uz,vi,defUz,defVi]; pin kind term (w,h)"),
 "figure": ("book:/figures", "block type figure -> figure_ref; labels -> figures[].labels; xp -> points"),
 "pic": ("book:/lessons/*/blocks", "type image, src, aspect"),
 "keywords": ("book:/lessons/*/blocks", "type list, rubric keywords"),
 "questions": ("book:/exercises", "block type exercise rubric questions -> ex.open_response (AI nhan xet)"),
 "task": ("book:/exercises", "block type exercise rubric task -> input text/table/none/record -> ex.open_response/ex.table_fill/ex.mark_done/ex.oral_recording; task_kind topshiriq|uyga|ijodiy"),
 "lab": ("book:/lessons/*/blocks", "type procedure (need, steps) + exercise_refs cho cau hoi; rubric lab|amaliy"),
 "table": ("book:/lessons/*/blocks", "type table (cols, rows tinh)"),
 "objectives|robot|problem|career|skills|workbook|flower": ("book:/lessons/*/blocks", "renderer co nhung cuon khong dung; da co type tuong ung (xem dong tabiiy5)"),
 "p": ("book:/lessons/*/blocks", "type text, rubric p, style hadis|note|quote, title/no/by"),
 "img": ("book:/lessons/*/blocks", "type image, crop (page_crop), caption"),
 "bio": ("book:/lessons/*/blocks", "type text, rubric bio, crop anh tac gia"),
 "poem": ("book:/lessons/*/blocks", "type poem, stanzas[][] cua sentence (lop doc van); story -> scenes"),
 "prose": ("book:/lessons/*/blocks", "type prose, paras + scenes[{at,crop}] (sim.picture_story), style=genre, continues"),
 "pre": ("book:/lessons/*/blocks", "type prompt, rubric pre (+ exercise ex.open_response khong cham)"),
 "know": ("book:/lessons/*/blocks", "type text, rubric know"),
 "talk": ("book:/exercises", "block type exercise rubric talk -> ex.open_response, ai_feedback feedback"),
 "link": ("book:/teacher/content_overrides", "nut video GV them luc chay (id l…), khong co trong du lieu goc"),
}

def nm(x): return x

rows = []
for b in BOOKS:
    inv = json.load(open(f"{R}/kiem-ke/{b}.json", encoding="utf8"))
    names = [d["ten"] for d in inv["cau_truc_du_lieu"]]
    listed = [n for n, _ in DS_ROWS[b]]
    missing = [n for n in names if n not in listed]
    assert not missing, (b, missing)
    for name, key in DS_ROWS[b]:
        for path, note in DS[key]:
            rows.append([b, name, path, "cấu trúc dữ liệu: " + note])
    for k in inv["loai_khoi"]:
        ma = k["ma"]
        if b in ("matematika5", "informatika5", "kimyo8", "fizika8"):
            path, note = A_BLOCKS[ma]
        elif b == "tabiiy5" and ma == "quiz":
            path, note = LESSON_BLOCKS["quiz"]
        else:
            path, note = LESSON_BLOCKS[ma] if ma in LESSON_BLOCKS else A_BLOCKS[ma]
        if b == "biologiya5" and ma == "video":
            note = "type video -> video_ref; 67 video, mot video tong moi bai + clip trong learn (print_text.paragraphs.clip)"
        if b == "biologiya5" and ma == "quiz":
            note += "; pin quiz cuoi bai tren trang in (PG.end)"
        if b == "adabiyot5" and ma == "quiz":
            note += "; supplementary=true (khong co trong sach), pin '?' tren trang"
        if b == "adabiyot5" and ma == "task":
            note += "; GEO.tbl -> pages[].fields table_cell"
        rows.append([b, ma, path, f"loại khối ({k['so_luong']}): " + note])

with open(os.path.join(SD, "bang-anh-xa.csv"), "w", encoding="utf8", newline="") as f:
    w = csv.writer(f); w.writerow(["book", "ma_goc", "schema_path", "ghi_chu"]); w.writerows(rows)
print("rows", len(rows))
