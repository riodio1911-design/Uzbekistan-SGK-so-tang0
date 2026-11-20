/* T0.simKit – bộ vẽ SVG dùng chung cho mô phỏng Hóa – Lý (agent E, đợt 1, đề xuất 004).
 * Viết lại từ thư viện cũ window.__DRAW (fix/kimyo8 = fix/fizika8): giữ logic vẽ theo thời gian t,
 * tách chữ/số liệu ra params (D2 M5). Mỗi kind là một file riêng (chem_reaction.js, circuit.js…),
 * gọi T0.simKit LÚC MOUNT nên thứ tự nạp file không quan trọng.
 *
 *  K.scene(el, params, draw(t, K) -> chuỗi SVG bên trong khung 960×540, opts?) -> {unmount()}
 *     – rAF ~30 khung/giây, dừng khi khuất màn hình (IntersectionObserver) hoặc tab ẩn;
 *     – prefers-reduced-motion: vẽ một lần ở trạng thái cuối (t = opts.tEnd || 9);
 *     – title/note của params hiện dưới dạng chữ HTML (đọc được trên điện thoại), không vẽ trong SVG;
 *     – bấm vào hình: phát lại từ đầu; đổi ngôn ngữ: vẽ lại ngay.
 *  K.txt, K.TL (nhãn song ngữ: gốc + bản dịch theo T0.tl – L, đối đẳng), K.atom, K.board, K.pretty, K.parseF, K.parseEq,
 *  K.counts, K.balance(eq), K.geom(f), K.bondsOf(g), K.shells(el), K.Z, K.col, K.RAD, K.cl/seg/ez/lerp. */
(function () {
  const T0 = window.T0;
  if (!T0) return;
  const CSS = `
.t0hl{margin:0;display:flex;flex-direction:column;gap:var(--space-2,8px);color:var(--color-ink)}
.t0hl-svg{display:block;width:100%;height:auto;aspect-ratio:16/9;border-radius:var(--radius-md,10px);background:#F4F8FC;cursor:pointer;touch-action:manipulation}
.t0hl-cap{display:flex;flex-direction:column;gap:2px;font-size:var(--text-ui,15px);line-height:1.35}
.t0hl-cap b{font-family:var(--font-display);font-size:var(--text-body,16px)}
.t0hl-cap>span{color:var(--color-ink-2)}
.t0hl-cap b .t0-bi-sub{font-family:var(--font-body);font-weight:600}
.sp-stage .t0hl{color:#fff}.sp-stage .t0hl-cap>span,.sp-stage .t0hl-cap .t0-bi-sub{color:#cfd8e0}`;
  function css() { if (!document.getElementById('t0hl-css')) document.head.append(Object.assign(document.createElement('style'), { id: 't0hl-css', textContent: CSS })); }

  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const seg = (t, a, b) => cl((t - a) / (b - a));
  const ez = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
  const lerp = (a, b, p) => a + (b - a) * p;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '+': '⁺', '-': '⁻' };
  const pretty = (f) => String(f)
    .replace(/\^([0-9]*[+-])/g, (m, a) => [...a].map((c) => SUP[c]).join(''))
    .replace(/([A-Za-z\)])(\d+)/g, (m, a, d) => a + [...d].map((c) => SUB[c]).join(''))
    .replace(/<=>/g, '⇄').replace(/->/g, '→');
  const L = (o) => (o == null ? '' : typeof o === 'string' ? o : T0.t(o));
  const txt = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 24}" font-weight="${o.fw || 700}" fill="${o.c || '#14324A'}" text-anchor="${o.a || 'middle'}" font-family="system-ui,Segoe UI,Arial,sans-serif" opacity="${o.op == null ? 1 : o.op}">${esc(s)}</text>`;
  /* nhãn đa ngữ trong hình (L07, như TL() bản cũ): dòng 1 = dòng đầu của T0.tl (gốc uz khi bật song ngữ), dòng 2 nhỏ, xám
   * = bản dịch (+ ' · ' ngôn ngữ phụ nếu ngắn). T0.dual tắt hoặc đang đọc tiếng gốc -> một dòng. */
  const TL = (x, y, o, fs = 20, c, op = 1, a = 'middle') => {
    if (!o) return '';
    if (typeof o === 'string' || !T0.tl) return txt(x, y, L(o), { fs, c, op, a });
    const ls = T0.tl(o).map((l) => l.text);
    if (!ls.length) return '';
    let s = txt(x, y, ls[0], { fs, c, op, a });
    if (ls.length > 1) {
      let r = ls[1];
      if (ls[2] && (r + ls[2]).length < 70) r += ' · ' + ls[2];
      s += txt(x, y + fs * 1.2, r, { fs: fs * 0.82, fw: 600, c: '#51636F', op, a });
    }
    return s;
  };
  /* cỡ chữ vừa bề ngang w (px trong khung 960) */
  const fit = (s, fs, w) => Math.min(fs, w / Math.max(1, String(s).length * 0.56));

  const EC = { H: ['#FFFFFF', '#B9C3CC', '#334'], C: ['#6B6B6B', '#2B2B2B', '#fff'], N: ['#6E9BFF', '#2F5BD0', '#fff'], O: ['#FF8A80', '#D2362B', '#fff'], Cl: ['#7BE07F', '#2E9E3A', '#fff'], F: ['#C5F27A', '#7CB342', '#234'], Br: ['#C2614A', '#7A2A1B', '#fff'], I: ['#B388FF', '#6A1B9A', '#fff'], S: ['#FFE066', '#C9A100', '#433'], P: ['#FFB74D', '#E65100', '#fff'], Na: ['#CE93D8', '#8E24AA', '#fff'], K: ['#B39DDB', '#5E35B1', '#fff'], Li: ['#E1BEE7', '#9C27B0', '#fff'], Ca: ['#E3E3E3', '#9A9A9A', '#222'], Mg: ['#A5D6A7', '#388E3C', '#fff'], Al: ['#CFD8DC', '#78909C', '#222'], Fe: ['#FFAB91', '#BF360C', '#fff'], Cu: ['#FFCC80', '#B5651D', '#fff'], Zn: ['#B0BEC5', '#546E7A', '#fff'], Ag: ['#ECEFF1', '#90A4AE', '#222'], Si: ['#F0D9B5', '#A1887F', '#222'], Mn: ['#CE93D8', '#7B1FA2', '#fff'], Ba: ['#C5E1A5', '#689F38', '#222'], Pb: ['#9E9E9E', '#424242', '#fff'], Hg: ['#E0E0E0', '#757575', '#222'], Cr: ['#80CBC4', '#00796B', '#fff'], Ni: ['#A5D6A7', '#2E7D32', '#fff'], V: ['#B0BEC5', '#455A64', '#fff'], He: ['#E0F7FA', '#4DD0E1', '#234'], Ne: ['#FFE0F0', '#F06292', '#333'], Ar: ['#E1F5FE', '#29B6F6', '#234'], B: ['#FFCCBC', '#FF7043', '#333'], Be: ['#DCEDC8', '#9CCC65', '#333'], Se: ['#FFCC80', '#FB8C00', '#333'] };
  const col = (el) => EC[el] || ['#E0E0E0', '#9E9E9E', '#222'];
  const HEAVY = ['Na', 'K', 'Ca', 'Ba', 'Pb', 'I', 'Br', 'Fe', 'Cu', 'Zn', 'Ag', 'Hg', 'Mn', 'Cr'];
  const RAD = (el) => (el === 'H' ? 15 : HEAVY.includes(el) ? 27 : 22);
  const defs = () => `<defs>${Object.keys(EC).map((el) => { const c = col(el); return `<radialGradient id="ag${el}" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></radialGradient>`; }).join('')}<radialGradient id="aglow" r="50%"><stop offset="0" stop-color="#FFE27A" stop-opacity=".95"/><stop offset="1" stop-color="#FFE27A" stop-opacity="0"/></radialGradient></defs>`;
  const atom = (x, y, el, r, op = 1, lab = true) => { r = r || RAD(el); const g = EC[el] ? el : 'Ca'; return `<g opacity="${op}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="url(#ag${g})" stroke="#1E2B38" stroke-opacity=".25"/>${lab ? txt(x, y + r * 0.36, el, { fs: Math.max(10, r * (el.length > 1 ? 0.8 : 0.95)), c: col(el)[2] }) : ''}</g>`; };
  const board = (inner, bg = '#F4F8FC') => `${defs()}<rect width="960" height="540" rx="18" fill="${bg}"/>${inner}`;

  /* ---------- công thức ---------- */
  function parseF(f) {
    f = String(f).replace(/\((s|l|g|aq|k|q|eritma)\)/gi, '').replace(/[↑↓]/g, '').replace(/\^.*$/, '')
      .replace(/[₀-₉]/g, (c) => String(c.charCodeAt(0) - 0x2080)).trim();
    let i = 0;
    const grp = () => {
      const c = {};
      while (i < f.length && f[i] !== ')') {
        if (f[i] === '(') { i++; const g = grp(); i++; let d = ''; while (/\d/.test(f[i] || '')) d += f[i++]; const m = +(d || 1); for (const k in g) c[k] = (c[k] || 0) + g[k] * m; }
        else if (/[A-Z]/.test(f[i])) { let el = f[i++]; while (/[a-z]/.test(f[i] || '')) el += f[i++]; let d = ''; while (/\d/.test(f[i] || '')) d += f[i++]; c[el] = (c[el] || 0) + +(d || 1); }
        else i++;
      }
      return c;
    };
    return grp();
  }
  function parseEq(eq) {
    const rev = /⇄|<=>/.test(eq);
    const [l, r] = String(eq).split(/<=>|->|→|⇄|=/).map((s) => (s || '').trim());
    const side = (s) => s.split(/\s\+\s/).filter(Boolean).map((x) => { x = x.trim(); const m = /^(\d*)\s*(.+)$/.exec(x); return { k: +(m[1] || 1), f: m[2] }; });
    return { L: side(l), R: side(r || ''), rev };
  }
  function counts(side) { const c = {}; side.forEach((t) => { const g = parseF(t.f); for (const k in g) c[k] = (c[k] || 0) + g[k] * t.k; }); return c; }
  /* '' nếu cân bằng, ngược lại 'X: a ≠ b' */
  function balance(eq) { const e = parseEq(eq), a = counts(e.L), b = counts(e.R); for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) if ((a[k] || 0) !== (b[k] || 0)) return k + ': ' + (a[k] || 0) + ' ≠ ' + (b[k] || 0); return ''; }

  /* hình học phân tử (đơn vị ~ độ dài liên kết) */
  const TET = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map((v) => v.map((x) => x / Math.sqrt(3)));
  const tri = (el, r, y) => [0, 1, 2].map((k) => { const th = (k * 2 * Math.PI) / 3 + Math.PI / 2; return [el, r * Math.cos(th), y, r * Math.sin(th)]; });
  const PRE = {
    H2: [['H', -0.45, 0, 0], ['H', 0.45, 0, 0]], O2: [['O', -0.55, 0, 0], ['O', 0.55, 0, 0]], N2: [['N', -0.55, 0, 0], ['N', 0.55, 0, 0]], Cl2: [['Cl', -0.65, 0, 0], ['Cl', 0.65, 0, 0]], F2: [['F', -0.55, 0, 0], ['F', 0.55, 0, 0]], Br2: [['Br', -0.7, 0, 0], ['Br', 0.7, 0, 0]], I2: [['I', -0.75, 0, 0], ['I', 0.75, 0, 0]],
    HCl: [['H', -0.55, 0, 0], ['Cl', 0.5, 0, 0]], HF: [['H', -0.5, 0, 0], ['F', 0.45, 0, 0]], HBr: [['H', -0.6, 0, 0], ['Br', 0.55, 0, 0]], HI: [['H', -0.6, 0, 0], ['I', 0.6, 0, 0]], CO: [['C', -0.55, 0, 0], ['O', 0.55, 0, 0]], NO: [['N', -0.55, 0, 0], ['O', 0.55, 0, 0]],
    H2O: [['O', 0, 0.18, 0], ['H', -0.78, -0.42, 0], ['H', 0.78, -0.42, 0]], H2S: [['S', 0, 0.2, 0], ['H', -0.85, -0.5, 0], ['H', 0.85, -0.5, 0]],
    CO2: [['C', 0, 0, 0], ['O', -1.1, 0, 0], ['O', 1.1, 0, 0]], SO2: [['S', 0, 0.25, 0], ['O', -1.05, -0.4, 0], ['O', 1.05, -0.4, 0]], NO2: [['N', 0, 0.25, 0], ['O', -1, -0.4, 0], ['O', 1, -0.4, 0]], O3: [['O', 0, 0.25, 0], ['O', -1, -0.4, 0], ['O', 1, -0.4, 0]],
    SO3: [['S', 0, 0, 0], ['O', 0, 1.15, 0], ['O', -1, -0.58, 0], ['O', 1, -0.58, 0]],
    NH3: [['N', 0, 0.3, 0]].concat(tri('H', 0.94, -0.32)), PH3: [['P', 0, 0.3, 0]].concat(tri('H', 1.05, -0.35)),
    CH4: [['C', 0, 0, 0]].concat(TET.map((v) => ['H', v[0], v[1], v[2]])), SiH4: [['Si', 0, 0, 0]].concat(TET.map((v) => ['H', v[0] * 1.2, v[1] * 1.2, v[2] * 1.2])),
    H2O2: [['O', -0.6, 0, 0], ['O', 0.6, 0, 0], ['H', -1.1, 0.75, 0.3], ['H', 1.1, -0.75, 0.3]],
    HNO3: [['N', 0, 0, 0], ['O', 0, 1.1, 0], ['O', -0.95, -0.55, 0], ['O', 0.95, -0.55, 0], ['H', 1.75, -0.1, 0]],
    NH4: [['N', 0, 0, 0]].concat(TET.map((v) => ['H', v[0], v[1], v[2]])), CCl4: [['C', 0, 0, 0]].concat(TET.map((v) => ['Cl', v[0] * 1.3, v[1] * 1.3, v[2] * 1.3])),
  };
  PRE.H2SO4 = [['S', 0, 0, 0]].concat(TET.map((v) => ['O', v[0] * 1.25, v[1] * 1.25, v[2] * 1.25]), [['H', TET[0][0] * 2, TET[0][1] * 2, TET[0][2] * 2], ['H', TET[2][0] * 2, TET[2][1] * 2, TET[2][2] * 2]]);
  function geom(f) {
    const key = String(f).replace(/\((s|l|g|aq)\)/g, '').replace(/[↑↓]/g, '').replace(/\^.*$/, '').trim();
    if (PRE[key]) return PRE[key].map((a) => ({ el: a[0], x: a[1], y: a[2], z: a[3] }));
    const c = parseF(key), els = [];
    for (const k in c) for (let j = 0; j < c[k]; j++) els.push(k);
    if (els.length <= 1) return els.map((el) => ({ el, x: 0, y: 0, z: 0 }));
    /* nguyên tử trung tâm: nguyên tố khác H/O có số lượng ít nhất */
    const heavy = Object.keys(c).filter((k) => k !== 'H' && k !== 'O');
    let center = els.findIndex((e) => e !== 'H' && e !== 'O' && c[e] === Math.min(...heavy.map((k) => c[k])));
    if (center < 0) center = 0;
    const out = [{ el: els[center], x: 0, y: 0, z: 0 }], rest = els.filter((e, j) => j !== center), n = rest.length;
    rest.forEach((e, j) => { const ring = n > 8 && j >= 6 ? 1.9 : 1.05, m = n > 8 ? (j < 6 ? 6 : n - 6) : n, jj = n > 8 && j >= 6 ? j - 6 : j, a = (jj / m) * 2 * Math.PI + (ring > 1.5 ? 0.4 : 0); out.push({ el: e, x: Math.cos(a) * ring * 1.05, y: Math.sin(a) * ring * 0.95, z: 0 }); });
    return out;
  }
  const bondsOf = (g) => { const b = []; for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) { const d = Math.hypot(g[i].x - g[j].x, g[i].y - g[j].y, g[i].z - g[j].z); if (d < 1.35 && !(g[i].el === 'H' && g[j].el === 'H' && g.length > 2)) b.push([i, j]); } return b; };

  /* ---------- lớp electron ---------- */
  const Z = { H: 1, He: 2, Li: 3, Be: 4, B: 5, C: 6, N: 7, O: 8, F: 9, Ne: 10, Na: 11, Mg: 12, Al: 13, Si: 14, P: 15, S: 16, Cl: 17, Ar: 18, K: 19, Ca: 20, Sc: 21, Ti: 22, V: 23, Cr: 24, Mn: 25, Fe: 26, Co: 27, Ni: 28, Cu: 29, Zn: 30, Ga: 31, Ge: 32, As: 33, Se: 34, Br: 35, Kr: 36 };
  const SH = { Cr: [2, 8, 13, 1], Cu: [2, 8, 18, 1] };
  const shells = (el) => { if (SH[el]) return SH[el]; const z = Z[el]; if (!z) return null; if (z <= 20) { const r = []; let left = z; for (const cap of [2, 8, 8, 2]) { if (left <= 0) break; r.push(Math.min(cap, left)); left -= cap; } return r; } if (z <= 30) return [2, 8, 8 + (z - 20), 2]; return [2, 8, 18, z - 28]; };

  /* ---------- khung cảnh + vòng hoạt hình ---------- */
  let uidN = 0;
  const reduced = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
  function scene(el, params, draw, opts = {}) {
    css();
    params = params || {};
    const E = T0.ui.el;
    const uid = 'h' + (++uidN) + '_';
    const fig = E('figure', { class: 't0hl', 'data-kind': opts.kind || '' });
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 960 540');
    svg.setAttribute('class', 't0hl-svg');
    svg.setAttribute('role', 'img');
    const cap = E('figcaption', { class: 't0hl-cap' });
    fig.append(svg, cap);
    el.append(fig);
    let t0 = performance.now(), raf = 0, last = -1, visible = true, dead = false;
    const tEnd = opts.tEnd || 9;
    const prefix = (s) => s.replace(/id="([^"]+)"/g, `id="${uid}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${uid}$1)`);
    function paint(t) {
      let s = '';
      try { s = draw(t, K); } catch (e) { console.error(e); s = board(txt(480, 280, '⚠ ' + (opts.kind || ''), { fs: 28, c: '#B3261E' })); dead = true; }
      svg.innerHTML = prefix(s);
    }
    function caption() {
      cap.innerHTML = '';
      const ti = L(params.title), no = L(params.note);
      svg.setAttribute('aria-label', [ti, no].filter(Boolean).join('. ') || (opts.label ? L(opts.label) : (opts.kind || '')));
      // chú thích song ngữ (L07): dòng gốc + bản dịch như nhãn TL() bản cũ
      const bi = (o, tag) => (T0.ui.bi && typeof o === 'object' ? T0.ui.bi(o, { tag, lineTag: 'span', tags: false }) : E(tag, { text: L(o) }));
      if (ti) cap.append(bi(params.title, 'b'));
      if (no) cap.append(bi(params.note, 'span'));
      cap.hidden = !ti && !no;
    }
    function frame(now) {
      raf = 0;
      if (dead || !fig.isConnected) return;
      if (now - last >= 33) { last = now; paint((now - t0) / 1000); }
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    }
    const start = () => { if (!raf && !reduced() && !dead) raf = requestAnimationFrame(frame); };
    caption();
    if (reduced()) paint(tEnd); else { paint(0); start(); }
    const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => { visible = es.some((x) => x.isIntersecting); if (visible) start(); }) : null;
    if (io) io.observe(fig);
    const onVis = () => { if (!document.hidden) start(); };
    document.addEventListener('visibilitychange', onVis);
    svg.addEventListener('click', () => { t0 = performance.now(); dead = false; if (reduced()) paint(tEnd); else start(); });
    const off = T0.on('t0:lang', () => { caption(); paint(reduced() ? tEnd : (performance.now() - t0) / 1000); });
    return {
      el: fig,
      unmount() { dead = true; if (raf) cancelAnimationFrame(raf); io && io.disconnect(); document.removeEventListener('visibilitychange', onVis); off(); fig.remove(); },
      /* để kiểm tra tự động */
      seek(t) { t0 = performance.now() - t * 1000; paint(t); },
    };
  }
  /* đăng ký gọn: T0.simKit.reg('sim.x', draw, opts) */
  function reg(id, draw, opts = {}) {
    T0.registerSim(id, { mount(el, params, ctx) { return scene(el, params, (t, k) => draw(t, params || {}, k), Object.assign({ kind: id }, opts)); } });
  }

  const K = (T0.simKit = { cl, seg, ez, lerp, esc, SUB, SUP, pretty, L, txt, TL, fit, EC, col, RAD, atom, board, defs, parseF, parseEq, counts, balance, TET, PRE, geom, bondsOf, Z, shells, scene, reg });
})();
