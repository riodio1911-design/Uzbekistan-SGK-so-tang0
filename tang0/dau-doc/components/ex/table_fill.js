/* components/ex/table_fill.js — R2. Dạng ex.table_fill (thu-vien/bai-tap/danh-muc.json).
   Hai dạng dữ liệu đang có:
   (A) "hàng có chọn" (tabiiy5 WB table): items[{prompt, correct}] = hàng (cột đầu cố định) + ô chọn chức năng;
       phương án lấy từ data.cell_options | exercise.options | item.options; cột ghi chú tự do từ data.flowers.
       Chấm select_per_row: đúng nếu chỉ số chọn === correct; điểm = số hàng đúng / số hàng.
       Không có danh sách phương án → ô chữ tự do, chỉ lưu (không chấm) và báo thiếu dữ liệu.
   (B) "bảng trống" (biologiya5/adabiyot5): table{cols, rows:số|mảng, first_col}; ô {input/answer?} chấm accept_v2, còn lại chỉ lưu.
   Phần đầu (prompt) và nút Kiểm tra/Lưu do T0.renderEx (core) vẽ; noCheck=true khi không có ô chấm được.
   Đáp án lưu: T0.store 'ex:<id>:ans'. */
(function () {
  const T0 = window.T0 = window.T0 || {};
  const UI = {
    part: { uz: 'Qism', ru: 'Часть', vi: 'Bộ phận' },
    fn: { uz: 'Vazifasi', ru: 'Функция', vi: 'Chức năng' },
    choose: { uz: '— tanlang —', ru: '— выберите —', vi: '— chọn —' },
    note: { uz: 'rangi, soni…', ru: 'цвет, количество…', vi: 'màu, số lượng…' },
    noOpts: { uz: 'Variantlar ro‘yxati yo‘q — javob faqat saqlanadi.', ru: 'Нет списка вариантов — ответ только сохраняется.', vi: 'Dữ liệu chưa có danh sách phương án — câu trả lời chỉ được lưu, không chấm.' },
    saved: { uz: 'Saqlandi.', ru: 'Сохранено.', vi: 'Đã lưu.' },
    allRight: { uz: 'Barakalla! Hammasi to‘g‘ri.', ru: 'Молодец! Всё верно.', vi: 'Giỏi lắm! Tất cả đều đúng.' },
    someWrong: { uz: 'Qizil kataklarni qayta ko‘rib chiqing.', ru: 'Проверьте ячейки, отмеченные красным.', vi: 'Hãy xem lại các ô viền đỏ.' }
  };
  const t = o => (T0.t ? T0.t(o) : (o && (o[T0.lang] || o.uz))) || '';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const asset = p => !p ? '' : /^(data:|https?:|blob:|\/)/.test(p) ? p : (T0.asset ? T0.asset(p) : 'mau/' + T0.book.book_id + '/' + p);
  /* accept_v2 (D2): chữ thường, MỌI dấu nháy → ‘, gộp khoảng trắng, bỏ dấu chấm cuối; phương án thay thế nối bằng '|' */
  const norm = s => (T0.grade && T0.grade.norm ? T0.grade.norm(s) : String(s || '').toLowerCase().replace(/[‘’ʻʼ'`]/g, '‘').replace(/\s+/g, ' ').trim()).replace(/[.。]+$/, '').trim();
  const accept = (v, ans) => String(ans).split('|').some(a => norm(a) === norm(v));

  function render(el, ex, ctx) {
    const skey = 'ex:' + ex.id + ':ans';
    let ans = Object.assign({}, (T0.store && T0.store.get(skey, null)) || {});
    let checked = false;
    const save = () => T0.store && T0.store.set(skey, ans);
    const data = ex.data || {};
    const rowsMode = Array.isArray(ex.items) && ex.items.length && !ex.table;

    if (rowsMode) {
      const items = ex.items;
      const optsFor = it => ex.cell_options || data.cell_options || ex.options || it.options || null; // ex.cell_options: chuẩn D2
      const extra = data.flowers || data.columns_extra || [];
      const anyOpts = items.some(optsFor);
      const draw = () => {
        el.innerHTML = `<div class="t0x-tf">
          ${!anyOpts ? `<p class="t0x-warn">${esc(t(UI.noOpts))}</p>` : ''}
          ${extra.length ? `<div class="t0x-tf-heads">${extra.map(f => `<figure>${f.src ? `<img src="${esc(asset(f.src))}" alt="">` : ''}<figcaption>${esc(t(f.name))}</figcaption></figure>`).join('')}</div>` : ''}
          <div class="t0x-tf-rows">${items.map((it, i) => {
            const opts = optsFor(it); const v = ans['f' + i];
            const st = checked && opts ? (v !== undefined && v !== '' && +v === it.correct ? ' ok' : ' bad') : '';
            return `<div class="t0x-tf-row"><div class="t0x-tf-part">${esc(t(it.prompt))}</div>
              <label class="t0x-tf-cell"><span>${esc(t(UI.fn))}</span>${opts
                ? `<select class="k-hit${st}" data-f="${i}"><option value="">${esc(t(UI.choose))}</option>${opts.map((o, j) => `<option value="${j}"${v !== undefined && v !== '' && +v === j ? ' selected' : ''}>${esc(t(o))}</option>`).join('')}</select>`
                : `<input type="text" data-ft="${i}" value="${esc(ans['t' + i] || '')}">`}</label>
              ${extra.map((f, k) => `<label class="t0x-tf-cell"><span>${esc(t(f.name))}</span><input type="text" data-n="${i}-${k}" value="${esc(ans['n' + i + '-' + k] || '')}" placeholder="${esc(t(UI.note))}"></label>`).join('')}
            </div>`;
          }).join('')}</div></div>`;
        el.querySelectorAll('select[data-f]').forEach(s => s.onchange = () => { ans['f' + s.dataset.f] = s.value; checked = false; s.classList.remove('ok', 'bad'); save(); });
        el.querySelectorAll('input[data-ft]').forEach(s => s.onchange = () => { ans['t' + s.dataset.ft] = s.value; save(); });
        el.querySelectorAll('input[data-n]').forEach(s => s.onchange = () => { ans['n' + s.dataset.n] = s.value; save(); });
      };
      draw();
      return {
        check() {
          if (!anyOpts) return { ok: null, score: null, feedback: t(UI.saved) };
          checked = true; draw();
          const g = items.filter(optsFor); const right = g.filter(it => { const i = items.indexOf(it); const v = ans['f' + i]; return v !== undefined && v !== '' && +v === it.correct; }).length;
          const ok = right === g.length;
          return { ok, score: g.length ? right / g.length : 0, feedback: (ok ? t(UI.allRight) : t(UI.someWrong)) + ` (${right}/${g.length})` };
        },
        reset() { ans = {}; checked = false; save(); draw(); },
        answer() { return Object.assign({}, ans); },
        noCheck: !anyOpts
      };
    }

    /* (B) bảng trống */
    const tb = ex.table || {}; const cols = tb.cols || []; const first = tb.first_col || null;
    const nrows = Array.isArray(tb.rows) ? tb.rows.length : (tb.rows || (first ? first.length : 3));
    const fixed = Array.isArray(tb.rows) ? tb.rows : null;
    const ncols = Math.max(cols.length - (first ? 1 : 0), 1);
    const cellOf = (r, c) => fixed && fixed[r] ? fixed[r][c + (first ? 1 : 0)] : null;
    const graded = [];
    const draw = () => {
      el.innerHTML = `<div class="t0x-tf"><div class="t0x-tf-scroll"><table class="t0x-tbl">
        ${cols.length ? `<thead><tr>${cols.map(c => `<th>${esc(t(c))}</th>`).join('')}</tr></thead>` : ''}
        <tbody>${Array.from({ length: nrows }, (_, r) => `<tr>${first ? `<th scope="row">${esc(t(first[r]))}</th>` : ''}${Array.from({ length: ncols }, (_, c) => {
          const cell = cellOf(r, c); const k = 'r' + r + 'c' + c;
          if (cell && !cell.input && (cell.uz || typeof cell === 'string')) return `<td>${esc(t(cell))}</td>`;
          const st = checked && cell && cell.answer ? (accept(ans[k], cell.answer) ? ' ok' : ' bad') : '';
          return `<td><input type="text" class="${st}" data-k="${k}" value="${esc(ans[k] || '')}" placeholder="${esc(cell && cell.placeholder ? t(cell.placeholder) : '')}"></td>`;
        }).join('')}</tr>`).join('')}</tbody></table></div></div>`;
      el.querySelectorAll('input[data-k]').forEach(s => s.onchange = () => { ans[s.dataset.k] = s.value; save(); });
    };
    draw();
    if (fixed) fixed.forEach((row, r) => row.forEach((cell, c) => { if (cell && cell.answer) graded.push(['r' + r + 'c' + (c - (first ? 1 : 0)), cell.answer]); }));
    return {
      check() {
        if (!graded.length) return { ok: null, score: null, feedback: t(UI.saved) };
        checked = true; draw();
        const right = graded.filter(([k, a]) => accept(ans[k], a)).length;
        return { ok: right === graded.length, score: right / graded.length, feedback: (right === graded.length ? t(UI.allRight) : t(UI.someWrong)) + ` (${right}/${graded.length})` };
      },
      reset() { ans = {}; checked = false; save(); draw(); },
      answer() { return Object.assign({}, ans); },
      noCheck: !graded.length
    };
  }

  const css = `
.t0x-warn{margin:0 0 var(--space-2);padding:6px 10px;border-radius:var(--radius-sm);background:var(--hue-gold-soft);color:var(--color-ink);font-size:var(--text-sm)}
.t0x-tf-heads{display:flex;gap:var(--space-3);margin:0 0 var(--space-3)}
.t0x-tf-heads figure{margin:0;display:flex;align-items:center;gap:8px;font-size:var(--text-sm);font-weight:700}
.t0x-tf-heads img{width:52px;height:52px;object-fit:cover;border-radius:var(--radius-sm)}
.t0x-tf-rows{display:grid;gap:var(--space-2)}
.t0x-tf-row{display:grid;gap:var(--space-2);grid-template-columns:1fr;padding:var(--space-3);border:1px solid var(--color-line);border-radius:var(--radius-sm);background:var(--color-surface-2)}
@media (min-width:700px){.t0x-tf-row{grid-template-columns:minmax(120px,.8fr) minmax(180px,1.6fr) repeat(auto-fit,minmax(120px,1fr));align-items:end}}
.t0x-tf-part{font-weight:800;align-self:center}
.t0x-tf-cell{display:flex;flex-direction:column;gap:2px;font-size:var(--text-xs);color:var(--color-ink-2);min-width:0}
.t0x-tf-cell select,.t0x-tf-cell input,.t0x-tbl input{min-height:var(--touch-min);font:inherit;font-size:var(--text-ui);color:var(--color-ink);background:var(--color-surface);border:1px solid var(--color-line);border-radius:var(--radius-sm);padding:0 8px;width:100%;box-sizing:border-box;min-width:0}
.t0x-tf .ok{border:2px solid var(--color-ok);background:var(--color-ok-soft)}.t0x-tf .bad{border:2px solid var(--color-bad);background:var(--color-bad-soft)}
.t0x-tf-scroll{overflow-x:auto}.t0x-tbl{border-collapse:collapse;width:100%}.t0x-tbl th,.t0x-tbl td{border:1px solid var(--color-line);padding:4px;text-align:left}
`;
  if (!document.getElementById('t0x-tf-css')) { const s = document.createElement('style'); s.id = 't0x-tf-css'; s.textContent = css; document.head.append(s); }
  T0.registerEx('ex.table_fill', { render });
})();
