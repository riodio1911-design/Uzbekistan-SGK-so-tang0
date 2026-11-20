/* T0 migrate – chuyển MỘT LẦN bài làm ở localStorage của bản HTML cũ sang id bền mới (đề xuất 014, agent G).
 * Chạy khi t0:load nếu chưa có cờ 't0:<book>:mig:v1'. Không xóa khóa cũ (để còn đường lùi). Chỉ ghi khóa nào
 * ánh xạ được qua exercises[].legacy_ids (hoặc id trùng, hoặc data.legacy_cell_key) – nên khóa lạ của cuốn khác bị bỏ qua.
 *
 * Nguồn cũ (theo book_id; mỗi artifact cũ là một origin riêng, publish lên cùng URL thì localStorage còn nguyên):
 *   nij   'mat5.ans' 'inf5.ans' 'kim8.ans' 'fiz8.ans' = {'<n>.<i>.<j>' | 'w<n>.<i>.<j>': {v, ok, t}}
 *         -> bài có legacy 'p<n>.ex<i>' / 'w<n>.ex<i>' / '<n>.<i>', ý thứ j (items[j]).
 *   done  'gul:done' = ['q:<x>'] -> bài có legacy 'q:<x>' hoặc id '<x>.quiz' / '<x>.test' / '<x>.test.*' (đánh dấu đã làm).
 *   gul   'gul:ans:<k>' (biologiya5, tabiiy5): k = legacy id của bài; '<…>-c<n>' = ô bảng n (data.legacy_cell_key).
 *   wb    'wb:<chương>' (tabiiy5 vở) = {<id ý vở>: chuỗi | {r<i>c<j>: chuỗi}} -> legacy 'WB.chapters[<chương>].<id>'.
 *   adab  'adab5:A' = {'<bid>': true|chuỗi, '<bid>.p<i>': chuỗi, '<bid>.q<j>': chỉ số phương án} -> bài id = bid.
 *         Khóa '<bid>.v<v>.q<j>' (bộ quiz GV đã sửa) không chuyển: câu hỏi có thể đã khác.
 *   hw    'mat5.hw' -> 'cls:hw' (giao bài thử khi chưa có db).
 * Ghi ra (T0.store): 'cls:ans' (answer_map, nguồn cho res/), 'ex:<id>:v' {chỉ số ý: giá trị} (short_answer, open_response…),
 *   'ex:<id>:ans' (ô bảng r<i>c<j>), 'res:<id>' {ok, score, t, migrated} (ghim hiện "đã làm"), 'mig:v1' (báo cáo).
 * Phát 't0:migrated' {exercises, report} – classroom.js đẩy các bộ liên quan lên res/.
 * API thuần để thử/công cụ: T0.migrate.plan(book, raw) với raw = {khóa localStorage: chuỗi thô}.
 */
(function () {
  'use strict';
  const T0 = (window.T0 = window.T0 || {});
  const M = (T0.migrate = T0.migrate || {});
  M.VERSION = 1;
  M.FLAG = 'mig:v' + M.VERSION;
  M.SOURCES = {
    matematika5: [{ type: 'nij', key: 'mat5.ans' }, { type: 'hw', key: 'mat5.hw' }],
    informatika5: [{ type: 'nij', key: 'inf5.ans' }, { type: 'done', key: 'gul:done' }],
    kimyo8: [{ type: 'nij', key: 'kim8.ans' }, { type: 'done', key: 'gul:done' }],
    fizika8: [{ type: 'nij', key: 'fiz8.ans' }, { type: 'done', key: 'gul:done' }],
    biologiya5: [{ type: 'gul', prefix: 'gul:ans:' }, { type: 'done', key: 'gul:done' }],
    tabiiy5: [{ type: 'wb', prefix: 'wb:' }, { type: 'gul', prefix: 'gul:ans:' }, { type: 'done', key: 'gul:done' }],
    adabiyot5: [{ type: 'adab', key: 'adab5:A' }],
  };

  const parse = (raw) => { if (raw == null) return undefined; try { return JSON.parse(raw); } catch (e) { return raw; } };
  const filled = (v) => v != null && v !== '' && v !== false;

  function units(ex) {
    if (T0.classroom && T0.classroom.units) return T0.classroom.units(ex);
    const items = Array.isArray(ex.items) && ex.items.length ? ex.items : null;
    if (!items) return [{ key: ex.id, idx: 0, it: ex, auto: ex.correct != null || !!ex.answer }];
    return items.map((it, i) => { const iid = it.id != null && it.id !== '' ? String(it.id) : String(i); return { key: iid.startsWith(ex.id + '.') ? iid : ex.id + '.' + iid, idx: i, it, auto: !it.open && (it.answer != null || it.correct != null) }; });
  }

  function index(book) {
    const byLeg = {}, byId = {}, cells = [];
    (book.exercises || []).forEach((ex) => {
      byId[ex.id] = ex;
      (ex.legacy_ids || []).forEach((l) => { if (!byLeg[l]) byLeg[l] = ex; });
      const ck = ex.data && ex.data.legacy_cell_key;
      if (ck && /<n>$/.test(ck)) cells.push({ prefix: ck.replace(/<n>$/, ''), ex });
    });
    return { byLeg, byId, cells, find: (...c) => { for (const k of c) { if (byLeg[k]) return byLeg[k]; } for (const k of c) { if (byId[k]) return byId[k]; } return null; } };
  }

  /* Kế hoạch thuần: không chạm DOM/localStorage. Trả về các ghi cần làm và báo cáo. */
  M.plan = function (book, raw) {
    const ix = index(book);
    const srcs = M.SOURCES[book.book_id] || [];
    const out = { answers: {}, vals: {}, cells: {}, done: new Set(), hw: null, touched: new Set(), mapped: 0, unmapped: [] };
    const miss = (k) => { if (out.unmapped.length < 200) out.unmapped.push(k); out.nMiss = (out.nMiss || 0) + 1; };
    const setUnit = (ex, i, v, ok, t) => {
      const us = units(ex); const u = us[i] || (us.length === 1 ? us[0] : null);
      if (!u) return false;
      if (!filled(v) && ok == null) return false;
      const rec = { v: v === undefined ? null : v, ok: ok === true || ok === false ? ok : null, t: t || 1 };
      if (u.auto && rec.ok == null) {
        if (u.it.correct != null && typeof v === 'number') rec.ok = Array.isArray(u.it.correct) ? u.it.correct.includes(v) : u.it.correct === v;
        else if (u.it.answer && typeof v === 'string' && T0.grade) rec.ok = !!T0.grade.shortAnswer(v, u.it.answer, ((u.it.grading || ex.grading) || {}).rule || (book.grading_defaults || {}).short_answer_rule);
      }
      out.answers[u.key] = rec;
      if (typeof v === 'string' && /^ex\.(short_answer|open_response|fill_blanks)$/.test(u.it.kind || ex.kind)) (out.vals[ex.id] = out.vals[ex.id] || {})[u.idx] = v;
      out.touched.add(ex.id); out.mapped++;
      return true;
    };
    const keys = Object.keys(raw);
    const pre = 't0:' + book.book_id + ':';
    keys.filter((k) => k.startsWith(pre)).forEach((k) => {
      const m = /^(ex|res):(.+?)(:v|:ans)?$/.exec(k.slice(pre.length)); if (!m) return;
      const oldId = m[2]; if (ix.byId[oldId]) return; // id còn hiệu lực: không cần chuyển
      const ex = ix.byLeg[oldId]; if (!ex) return miss(k);
      const v = parse(raw[k]); if (v == null) return;
      if (m[1] === 'res') { out.t0res = out.t0res || {}; out.t0res[ex.id] = v; }
      else if (m[3] === ':v') out.vals[ex.id] = Object.assign({}, v, out.vals[ex.id] || {});
      else if (m[3] === ':ans') out.cells[ex.id] = Object.assign({}, v, out.cells[ex.id] || {});
      out.touched.add(ex.id); out.mapped++;
    });
    srcs.forEach((src) => {
      if (src.type === 'nij') {
        const A = parse(raw[src.key]); if (!A || typeof A !== 'object') return;
        Object.entries(A).forEach(([k, a]) => {
          const m = /^(w?)(\d+)\.(\d+)\.(\d+)$/.exec(k); if (!m) return miss(src.key + ':' + k);
          const ex = ix.find((m[1] ? 'w' : 'p') + m[2] + '.ex' + m[3], (m[1] ? 'w' : '') + m[2] + '.' + m[3]);
          const r = a && typeof a === 'object' ? a : { v: a };
          if (!ex || !setUnit(ex, +m[4], r.v, r.ok, r.t)) miss(src.key + ':' + k);
        });
      } else if (src.type === 'done') {
        const D = parse(raw[src.key]); if (!Array.isArray(D)) return;
        D.forEach((d) => {
          const x = String(d).replace(/^q:/, '');
          let exs = [ix.find(String(d), x + '.quiz', x + '.test')].filter(Boolean);
          if (!exs.length) exs = (book.exercises || []).filter((e) => e.id.startsWith(x + '.test.') || e.id.startsWith(x + '.quiz.'));
          if (!exs.length) return miss(src.key + ':' + d);
          exs.forEach((e) => { out.done.add(e.id); out.touched.add(e.id); }); out.mapped++;
        });
      } else if (src.type === 'gul') {
        keys.filter((k) => k.startsWith(src.prefix)).forEach((k) => {
          const lk = k.slice(src.prefix.length); const v = parse(raw[k]);
          if (!filled(v)) return;
          const ex = ix.find(lk);
          if (ex) { if (!setUnit(ex, 0, v, null, 1)) miss(k); return; }
          const c = ix.cells.find((x) => lk.startsWith(x.prefix) && /^\d+$/.test(lk.slice(x.prefix.length)));
          if (!c) return miss(k);
          const n = +lk.slice(c.prefix.length); const tb = c.ex.table || {};
          const nc = Math.max(((tb.cols || []).length - (tb.first_col ? 1 : 0)) || 1, 1);
          const ck = 'r' + Math.floor(n / nc) + 'c' + (n % nc);
          (out.cells[c.ex.id] = out.cells[c.ex.id] || {})[ck] = v;
          out.touched.add(c.ex.id); out.mapped++;
        });
      } else if (src.type === 'wb') {
        keys.filter((k) => /^wb:\d+$/.test(k)).forEach((k) => {
          const ch = k.slice(3); const A = parse(raw[k]); if (!A || typeof A !== 'object') return;
          Object.entries(A).forEach(([id, v]) => {
            if (!filled(v)) return;
            const ex = ix.find('WB.chapters[' + ch + '].' + id);
            if (!ex) return miss(k + ':' + id);
            if (v && typeof v === 'object') {
              out.cells[ex.id] = Object.assign(out.cells[ex.id] || {}, v);
              const us = units(ex); out.answers[us[0].key] = { v, ok: null, t: 1 }; out.touched.add(ex.id); out.mapped++;
            } else {
              const us = units(ex); const i = Math.max(0, us.findIndex((u) => String(u.it.id) === id));
              if (!setUnit(ex, i, v, null, 1)) miss(k + ':' + id);
            }
          });
        });
      } else if (src.type === 'adab') {
        const A = parse(raw[src.key]); if (!A || typeof A !== 'object') return;
        Object.entries(A).forEach(([k, v]) => {
          let m = /^(.+?)\.v(\d+)\.q(\d+)$/.exec(k);
          if (m) return miss(k + ' (bản GV đã sửa)');
          m = /^(.+)\.q(\d+)$/.exec(k);
          if (m) { const ex = ix.find(m[1]); if (!ex || !setUnit(ex, +m[2], typeof v === 'string' && /^\d+$/.test(v) ? +v : v, null, 1)) miss(k); return; }
          m = /^(.+)\.p(\d+)$/.exec(k);
          if (m) { const ex = ix.find(m[1]); if (!ex || !setUnit(ex, +m[2], v, null, 1)) miss(k); return; }
          const ex = ix.find(k);
          if (!ex) return miss(k);
          if (v === true) { out.done.add(ex.id); out.touched.add(ex.id); out.mapped++; return; }
          if (!setUnit(ex, 0, v, null, 1)) miss(k);
        });
      } else if (src.type === 'hw') {
        const H = parse(raw[src.key]); if (H && typeof H === 'object' && Object.keys(H).length) out.hw = H;
      }
    });
    // kết quả tóm tắt mỗi bài (res:<id> của core) để ghim hiện "đã làm"
    out.res = {};
    out.touched.forEach((id) => {
      const ex = ix.byId[id]; const us = units(ex);
      const auto = us.filter((u) => u.auto);
      const got = auto.filter((u) => out.answers[u.key]);
      if (auto.length && got.length === auto.length) {
        const okN = got.filter((u) => out.answers[u.key].ok === true).length;
        out.res[id] = { ok: okN === auto.length, score: okN / auto.length };
      } else if (!auto.length || out.done.has(id)) out.res[id] = { ok: null, score: null };
    });
    Object.entries(out.t0res || {}).forEach(([id, r]) => { if (r && typeof r === 'object') out.res[id] = { ok: r.ok == null ? null : r.ok, score: r.score == null ? null : r.score }; });
    out.report = { book: book.book_id, mapped: out.mapped, unmapped: out.nMiss || 0, sample_unmapped: out.unmapped.slice(0, 20), exercises: out.touched.size, done: out.done.size };
    return out;
  };

  function readRaw(book) {
    const raw = {}; const srcs = M.SOURCES[book.book_id] || [];
    try {
      const ls = window.localStorage;
      for (let i = 0; i < ls.length; i++) {
        const k = ls.key(i);
        if (srcs.some((s) => (s.key && s.key === k) || (s.prefix && k.startsWith(s.prefix))) || /^t0:[^:]+:(ex|res):/.test(k) && k.startsWith('t0:' + book.book_id + ':')) raw[k] = ls.getItem(k);
      }
    } catch (e) { /* localStorage bị chặn: không có gì để chuyển */ }
    return raw;
  }

  /* Chạy thật: ghi vào T0.store, không ghi đè dữ liệu mới đã có. force: chạy lại dù đã có cờ. */
  M.run = function (opts = {}) {
    const book = T0.book; if (!book || !T0.store) return null;
    if (!opts.force && T0.store.get(M.FLAG, null)) return null;
    const raw = opts.raw || readRaw(book);
    if (!Object.keys(raw).length) { T0.store.set(M.FLAG, { t: Date.now(), mapped: 0, unmapped: 0, empty: true }); return null; }
    const p = M.plan(book, raw); const now = Date.now();
    const A = T0.store.get('cls:ans', {}) || {};
    Object.entries(p.answers).forEach(([k, v]) => { if (!A[k]) A[k] = v; });
    T0.store.set('cls:ans', A);
    Object.entries(p.vals).forEach(([id, v]) => { const k = 'ex:' + id + ':v'; if (T0.store.get(k, null) == null) T0.store.set(k, v); });
    Object.entries(p.cells).forEach(([id, v]) => { const k = 'ex:' + id + ':ans'; if (T0.store.get(k, null) == null) T0.store.set(k, v); });
    Object.entries(p.res).forEach(([id, r]) => { const k = 'res:' + id; if (T0.store.get(k, null) == null) T0.store.set(k, Object.assign({ t: now, migrated: true }, r)); });
    if (p.hw) { const h = T0.store.get('cls:hw', {}) || {}; if (!Object.keys(h).length) T0.store.set('cls:hw', p.hw); }
    const report = Object.assign({ t: now }, p.report);
    T0.store.set(M.FLAG, report);
    T0.emit('t0:migrated', { exercises: [...p.touched], report });
    return report;
  };

  T0.on && T0.on('t0:load', () => { try { M.run(); } catch (e) { console.error('migrate', e); } });
  if (T0.book) setTimeout(() => { try { M.run(); } catch (e) { console.error('migrate', e); } }, 0);
})();
