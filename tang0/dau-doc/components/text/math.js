/* components/text/math.js — agent B, đề xuất 012. Ký pháp toán nội dòng của tầng 0.
 *
 * Ký pháp (đã ghi ở $defs/i18n của schema): {tử/mẫu} -> phân số dựng đứng. Mã gốc: hàm M() của matematika5
 *   /\{([^\/{}]+)\/([^\/{}]+)\}/  (chỉ một dấu '/', không lồng ngoặc). Ví dụ: "{2/3}", "{m/M}", "{1 C/1 s}".
 *
 * API (T0.math):
 *   has(s)            -> bool   chuỗi có ký pháp không
 *   html(s)           -> HTML   thoát ký tự + dựng phân số (dùng thay esc() khi ghép innerHTML)
 *   fromEscaped(h)    -> HTML   dựng phân số trên HTML đã thoát sẵn (blocks.js md())
 *   frag(s)           -> DocumentFragment (dùng thay textContent)
 *   plain(s)          -> chuỗi  "{2/3}" -> "2/3" (aria-label, title, <option>, SVG <text>, giọng đọc)
 *   apply(root)       -> số chỗ đã dựng trong cây DOM (bỏ qua input/textarea/pre/code/script/style/[contenteditable]/.t0-nomath)
 *   observe(root?)    tự dựng mọi chữ được thêm vào trang (MutationObserver) — để MỌI chế độ/renderer
 *                     (trang dịch, bài tập, cảnh, gia sư) hiện đúng mà không phải sửa từng file. Bật sẵn khi nạp.
 *   rule(ex)          -> quy tắc chấm hiệu lực của bài (ý/bài/grading_defaults)
 *   typeHint(ex)      -> phần tử dòng hướng dẫn gõ (book.ui_strings.type) hoặc null — khi rule = accept_v2_math
 *                     và bài có ô gõ. Core/renderer có thể gọi trực tiếp; nếu không, observe() tự chèn vào .t0-ex.
 */
(function () {
  const T0 = window.T0 = window.T0 || {};
  const RE = /\{([^\/{}\n]+)\/([^\/{}\n]+)\}/g;
  const TEST = /\{[^\/{}\n]+\/[^\/{}\n]+\}/;
  const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'PRE', 'CODE', 'NOSCRIPT', 'TEMPLATE', 'SELECT', 'OPTION', 'TITLE']);
  const ATTRS = ['title', 'aria-label', 'placeholder', 'alt'];

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const has = (s) => typeof s === 'string' && s.indexOf('{') >= 0 && TEST.test(s);
  const plain = (s) => String(s == null ? '' : s).replace(RE, (m, a, b) => a.trim() + '/' + b.trim());
  const frHtml = (a, b, label) => `<span class="t0-fr" role="img" aria-label="${label}"><span class="t0-fr-n" aria-hidden="true">${a.trim()}</span><span class="t0-fr-d" aria-hidden="true">${b.trim()}</span></span>`;
  const fromEscaped = (h) => String(h == null ? '' : h).replace(RE, (m, a, b) => frHtml(a, b, a.trim() + '/' + b.trim()));
  const html = (s) => fromEscaped(esc(s));

  function frag(s) {
    const f = document.createDocumentFragment();
    const str = String(s == null ? '' : s);
    let last = 0;
    str.replace(RE, (m, a, b, off) => {
      if (off > last) f.append(document.createTextNode(str.slice(last, off)));
      const sp = document.createElement('span');
      sp.className = 't0-fr'; sp.setAttribute('role', 'img'); sp.setAttribute('aria-label', a.trim() + '/' + b.trim());
      const n = document.createElement('span'); n.className = 't0-fr-n'; n.setAttribute('aria-hidden', 'true'); n.textContent = a.trim();
      const d = document.createElement('span'); d.className = 't0-fr-d'; d.setAttribute('aria-hidden', 'true'); d.textContent = b.trim();
      sp.append(n, d); f.append(sp);
      last = off + m.length;
      return m;
    });
    if (last < str.length) f.append(document.createTextNode(str.slice(last)));
    return f;
  }

  function skipEl(e) {
    for (let p = e; p && p.nodeType === 1; p = p.parentNode) {
      if (SKIP.has(p.nodeName) || p.isContentEditable || (p.classList && (p.classList.contains('t0-nomath') || p.classList.contains('t0-fr')))) return true;
    }
    return false;
  }
  function inSvg(e) { return !!(e && e.closest && e.closest('svg')); }

  function fixText(node) {
    if (!node.parentNode || !has(node.data)) return 0;
    const par = node.parentNode;
    if (par.nodeType !== 1) return 0;
    if (par.nodeName === 'OPTION' || par.nodeName === 'TITLE' || inSvg(par)) { node.data = plain(node.data); return 1; }
    if (skipEl(par)) return 0;
    par.replaceChild(frag(node.data), node);
    return 1;
  }
  function fixAttrs(e) {
    for (const a of ATTRS) { const v = e.getAttribute && e.getAttribute(a); if (v && has(v)) e.setAttribute(a, plain(v)); }
  }
  function apply(root) {
    if (!root) return 0;
    let n = 0;
    if (root.nodeType === 3) return fixText(root);
    if (root.nodeType !== 1 && root.nodeType !== 11) return 0;
    if (root.querySelectorAll) root.querySelectorAll('option').forEach((o) => { if (has(o.textContent)) o.textContent = plain(o.textContent); });
    if (root.nodeName === 'OPTION' && has(root.textContent)) root.textContent = plain(root.textContent);
    if (root.nodeType === 1) { fixAttrs(root); if (skipEl(root) && !inSvg(root)) return 0; }
    if (root.querySelectorAll) root.querySelectorAll('[title],[aria-label],[placeholder],[alt]').forEach(fixAttrs);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (t) => (t.data.indexOf('{') >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT) });
    const list = [];
    while (w.nextNode()) list.push(w.currentNode);
    list.forEach((t) => { n += fixText(t); });
    return n;
  }

  /* ---------- dòng hướng dẫn gõ (DT5) ---------- */
  function rule(ex) {
    if (!ex) return null;
    const g = (x) => (x && (typeof x.grading === 'string' ? x.grading : x.grading && x.grading.rule)) || null;
    let r = g(ex);
    if (!r && Array.isArray(ex.items)) for (const it of ex.items) { r = g(it); if (r && r !== 'giao_vien_review') break; }
    if (!r || r === 'giao_vien_review') r = ((T0.book && T0.book.grading_defaults) || {}).short_answer_rule || null;
    return (T0.grade && T0.grade.rule) ? T0.grade.rule(r) : r;
  }
  const TYPE_INPUT = 'input[type="text"],input:not([type]),input[type="number"],input[inputmode]';
  function hintText() {
    const u = (T0.book && T0.book.ui_strings) || {};
    return u.type ? (T0.t ? T0.t(u.type) : u.type.uz) : '';
  }
  function typeHint(ex, host) {
    if (rule(ex) !== 'accept_v2_math') return null;
    if (host && !host.querySelector(TYPE_INPUT)) return null;
    const s = hintText();
    if (!s) return null;
    const p = document.createElement('p');
    p.className = 't0-typehint';
    p.innerHTML = '<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><rect x="2" y="5" width="16" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5 8h1M8 8h1M11 8h1M14 8h1M6 12h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
    p.append(document.createTextNode(s));
    return p;
  }
  function autoHint(exEl) {
    if (!exEl || exEl.querySelector(':scope > .t0-typehint') || !T0.find) return;
    const ex = exEl.dataset.ex ? T0.find('exercise', exEl.dataset.ex) : null;
    const p = typeHint(ex, exEl);
    if (!p) return;
    const head = exEl.querySelector(':scope > .t0-ex-head');
    if (head) head.after(p); else exEl.prepend(p);
  }
  function refreshHints() {
    const s = hintText();
    document.querySelectorAll('.t0-typehint').forEach((p) => { const t = [...p.childNodes].find((n) => n.nodeType === 3); if (t) t.data = s; });
  }

  /* ---------- tự dựng khi DOM đổi ---------- */
  let mo = null;
  function onMut(recs) {
    const exs = new Set();
    for (const r of recs) {
      if (r.type === 'characterData') { if (r.target.nodeType === 3) fixText(r.target); continue; }
      if (r.type === 'attributes') { if (r.target.nodeType === 1) fixAttrs(r.target); continue; }
      r.addedNodes.forEach((n) => {
        if (!n.isConnected) return;
        apply(n);
        if (n.nodeType === 1) {
          if (n.classList.contains('t0-ex')) exs.add(n);
          n.querySelectorAll && n.querySelectorAll('.t0-ex').forEach((e) => exs.add(e));
          const up = n.closest && n.closest('.t0-ex'); if (up) exs.add(up);
        }
      });
    }
    exs.forEach(autoHint);
  }
  function observe(root) {
    root = root || document.body;
    if (!root) return;
    if (mo) mo.disconnect();
    apply(root);
    root.querySelectorAll('.t0-ex').forEach(autoHint);
    mo = new MutationObserver(onMut);
    mo.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }

  const CSS = `
.t0-fr{display:inline-flex;flex-direction:column;align-items:stretch;vertical-align:middle;text-align:center;font-size:.86em;line-height:1.15;margin:0 .12em;white-space:nowrap}
.t0-fr-n{border-bottom:max(1px,.07em) solid currentColor;padding:0 .18em .04em}
.t0-fr-d{padding:.04em .18em 0}
.t0-typehint{display:flex;align-items:center;gap:6px;margin:0;padding:6px 10px;border-radius:var(--radius-sm,6px);background:var(--color-surface-2);color:var(--color-ink-2);font-size:var(--text-sm,13px);line-height:1.35}
.t0-typehint svg{flex:none}`;
  function css() { if (!document.getElementById('t0-math-css')) { const s = document.createElement('style'); s.id = 't0-math-css'; s.textContent = CSS; document.head.append(s); } }

  T0.math = { RE, has, html, fromEscaped, frag, plain, apply, observe, rule, typeHint, autoHint, stop() { mo && mo.disconnect(); mo = null; } };
  css();
  const start = () => { css(); observe(document.body); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
  if (T0.on) T0.on('t0:lang', refreshHints); else document.addEventListener('t0:lang', refreshHints);
})();
