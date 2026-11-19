/* ex.label_reveal — đố nhãn trên hình, chạm để lật (agent C, đề xuất 003).
 * Dữ liệu: data.figure_ref (id trong book.figures) hoặc figure (object); nhãn lấy từ figure.points[{x, y, name, desc?}]
 *   hoặc data.labels[{x, y, text}] (thư viện). Ảnh: figure.src; không có/lỗi thì cắt từ trang figure.page + figure.box.
 * Không chấm (khong_cham): đếm số nhãn đã mở. */
(function () {
  const T0 = window.T0;
  const CSS = `.exlr-fig{position:relative;margin:0 0 var(--space-3,12px);user-select:none}
.exlr-fig .exc-img,.exlr-fig .t0-crop{width:100%}
.exlr-m{position:absolute;width:var(--touch-min,44px);height:var(--touch-min,44px);transform:translate(-50%,-50%);border:0;background:transparent;padding:0;cursor:pointer;display:flex;align-items:center;justify-content:center}
.exlr-m span{min-width:26px;height:26px;border-radius:13px;padding:0 6px;background:var(--color-accent);color:var(--color-on-accent);font-size:13px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px var(--color-surface),var(--shadow-1)}
.exlr-m[aria-expanded="true"] span{background:var(--color-ok)}
.exlr-m:focus-visible span{outline:3px solid var(--color-accent);outline-offset:2px}
.exlr-l{display:grid;gap:6px;margin:0 0 var(--space-2,8px);padding:0;list-style:none}
.exlr-l button{display:flex;gap:var(--space-2,8px);align-items:flex-start;width:100%;min-height:var(--touch-min,44px);padding:8px 10px;border:1.5px solid var(--color-line);border-radius:var(--radius-md,10px);background:var(--color-surface);color:var(--color-ink);font:inherit;font-size:var(--text-ui,15px);text-align:left;cursor:pointer;line-height:1.4}
.exlr-l button b{flex:none;min-width:24px;color:var(--color-accent-ink)}
.exlr-l button .q{color:var(--color-ink-2);letter-spacing:.2em}
.exlr-l button[aria-expanded="true"]{border-color:var(--color-ok);background:var(--color-ok-soft)}
.exlr-l small{display:block;color:var(--color-ink-2);font-size:var(--text-sm,13px);margin-top:2px}`;
  function render(el, ex, ctx) {
    const U = T0.exu; U.css('exlr-css', CSS); const E = U.el;
    const d = ex.data || {};
    const fig = (typeof d.figure_ref === 'string' && T0.find('figure', d.figure_ref)) || (typeof ex.figure === 'object' && ex.figure) || (typeof ex.figure === 'string' && T0.find('figure', ex.figure)) || {};
    const pts = (fig.points || d.labels || []).map((p) => ({ x: +p.x, y: +p.y, name: p.name || p.text, desc: p.desc }));
    const st = U.store(ctx, ex);
    let open = Object.assign({}, st.get({}));
    if (T0.t(fig.intro)) el.append(E('p', { class: 'exc-qt', text: T0.t(fig.intro) }));
    el.append(E('p', { class: 'exc-hint', text: U.s('exc_reveal_hint') }));
    const box = E('div', { class: 'exlr-fig' });
    const img = U.imgOrPage(fig.src, fig.page ? { page: fig.page, box: fig.box, volume: fig.volume } : null, { alt: T0.t(fig.caption) });
    if (img) box.append(img);
    const marks = pts.map((p, i) => {
      const m = E('button', { type: 'button', class: 'exlr-m', 'aria-expanded': 'false', style: { left: p.x + '%', top: p.y + '%' } }, E('span', { text: String(i + 1) }));
      m.onclick = () => toggle(i);
      box.append(m); return m;
    });
    if (img) el.append(box);
    const list = E('ol', { class: 'exlr-l' });
    const rows = pts.map((p, i) => {
      const b = E('button', { type: 'button', 'aria-expanded': 'false' });
      b.onclick = () => toggle(i);
      list.append(E('li', null, b)); return b;
    });
    el.append(list);
    const all = E('button', { type: 'button', class: 't0-btn' });
    all.onclick = () => { const show = pts.some((p, i) => !open[i]); pts.forEach((p, i) => { open[i] = show; }); st.set(open); paint(); };
    el.append(all);
    function toggle(i) { open[i] = !open[i]; st.set(open); paint(); }
    function paint() {
      pts.forEach((p, i) => {
        const on = !!open[i];
        marks[i].setAttribute('aria-expanded', String(on));
        marks[i].setAttribute('aria-label', (i + 1) + (on ? ': ' + T0.t(p.name) : ''));
        marks[i].querySelector('span').textContent = String(i + 1);
        rows[i].setAttribute('aria-expanded', String(on));
        rows[i].innerHTML = '';
        rows[i].append(E('b', { text: (i + 1) + '.' }), on ? E('span', null, T0.t(p.name), T0.t(p.desc) ? E('small', { text: T0.t(p.desc) }) : null) : E('span', { class: 'q', text: '? ? ?' }));
      });
      all.textContent = pts.some((p, i) => !open[i]) ? U.s('exc_show_all') : U.s('exc_hide_all');
    }
    paint();
    return {
      noCheck: true,
      check() {
        const n = pts.filter((p, i) => open[i]).length;
        return n ? { ok: null, feedback: `${U.s('exc_revealed')}: ${n}/${pts.length}` } : { empty: true, feedback: U.s('exc_reveal_hint') };
      },
      reset() { open = {}; st.set(null); paint(); },
      _open(i) { toggle(i); },
    };
  }
  T0.registerEx('ex.label_reveal', { render });
})();
