#!/usr/bin/env python3
"""Chuyển db của artifact CŨ sang artifact MỚI theo id bền (đề xuất 014, agent G). Chỉ đọc file, không gọi mạng.

Quy trình khi publish (người/agent publish làm, không phải script):
  1. Đọc db cũ:  ArtifactData action=list, url=<artifact cũ>, collection=media|edit|quiz|hw|res, out_dir=<thư mục dump>
     (mỗi tài liệu thành <dump>/<collection>/<doc_id>.json). Dump có thể lồng (res/<uid>/s/...) – script đi đệ quy.
  2. Chạy:  python3 -I chuyen_db.py --cuon kimyo8 --dump <thư mục dump> --ra <thư mục ra>
     Ra: ke-hoach.json (báo cáo + ánh xạ), batch-001.json… (mỗi file ≤ 50 lệnh, đúng dạng `writes` của ArtifactData
     action=batch), capabilities.json (khai báo db+user kèm quy tắc cho lệnh publish), sao-asset.json (id asset cần
     chép server-side bằng Artifact publish asset:true + from_url + asset_ids).
  3. Chép asset (nếu có), rồi chạy lại với --asset-map <json {id cũ: id mới}> để thay chỗ giữ "@asset:<id cũ>".
  4. ArtifactData action=batch, url=<artifact mới>, writes=<nội dung batch-xxx.json> (tài liệu mới: không cần if_version).

Ánh xạ (bảng đầy đủ trong ke-hoach.json → "quy_tac"):
  media/<id>          -> media/<id mới>  {by:{all|uz|ru|vi:{mode,url|asset,title}}} (teacher.media_overrides)
                         id mới: trùng id, legacy_ids, hoặc 'video.<id>' (kimyo8/fizika8 topic t17 -> video.t17)
                         {url} -> {mode:'url',url}; {asset,name} -> {mode:'asset',asset,title:name}
  edit/<k> (biologiya5): q-l<n>-<i> -> edit/<bài có legacy q-l<n>-<i>> {target, qs, hidden}
                         x-<n> -> edit/<hình có legacy x-<n>> {target, points…}; m-<video> -> media/<video>
                         t-l<n>-<i>, b-… -> edit/<k> {target:'<khóa cũ>', …} kèm cờ cần GV xem lại
  quiz/<bid> (adabiyot5) -> quiz/<bid> (bid giữ nguyên) chỉ giữ trường của content_override
  hw/<set>            -> hw/<set> nếu bộ còn tồn tại ($defs/assignment)
  res/<set>_<uid>     -> res/<khóa theo features.classroom.result_key> ($defs/class_result; lồng thì thêm tóm tắt res/<uid>)
  grade/…             -> chép như res (teacher_grade)
"""
import argparse, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
R = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))  # scratchpad
CO_FIELDS = {'target', 'hidden', 'deleted', 'text', 'qs', 'points', 'page', 'y', 'kind', 'title', 'media', 'v'}
MO_FIELDS = {'mode', 'url', 'asset', 'title', 'at'}
ASG_FIELDS = {'on', 'assigned', 'due', 'kind', 'target', 'note', 'by', 'ts'}
RES_FIELDS = {'set', 'uid', 'ok', 'tot', 'opd', 'op', 'mark', 'answers', 'lang', 'ts'}
SEG = re.compile(r'^[A-Za-z0-9_\-.~:@+]{1,200}$')


def seg(x):
    x = str(x)
    return x if SEG.match(x) and x not in ('.', '..') else re.sub(r'[^A-Za-z0-9_\-.~:@+]', lambda m: '~%x' % ord(m.group(0)), x)


def load_dump(d):
    """{đường dẫn tài liệu: dữ liệu} từ thư mục out_dir của ArtifactData (hoặc một file JSON {path: data})."""
    out = {}
    if os.path.isfile(d):
        raw = json.load(open(d))
        items = raw.items() if isinstance(raw, dict) else ((x['path'], x['data']) for x in raw)
        for p, v in items:
            out[p] = v
        return out
    for root, _, files in os.walk(d):
        for f in files:
            if not f.endswith('.json'):
                continue
            rel = os.path.relpath(os.path.join(root, f), d)[:-5].replace(os.sep, '/')
            v = json.load(open(os.path.join(root, f)))
            if isinstance(v, dict) and set(v) >= {'data', 'version'} and isinstance(v['data'], dict):
                v = v['data']  # bọc {version, data}
            out[rel] = v
    return out


class Book:
    def __init__(self, cuon):
        self.b = json.load(open(f'{R}/books/{cuon}/book.json'))
        fp = f'{R}/books/{cuon}/features.json'
        self.f = json.load(open(fp)) if os.path.exists(fp) else {}
        self.leg = {}
        self.ids = {}
        for coll in ('exercises', 'figures', 'videos', 'simulations', 'glossary', 'workbook_sets', 'lessons'):
            for x in self.b.get(coll) or []:
                if not isinstance(x, dict) or 'id' not in x:
                    continue
                self.ids[x['id']] = coll
                for l in x.get('legacy_ids') or []:
                    self.leg.setdefault(l, x['id'])

    def find(self, *cands, colls=None):
        for c in cands:
            if c in self.leg and (not colls or self.ids.get(self.leg[c]) in colls):
                return self.leg[c]
        for c in cands:
            if c in self.ids and (not colls or self.ids[c] in colls):
                return c
        return None

    def cls(self):
        c = self.f.get('classroom') or {}
        db = c.get('db') or {}
        return {'hw': db.get('assignments', 'hw'), 'res': db.get('results', 'res'), 'grade': db.get('grades', 'grade'),
                'key': c.get('result_key', '<set>_<uid>')}

    def set_ids(self):
        return {x['id'] for x in (self.b.get('workbook_sets') or []) + (self.b.get('lessons') or []) + (self.b.get('units') or []) + (self.b.get('exercises') or [])}


def db_rules(features):
    """Giống T0.classroom.dbRules (modules/classroom.js) – giữ hai bản khớp nhau."""
    c = features.get('classroom') or {}
    db = c.get('db') or {}
    hw, res, gr = db.get('assignments', 'hw'), db.get('results', 'res'), db.get('grades', 'grade')
    rules = [{'path': hw, 'read': 'view', 'write': 'admin'}, {'path': 'media', 'read': 'view', 'write': 'admin'},
             {'path': 'edit', 'read': 'view', 'write': 'admin'}, {'path': 'quiz', 'read': 'view', 'write': 'admin'}]
    if '/' in c.get('result_key', '<set>_<uid>'):
        rules += [{'path': res, 'read': 'admin', 'write': 'admin'}, {'path': res + '/{self}', 'read': 'interact', 'write': 'interact'},
                  {'path': gr, 'read': 'admin', 'write': 'admin'}, {'path': gr + '/{self}', 'read': 'interact', 'write': 'admin'}]
    else:
        rules += [{'path': gr, 'read': 'interact', 'write': 'admin'}]
    return rules


def media_val(v, assets):
    if not isinstance(v, dict):
        return None
    if 'mode' in v:
        o = {k: v[k] for k in v if k in MO_FIELDS}
    elif v.get('url'):
        o = {'mode': 'url', 'url': v['url']}
        if v.get('name') or v.get('title'):
            o['title'] = v.get('name') or v.get('title')
    elif v.get('asset'):
        o = {'mode': 'asset', 'asset': v['asset']}
        if v.get('name') or v.get('title'):
            o['title'] = v.get('name') or v.get('title')
    else:
        return None
    if o.get('mode') == 'asset' and o.get('asset'):
        assets.add(o['asset'])
        o['asset'] = '@asset:' + o['asset']
    return o


def plan(cuon, dump):
    B = Book(cuon)
    C = B.cls()
    sets = B.set_ids()
    writes, miss, review, assets = {}, [], [], set()

    def put(path, data):
        writes[path] = data

    for path, v in sorted(dump.items()):
        ps = path.split('/')
        coll, did = ps[0], ps[1] if len(ps) > 1 else ''
        if coll == 'media' and len(ps) == 2:
            nid = B.find(did, 'video.' + did, colls={'videos', 'simulations'})
            m = v if isinstance(v, dict) and 'by' in v else {'by': {'all': v}}
            by = {k: media_val(x, assets) for k, x in (m.get('by') or {}).items() if k in ('all', 'uz', 'ru', 'vi', 'kaa')}
            by = {k: x for k, x in by.items() if x}
            if not nid or not by:
                miss.append(path)
                continue
            put('media/' + seg(nid), {'by': by})
        elif coll == 'edit' and len(ps) == 2:
            d = v if isinstance(v, dict) else {}
            mm = re.match(r'^m-(.+)$', did)
            if mm:
                nid = B.find(mm.group(1), 'video.' + mm.group(1), colls={'videos', 'simulations'})
                mo = media_val(d.get('media') or d, assets)
                if nid and mo:
                    put('media/' + seg(nid), {'by': {'all': mo}})
                else:
                    miss.append(path)
                continue
            mq = re.match(r'^q-(l\d+)-(\d+)$', did)
            mx = re.match(r'^x-(.+)$', did)
            if mq:
                nid = B.find(did, f'{mq.group(1)}-q{mq.group(2)}', mq.group(1) + '.test', colls={'exercises'})
            elif mx:
                nid = B.find(did, colls={'figures'})
            else:
                nid = B.find(did, re.sub(r'^b-', '', did))
            o = {k: d[k] for k in d if k in CO_FIELDS}
            if not nid:
                o['target'] = did
                review.append(path)
                put('edit/' + seg(did), o)
                continue
            o['target'] = nid
            put('edit/' + seg(nid), o)
        elif coll == 'quiz' and len(ps) == 2:
            d = v if isinstance(v, dict) else {}
            o = {k: d[k] for k in d if k in CO_FIELDS}
            if isinstance(o.get('media'), dict):
                o['media'] = media_val(o['media'], assets) or o.pop('media')
            o['target'] = B.find(did) or did
            if o['target'] not in B.ids and not did.startswith(('x', 'l')):
                review.append(path)
            put('quiz/' + seg(did), o)
        elif coll == 'hw' and len(ps) == 2:
            if did not in sets:
                miss.append(path)
                continue
            put(C['hw'] + '/' + seg(did), {k: v[k] for k in v if k in ASG_FIELDS})
        elif coll in ('res', 'grade'):
            d = v if isinstance(v, dict) else {}
            s, u = d.get('set'), d.get('uid')
            if not s or not u:
                continue  # tài liệu tóm tắt của lớp lồng cũ: dựng lại bên dưới
            if s not in sets:
                miss.append(path)
                continue
            target = C['res'] if coll == 'res' else C['grade']
            key = C['key'].replace('<set>', seg(s)).replace('<uid>', seg(u))
            body = {k: d[k] for k in d if k in RES_FIELDS} if coll == 'res' else {k: d[k] for k in d if k in {'set', 'uid', 'items', 'mark', 'by', 'ts'}}
            put(target + '/' + key, body)
            if '/' in C['key']:
                sp = target + '/' + seg(u)
                sm = writes.get(sp) or {'uid': u, 'sets': {}}
                sm['sets'][s] = {k: body.get(k) for k in (('ok', 'tot', 'opd', 'op', 'mark', 'ts') if coll == 'res' else ('mark', 'ts'))}
                put(sp, sm)
        else:
            miss.append(path)
    return B, writes, miss, review, sorted(assets)


def subst_assets(o, amap):
    if isinstance(o, dict):
        return {k: subst_assets(x, amap) for k, x in o.items()}
    if isinstance(o, list):
        return [subst_assets(x, amap) for x in o]
    if isinstance(o, str) and o.startswith('@asset:') and o[7:] in amap:
        return amap[o[7:]]
    return o


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--cuon', required=True)
    ap.add_argument('--dump', required=True, help='out_dir của ArtifactData list, hoặc file JSON {path: data}')
    ap.add_argument('--ra', required=True)
    ap.add_argument('--asset-map', help='JSON {id asset cũ: id mới} sau khi chép asset')
    a = ap.parse_args()
    B, writes, miss, review, assets = plan(a.cuon, load_dump(a.dump))
    amap = json.load(open(a.asset_map)) if a.asset_map else {}
    os.makedirs(a.ra, exist_ok=True)
    for f in os.listdir(a.ra):
        if re.match(r'^batch-\d+\.json$', f):
            os.remove(os.path.join(a.ra, f))
    ws = []
    for path, data in writes.items():
        ps = path.split('/')
        ws.append({'op': 'set', 'collection': '/'.join(ps[:-1]), 'doc_id': ps[-1], 'data': subst_assets(data, amap)})
    for i in range(0, len(ws), 50):
        json.dump(ws[i:i + 50], open(os.path.join(a.ra, 'batch-%03d.json' % (i // 50 + 1)), 'w'), ensure_ascii=False, indent=1)
    left = sorted({x for x in assets if x not in amap})
    json.dump({'asset_ids': left, 'ghi_chu': 'Artifact publish url=<mới> asset:true from_url=<cũ> asset_ids=<≤10/lần>; rồi --asset-map'},
              open(os.path.join(a.ra, 'sao-asset.json'), 'w'), ensure_ascii=False, indent=1)
    caps = {'db': {'rules': db_rules(B.f)}, 'user': {'scopes': ['profile']}}
    for c in B.f.get('capabilities') or []:
        if c not in caps:
            caps[c] = {} if c != 'downloads' else True
    json.dump(caps, open(os.path.join(a.ra, 'capabilities.json'), 'w'), ensure_ascii=False, indent=1)
    rep = {'cuon': a.cuon, 'so_lenh_ghi': len(ws), 'so_batch': (len(ws) + 49) // 50, 'khong_anh_xa': miss, 'can_gv_xem_lai': review,
           'asset_can_chep': left, 'quy_tac': __doc__.split('Ánh xạ')[1].strip()}
    json.dump(rep, open(os.path.join(a.ra, 'ke-hoach.json'), 'w'), ensure_ascii=False, indent=1)
    print(json.dumps({k: (v if not isinstance(v, list) else len(v)) for k, v in rep.items() if k != 'quy_tac'}, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    sys.exit(main())
