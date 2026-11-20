/* sim.screen_demo – mô phỏng thao tác phần mềm (agent E, đề xuất 006; gốc "Screen-demo player" của informatika5).
 * params: {stage: tên preset (window.T0_SIM_PRESETS['sim.screen_demo'], nguồn thu-vien/mo-phong/presets/screen_demo.json)
 *          | stage_def?: {bg?, els[]} mẫu riêng của cuốn | stage_template_ref (cũ, '…#<tên>') ,
 *          init?: [bước chạy tức thì], add?: [phần tử thêm], blocks?: [khối Scratch {id,l,c}],
 *          steps: [{a, t?: {uz,ru,vi} phụ đề, audio_ref?: 'd<n>-s<k>', …}]}.
 * a ∈ move click dbl rclick type key show hide set cls drag draw undraw chart sprite dragblock mouse wait.
 * Thuyết minh: bước có t phát T0.media.play(audio_ref) (file clip nếu có, không thì giọng trình duyệt).
 * Điều khiển: về đầu, bước trước/sau (theo phụ đề), phát/dừng, bật/tắt tiếng; nút ≥ 44px. */
(function () {
  const T0 = window.T0;
  const STYLE = `
.sd{display:flex;flex-direction:column;gap:var(--space-2,8px)}
.dscr{position:relative;width:100%;aspect-ratio:16/10;background:#F3F5F8;border-radius:10px;overflow:hidden;container-type:inline-size;color:#1B2530;font:500 1.55cqw/1.2 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;border:2px solid #22303C;user-select:none}
.dscr.bg-desk{background:linear-gradient(160deg,#2F7DB8,#6FB7D8 60%,#9AD0C2)}.dscr.bg-kb{background:#E7ECF1}
.de{position:absolute;box-sizing:border-box;display:flex;align-items:center;justify-content:center;text-align:center;white-space:nowrap;overflow:hidden;transition:background .2s,box-shadow .2s,transform .12s}
.de[hidden]{display:none}
.de.k-win{font-size:1.5cqw;background:#22303C;color:#fff;justify-content:flex-start;padding-left:16cqw;font-weight:700}
.de.k-btn{font-size:1.2cqw;background:#fff;border:.12cqw solid #B9C4CE;border-radius:.6cqw}.de.k-btn.pri{background:#0A74C0;color:#fff;border-color:#0A74C0;font-weight:700}.de.k-btn.red{background:#C9303A;color:#fff;border-color:#C9303A}
.k-win~.de.k-btn[data-id^="w_"],.k-win~.de.k-btn[data-id="b_save"],.k-win~.de.k-btn[data-id="b_undo"],.k-win~.de.k-btn[data-id="b_redo"]{background:transparent;color:#fff;border-color:transparent}
.de.k-tab{font-size:1.35cqw;background:transparent;border-bottom:.3cqw solid transparent;font-weight:600}.de.k-tab.on{border-bottom-color:#0A74C0;color:#0A5C99;background:#fff}
.de.rib{background:#fff;border-bottom:.12cqw solid #CBD5DD}.de.bar{background:#22303C}.de.pal{background:#E9EEF3;border-right:.12cqw solid #CBD5DD}.de.scr{background:#FAFBFC}
.de.paper,.de.paper2{background:#fff;box-shadow:0 .2cqw 1cqw rgba(0,0,0,.18)}.de.paper2{box-shadow:none}.de.canvas{background:#fff;border:.12cqw solid #9AA8B4;display:block}.de.desk2{background:linear-gradient(160deg,#2F7DB8,#6FB7D8);border:.5cqw solid #22303C;border-radius:1cqw}
.de.k-txt{justify-content:flex-start;text-align:left;white-space:pre-wrap;align-items:flex-start;padding:.3cqw .5cqw;font-size:1.9cqw;line-height:1.3}
.de.k-txt.h1{font-size:2.6cqw;font-weight:800}.de.k-txt.para{font-size:1.6cqw}.de.k-txt.box{border:.12cqw solid #CBD5DD;border-radius:.5cqw}.de.k-txt.link{color:#0A5CC2;text-decoration:underline}
.de.k-txt.result{font-size:1.5cqw;border-bottom:.1cqw solid #E1E7EC}.de.k-txt.mrow{font-size:1.6cqw;border-bottom:.1cqw solid #E1E7EC;background:#fff;align-items:center}
.de.k-inp{background:#fff;border:.14cqw solid #8FA0AE;border-radius:.5cqw;justify-content:flex-start;padding:0 .8cqw;font-size:1.4cqw}
.de.k-inp:empty::before{content:attr(data-ph);color:#9AA8B4}
.de.k-menu,.de.k-dlg{background:#fff;border:.14cqw solid #8FA0AE;border-radius:.7cqw;box-shadow:0 .6cqw 2cqw rgba(0,0,0,.3);z-index:5;align-items:flex-start;justify-content:flex-start;padding:.9cqw 1.2cqw;font-weight:800}
.de.k-menu.dark{background:#1F4E79;border:0;border-radius:0}.de.k-menu.dark~.de.k-mi{color:#fff}
.de.k-mi{font-size:1.4cqw;justify-content:flex-start;padding-left:1cqw;border-radius:.4cqw}
.de.k-ico{flex-direction:column;gap:.4cqw;color:#fff;font-size:1.35cqw;text-shadow:0 .1cqw .3cqw rgba(0,0,0,.6);border-radius:.6cqw}.de.k-ico::before{content:"";width:5.2cqw;height:5.2cqw;border-radius:1cqw;background:#fff linear-gradient(135deg,#FFD27A,#F28C18);box-shadow:0 .3cqw .8cqw rgba(0,0,0,.3)}
.de.k-ico[data-id$="word"]::before,.de.k-ico[data-id$="file"]::before{background:linear-gradient(135deg,#6FA8FF,#1E5FBF)}.de.k-ico[data-id$="paint"]::before,.de.k-ico[data-id$="app"]::before{background:linear-gradient(135deg,#FF9AA2,#C9303A)}.de.k-ico[data-id$="excel"]::before{background:linear-gradient(135deg,#7BD89A,#1E7A3C)}.de.k-ico[data-id$="browser"]::before{background:linear-gradient(135deg,#9AD0FF,#0A74C0)}.de.k-ico[data-id$="mail"]::before{background:linear-gradient(135deg,#D7B8FF,#6B3FB8)}.de.k-ico[data-id$="pc"]::before{background:linear-gradient(135deg,#CFD8DF,#51636F)}
.dscr:not(.bg-desk) .de.k-ico{color:#1B2530;text-shadow:none}.de.desk2~.de.k-ico{color:#fff;text-shadow:0 .1cqw .3cqw rgba(0,0,0,.6)}
.de.k-lbl{font-size:1.4cqw;color:#51636F;justify-content:flex-start}.de.k-lbl.logo{font-size:5cqw;font-weight:900;color:#0A74C0;justify-content:center}.dscr.bg-desk .de.k-lbl{color:#fff}
.de.k-cell{background:#fff;border:.08cqw solid #C3CED7;justify-content:flex-start;padding-left:.6cqw}.de.k-hd{background:#E3EAF0;border:.08cqw solid #C3CED7;font-weight:700;color:#51636F}
.de.k-key{background:#fff;border:.14cqw solid #8FA0AE;border-bottom-width:.5cqw;border-radius:.8cqw;font-weight:700;font-size:1.5cqw}
.de.bar~.de.k-tab{background:#fff;border-radius:.8cqw .8cqw 0 0;color:#14212C}.bg-kb .de.k-txt{font-size:2.6cqw}
.de.sw{border:.14cqw solid #51636F;border-radius:.3cqw}.de.cat{color:#fff;border:0;font-weight:700;justify-content:flex-start;padding-left:1cqw}
.de.flag{color:#1E9E3E;font-size:2.4cqw}.de.stopb{color:#D32F2F}.de.stg{background:#fff;border:.14cqw solid #9AA8B4;border-radius:.6cqw;display:block}
.de.chart{background:#fff;border:.14cqw solid #8FA0AE;box-shadow:0 .4cqw 1.4cqw rgba(0,0,0,.25);display:block;z-index:4}.de.img{background:linear-gradient(135deg,#CFE6F7,#9AC7E8);border-radius:.6cqw}
.de.mbody{background:#DDE3E8;border:.3cqw solid #51636F;border-radius:12cqw 12cqw 10cqw 10cqw}.de.mbtn{background:#F4F6F8;border:.3cqw solid #51636F}.de.ml{border-radius:12cqw 0 0 0}.de.mr{border-radius:0 12cqw 0 0}.de.mwheel{background:#51636F;border-radius:2cqw;z-index:2}
.de.fb{font-weight:900}.de.fi{font-style:italic;font-family:Georgia,serif}.de.fu{text-decoration:underline}.de.fc{color:#C9303A;font-weight:900}
.de.sel{background:#BFDCFF !important}.de.on{background:#D6E9FA !important;border-color:#0A74C0 !important}.de.hl{box-shadow:0 0 0 .35cqw #F28C18,0 0 1.6cqw .4cqw rgba(242,140,24,.6) !important;z-index:7}
.de.press{transform:scale(.93);background:#FFD27A !important}
.de.bold{font-weight:800}.de.italic{font-style:italic}.de.under{text-decoration:underline}.de.red{color:#C9303A}.de.blue{color:#0A5CC2}.de.green{color:#1E7A3C}.de.big{font-size:2.7cqw}.de.center{justify-content:center;text-align:center}.de.right{justify-content:flex-end;text-align:right}.de.err{text-decoration:underline wavy #C9303A}
.de .caret{display:inline-block;width:.16cqw;height:1.1em;background:#111;vertical-align:-.15em;animation:dcar 1s steps(1) infinite}@keyframes dcar{50%{opacity:0}}
.dcur{position:absolute;z-index:20;width:2.6cqw;left:0;top:0;transition:left .7s ease-in-out,top .7s ease-in-out;pointer-events:none;filter:drop-shadow(0 .15cqw .2cqw rgba(0,0,0,.5))}
.dcur.fast,.sspr.fast,.sblk.fast{transition:none}
.drip{position:absolute;z-index:19;width:5cqw;height:5cqw;margin:-2.5cqw 0 0 -2.5cqw;border-radius:50%;border:.5cqw solid #F28C18;animation:drp .6s ease-out forwards;pointer-events:none}.drip.r{border-color:#C9303A}
@keyframes drp{from{transform:scale(.2);opacity:1}to{transform:scale(1.2);opacity:0}}
.dkeys{position:absolute;left:50%;bottom:3%;transform:translateX(-50%);z-index:21;display:flex;gap:.8cqw;align-items:center;background:rgba(20,33,44,.92);color:#fff;padding:1cqw 1.6cqw;border-radius:1.2cqw;font-size:2cqw;font-weight:800}
.dkeys span{background:#fff;color:#14212C;border-radius:.7cqw;padding:.5cqw 1.2cqw;border-bottom:.45cqw solid #8FA0AE}
.dmb{position:absolute;right:2%;top:2%;z-index:21;background:rgba(20,33,44,.9);color:#fff;border-radius:1cqw;padding:.7cqw 1.2cqw;font-size:1.6cqw;font-weight:800;display:flex;gap:.8cqw;align-items:center}
.dmb i{display:inline-block;width:2.6cqw;height:3.6cqw;border:.25cqw solid #fff;border-radius:1.4cqw 1.4cqw 1.2cqw 1.2cqw;position:relative}.dmb i::after{content:"";position:absolute;top:0;width:50%;height:42%;background:#F28C18}.dmb.l i::after{left:0;border-radius:1.2cqw 0 0 0}.dmb.r i::after{right:0;border-radius:0 1.2cqw 0 0}
.sblk{position:absolute;z-index:8;color:#fff;font-weight:700;font-size:1.4cqw;padding:.7cqw 1.1cqw;border-radius:.7cqw;white-space:nowrap;transition:left .8s ease-in-out,top .8s ease-in-out;box-shadow:0 .15cqw .4cqw rgba(0,0,0,.3)}
.sspr{position:absolute;width:6cqw;height:6cqw;transition:left .9s ease-in-out,top .9s ease-in-out,transform .6s;z-index:3}
.ssay{position:absolute;background:#fff;border:.14cqw solid #51636F;border-radius:1cqw;padding:.4cqw .9cqw;font-size:1.3cqw;z-index:4;white-space:nowrap}
.sd-cap{min-height:3.2em;font-size:var(--text-body,16px);line-height:var(--lh-body,1.5);display:flex;gap:var(--space-2,8px);align-items:flex-start;margin:0}
.sd-no{flex:none;display:inline-grid;place-items:center;min-width:28px;height:28px;border-radius:14px;background:var(--pin-demo,#0E8A8A);color:#fff;font-weight:800;font-size:14px;padding:0 6px}
.sd-ctl{display:flex;gap:var(--space-2,8px);align-items:center;flex-wrap:wrap}
.sd-ctl .t0-btn{min-width:var(--touch-min,44px);min-height:var(--touch-min,44px)}
.sd-prog{flex:1 1 80px;height:6px;border-radius:3px;background:var(--color-line);overflow:hidden;min-width:60px}.sd-prog i{display:block;height:100%;width:0;background:var(--color-accent);transition:width .3s}
.sd-n{font-weight:700;font-size:var(--text-sm,14px);font-variant-numeric:tabular-nums}`;
  function css() { if (!document.getElementById('sd-css')) document.head.append(Object.assign(document.createElement('style'), { id: 'sd-css', textContent: STYLE })); }
  const Lb = {
    restart: { uz: 'Boshidan', ru: 'С начала', vi: 'Về đầu' }, prev: { uz: 'Oldingi qadam', ru: 'Предыдущий шаг', vi: 'Bước trước' }, next: { uz: 'Keyingi qadam', ru: 'Следующий шаг', vi: 'Bước sau' },
    play: { uz: 'Ijro', ru: 'Пуск', vi: 'Phát' }, pause: { uz: 'To‘xtatish', ru: 'Пауза', vi: 'Dừng' }, sound: { uz: 'Ovoz', ru: 'Звук', vi: 'Tiếng' },
    left: { uz: 'Chap', ru: 'Левая', vi: 'Trái' }, right: { uz: 'O‘ng', ru: 'Правая', vi: 'Phải' }, nostage: { uz: 'Ekran namunasi topilmadi', ru: 'Шаблон экрана не найден', vi: 'Không tìm thấy mẫu màn hình' },
  };
  const COL = { events: '#C99700', motion: '#3D74D9', looks: '#7A52D6', sound: '#B845B8', control: '#D98A00', sensing: '#2C96C2', pen: '#0E9A6C', operators: '#3F9E3F', variables: '#D9741A' };
  const CUR = '<svg viewBox="0 0 24 30"><path d="M3 2v22l5.5-5 3.6 8.6 3.3-1.4-3.6-8.5H19z" fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  const SPRITE = '<svg viewBox="0 0 40 40"><rect x="8" y="10" width="22" height="20" rx="6" fill="#0E8A8A"/><path d="M30 14l8 6-8 6z" fill="#F28C18"/><circle cx="15" cy="17" r="2.4" fill="#fff"/><circle cx="23" cy="17" r="2.4" fill="#fff"/><rect x="13" y="23" width="12" height="2.4" rx="1.2" fill="#fff"/><path d="M19 10V5" stroke="#0E8A8A" stroke-width="2"/><circle cx="19" cy="4" r="2" fill="#F28C18"/></svg>';
  const PAL = ['#0A74C0', '#F28C18', '#2A8040', '#C9303A', '#6B3FB8', '#0E8A8A', '#C99700'];
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const tx = (x) => (x == null ? '' : typeof x === 'string' ? x : T0.t(x));
  const KEYNAME = (k) => ({ ' ': 'Space' }[k] || k);

  /* mẫu stage: stage_def > preset theo tên > stage_template_ref cũ ('…#tên') */
  function stageOf(p) {
    if (p.stage_def && p.stage_def.els) return p.stage_def;
    const pre = (window.T0_SIM_PRESETS || {})['sim.screen_demo'] || {};
    const name = p.stage || (p.stage_template_ref ? String(p.stage_template_ref).split('#').pop() : '');
    return pre[name] || null;
  }

  function engine(scr, D, S) {
    let sleepers = [];
    const sleep = (ms) => new Promise((r) => { const id = setTimeout(r, ms); sleepers.push(id); });
    const $ = (id) => scr.querySelector('[data-id="' + CSS.escape(String(id)) + '"]');
    const grp = (g, show) => scr.querySelectorAll(`[data-g="${CSS.escape(g)}"]`).forEach((e) => (e.hidden = !show));
    function build() {
      scr.className = 'dscr' + (S.bg ? ' bg-' + S.bg : '');
      scr.innerHTML = '';
      const els = S.els.concat(D.add || []);
      const pop = new Set(els.filter((e) => e.g && (e.k === 'dlg' || e.k === 'menu')).map((e) => e.g));
      els.forEach((e) => {
        const d = document.createElement('div');
        d.className = 'de k-' + (e.k || 'btn') + (e.c ? ' ' + e.c : '');
        d.dataset.id = e.id;
        if (e.g) { d.dataset.g = e.g; d.hidden = true; }
        if (e.ph) d.dataset.ph = tx(e.ph);
        Object.assign(d.style, { left: e.x + '%', top: e.y + '%', width: e.w + '%', height: e.h + '%' });
        if (e.col) d.style.background = e.col;
        const z = e.g ? (pop.has(e.g) ? (e.k === 'dlg' || e.k === 'menu' ? 10 : 11) : 2) : 0;
        if (z) d.style.zIndex = z;
        d.textContent = tx(e.l);
        scr.append(d);
      });
      const cur = document.createElement('div'); cur.className = 'dcur fast'; cur.dataset.id = '__cur'; cur.innerHTML = CUR; cur.style.left = '50%'; cur.style.top = '55%'; scr.append(cur);
      const cv = $('canvas');
      if (cv) cv.innerHTML = '<svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%" data-svg="1"></svg>';
      {
        (D.blocks || []).forEach((b, i) => { const el = document.createElement('div'); el.className = 'sblk'; el.dataset.id = b.id; el.textContent = tx(b.l); el.style.background = COL[b.c] || '#3D74D9'; el.style.left = '15%'; el.style.top = 14 + i * 7.4 + '%'; el.dataset.home = 14 + i * 7.4; scr.append(el); });
        if ($('stage') || D.stage === 'scratch') { const sp = document.createElement('div'); sp.className = 'sspr'; sp.dataset.id = 'sprite'; sp.innerHTML = SPRITE; Object.assign(sp.dataset, { x: 0, y: 0, r: 0 }); sp.style.left = '80%'; sp.style.top = '29%'; scr.append(sp); }
      }
    }
    function center(to) {
      if (Array.isArray(to)) return to;
      if (typeof to === 'string' && to.startsWith('canvas:')) { const [x, y] = to.slice(7).split(',').map(Number), c = $('canvas'); if (!c) return [50, 50]; return [parseFloat(c.style.left) + (x / 100) * parseFloat(c.style.width), parseFloat(c.style.top) + (y / 100) * parseFloat(c.style.height)]; }
      const el = $(to); if (!el || el.hidden) { if (el) { const x = parseFloat(el.style.left), y = parseFloat(el.style.top); return [x + parseFloat(el.style.width) / 2, y + parseFloat(el.style.height) * 0.55]; } return [50, 50]; }
      const r = el.getBoundingClientRect(), s = scr.getBoundingClientRect();
      if (!s.width) return [parseFloat(el.style.left) + parseFloat(el.style.width) / 2, parseFloat(el.style.top) + parseFloat(el.style.height) * 0.55];
      return [((r.left + r.width * 0.5 - s.left) / s.width) * 100, ((r.top + r.height * 0.55 - s.top) / s.height) * 100];
    }
    async function moveTo(to, inst) { const c = $('__cur'), p = center(to); c.classList.toggle('fast', !!inst); c.style.left = p[0] + '%'; c.style.top = p[1] + '%'; if (!inst) await sleep(760); return p; }
    function ripple(p, right) {
      const r = document.createElement('div'); r.className = 'drip' + (right ? ' r' : ''); r.style.left = p[0] + '%'; r.style.top = p[1] + '%'; scr.append(r); setTimeout(() => r.remove(), 650);
      const m = document.createElement('div'); m.className = 'dmb ' + (right ? 'r' : 'l'); m.append(document.createElement('i'), document.createTextNode(T0.t(right ? Lb.right : Lb.left))); scr.append(m); setTimeout(() => m.remove(), 900);
    }
    const press = (e, ms) => { if (!e) return; e.classList.add('press'); setTimeout(() => e.classList.remove('press'), ms); };
    function showKeys(keys, ms) {
      scr.querySelectorAll('.dkeys').forEach((e) => e.remove());
      const d = document.createElement('div'); d.className = 'dkeys';
      keys.forEach((k, i) => { if (i) d.append('+'); const s = document.createElement('span'); s.textContent = k; d.append(s); });
      scr.append(d);
      keys.forEach((k) => press($('k_' + (k.length === 1 ? k.toLowerCase() : KEYNAME(k))), ms));
      setTimeout(() => d.remove(), ms + 500);
    }
    function setText(el, t, caret) { el.textContent = t; if (caret) { const c = document.createElement('span'); c.className = 'caret'; el.append(c); } }
    function shape(s) {
      const [x1, y1] = s.from || [0, 0], [x2, y2] = s.to || [0, 0], c = s.color || '#000', w = (s.size || 3) * 0.35, f = s.fill || 'none';
      const X = Math.min(x1, x2), Y = Math.min(y1, y2), W = Math.abs(x2 - x1), H = Math.abs(y2 - y1);
      switch (s.shape) {
        case 'rect': return `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="${esc(f)}" stroke="${esc(c)}" stroke-width="${w}" vector-effect="non-scaling-stroke"/>`;
        case 'oval': return `<ellipse cx="${(x1 + x2) / 2}" cy="${(y1 + y2) / 2}" rx="${W / 2}" ry="${H / 2}" fill="${esc(f)}" stroke="${esc(c)}" stroke-width="${w}"/>`;
        case 'tri': return `<path d="M${(x1 + x2) / 2} ${Y}L${x2} ${Math.max(y1, y2)}L${x1} ${Math.max(y1, y2)}Z" fill="${esc(f)}" stroke="${esc(c)}" stroke-width="${w}"/>`;
        case 'fill': return `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="${esc(c)}" opacity=".9"/>`;
        case 'erase': return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#fff" stroke-width="${w * 3}" stroke-linecap="round"/>`;
        case 'selbox': return `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="rgba(10,116,192,.12)" stroke="#0A74C0" stroke-width=".4" stroke-dasharray="1.5 1"/>`;
        case 'text': return `<text x="${x1}" y="${y1}" font-size="7" fill="${esc(c)}">${esc(tx(s.text))}</text>`;
        default: return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${esc(c)}" stroke-width="${w}" stroke-linecap="round"/>`;
      }
    }
    function chart(s) {
      grp('chart', true);
      const c = $('chart'); if (!c) return;
      const vals = s.values || [], labels = (s.labels || []).map(tx), mx = Math.max(1, ...vals), n = vals.length || 1, cols = s.colors || PAL;
      let g = '';
      if (s.type === 'pie') {
        let a0 = -Math.PI / 2; const tot = vals.reduce((x, y) => x + y, 0) || 1;
        vals.forEach((v, i) => { const a1 = a0 + (v / tot) * 2 * Math.PI; g += `<path d="M50 54L${50 + 30 * Math.cos(a0)} ${54 + 30 * Math.sin(a0)}A30 30 0 ${v / tot > 0.5 ? 1 : 0} 1 ${50 + 30 * Math.cos(a1)} ${54 + 30 * Math.sin(a1)}Z" fill="${esc(cols[i % cols.length])}" stroke="#fff"/>`; a0 = a1; });
        g += labels.map((l, i) => `<rect x="86" y="${26 + i * 9}" width="4" height="4" fill="${esc(cols[i % cols.length])}"/><text x="92" y="${30 + i * 9}" font-size="4.5">${esc(l)}</text>`).join('');
      } else if (s.type === 'line') {
        g += '<path d="M12 88H96M12 88V16" stroke="#51636F" fill="none"/>' + `<polyline fill="none" stroke="#0A74C0" stroke-width="1.5" points="${vals.map((v, i) => `${18 + i * (74 / Math.max(1, n - 1))},${88 - (v / mx) * 64}`).join(' ')}"/>` + labels.map((l, i) => `<text x="${18 + i * (74 / Math.max(1, n - 1))}" y="95" font-size="4.2" text-anchor="middle">${esc(l)}</text>`).join('');
      } else {
        const bw = 78 / n;
        g += '<path d="M12 88H96M12 88V16" stroke="#51636F" fill="none"/>' + vals.map((v, i) => `<rect x="${15 + i * bw}" y="${88 - (v / mx) * 64}" width="${bw * 0.7}" height="${(v / mx) * 64}" fill="${esc((s.colors || [])[i] || '#0A74C0')}"/><text x="${15 + i * bw + bw * 0.35}" y="${85 - (v / mx) * 64}" font-size="4.2" text-anchor="middle">${v}</text><text x="${15 + i * bw + bw * 0.35}" y="95" font-size="4.2" text-anchor="middle">${esc(labels[i] || '')}</text>`).join('');
      }
      c.innerHTML = `<svg viewBox="0 0 ${s.type === 'pie' ? 120 : 100} 100" width="100%" height="100%"><text x="50" y="10" font-size="6" font-weight="700" text-anchor="middle">${esc(tx(s.title))}</text>${g}</svg>`;
    }
    async function run(s, inst, alive) {
      const a = s.a;
      if (a === 'move') return moveTo(s.to, inst);
      if (a === 'click' || a === 'dbl' || a === 'rclick') {
        const p = await moveTo(s.to, inst);
        const e = typeof s.to === 'string' && !s.to.startsWith('canvas:') ? $(s.to) : null;
        if (!inst) { ripple(p, a === 'rclick'); press(e, 260); if (a === 'dbl') { await sleep(260); ripple(p); } await sleep(420); }
        if (e && e.classList.contains('k-tab')) { scr.querySelectorAll('.k-tab.on').forEach((x) => x.classList.remove('on')); e.classList.add('on'); }
        return;
      }
      if (a === 'type') {
        const e = $(s.to); if (!e) return;
        const text = tx(s.text), base = s.append ? e.textContent : '';
        if (inst) return setText(e, base + text, false);
        await moveTo(s.to, false);
        for (let i = 1; i <= text.length; i++) {
          if (!alive()) return;
          setText(e, base + text.slice(0, i), true);
          const ch = text[i - 1];
          press($('k_' + (ch === ' ' ? 'Space' : ch.toLowerCase())), 150);
          if (ch !== ch.toLowerCase()) press($('k_Shift'), 150);
          await sleep(Math.max(45, Math.min(130, 2600 / text.length)));
        }
        return setText(e, base + text, false);
      }
      if (a === 'key') { if (!inst) { showKeys(s.keys || [], 900); await sleep(1100); } return; }
      if (a === 'show') { grp(s.to, true); const e = $(s.to); if (e) e.hidden = false; if (!inst) await sleep(350); return; }
      if (a === 'hide') { grp(s.to, false); const e = $(s.to); if (e && e.dataset.g) e.hidden = true; if (!inst) await sleep(250); return; }
      if (a === 'set') { const e = $(s.to); if (e) e.textContent = tx(s.text); if (!inst) await sleep(300); return; }
      if (a === 'cls') {
        [].concat(s.to).forEach((id) => { const e = $(id); if (!e) return; String(s.add || '').split(' ').filter(Boolean).forEach((c) => e.classList.add(c)); String(s.remove || '').split(' ').filter(Boolean).forEach((c) => e.classList.remove(c)); });
        if (!inst) await sleep(450); return;
      }
      if (a === 'drag') {
        const p = await moveTo(s.from, inst); if (!inst) { ripple(p); await sleep(250); }
        await moveTo(s.to, inst);
        if (s.sel) [].concat(s.sel).forEach((id) => { const e = $(id); if (e) e.classList.add('sel'); });
        if (!inst) await sleep(250); return;
      }
      if (a === 'draw') {
        const svg = scr.querySelector('[data-svg]'); if (!svg) return;
        const [x1, y1] = s.from || [0, 0], [x2, y2] = s.to || [0, 0];
        if (!inst) { const p = await moveTo('canvas:' + x1 + ',' + y1, false); ripple(p); await moveTo('canvas:' + x2 + ',' + y2, false); }
        svg.insertAdjacentHTML('beforeend', shape(s));
        if (!inst) await sleep(300); return;
      }
      if (a === 'undraw') { const svg = scr.querySelector('[data-svg]'); if (svg && svg.lastChild) svg.lastChild.remove(); if (!inst) await sleep(300); return; }
      if (a === 'chart') { chart(s); if (!inst) await sleep(700); return; }
      if (a === 'dragblock') {
        const b = $(s.id); if (!b) return;
        if (!inst) { const p = await moveTo([18, parseFloat(b.dataset.home) + 2.5], false); ripple(p); }
        if (!b.dataset.used) { const src = b.cloneNode(true); src.removeAttribute('data-id'); src.style.opacity = 0.45; b.parentNode.insertBefore(src, b); b.dataset.used = 1; }
        b.classList.toggle('fast', !!inst);
        b.style.left = 41 + (s.indent || 0) * 3 + '%'; b.style.top = 15 + (s.slot || 0) * 6.6 + '%';
        if (!inst) await moveTo([45 + (s.indent || 0) * 3, 17.5 + (s.slot || 0) * 6.6], false);
        return;
      }
      if (a === 'sprite') {
        const sp = $('sprite'); if (!sp) return;
        scr.querySelectorAll('.ssay').forEach((e) => e.remove());
        if (s.reset) Object.assign(sp.dataset, { x: 0, y: 0, r: 0 });
        if (s.move) { sp.dataset.x = +sp.dataset.x + s.move[0]; sp.dataset.y = +sp.dataset.y + s.move[1]; }
        if (s.turn) sp.dataset.r = +sp.dataset.r + s.turn;
        sp.classList.toggle('fast', !!inst);
        sp.style.left = Math.max(71, Math.min(93, 80 + +sp.dataset.x)) + '%'; sp.style.top = Math.max(13, Math.min(46, 29 - +sp.dataset.y)) + '%'; sp.style.transform = `rotate(${sp.dataset.r}deg)`;
        if (s.say) { const b = document.createElement('div'); b.className = 'ssay'; b.textContent = tx(s.say); b.style.left = Math.max(71, Math.min(84, 78 + +sp.dataset.x)) + '%'; b.style.top = Math.max(13, 23 - +sp.dataset.y) + '%'; scr.append(b); }
        if (!inst) await sleep(950); return;
      }
      if (a === 'mouse') {
        const e = $(s.btn === 'right' ? 'm_right' : s.btn === 'wheel' ? 'm_wheel' : 'm_left');
        if (e && !inst) { e.classList.add('press'); await sleep(s.btn === 'dbl' ? 200 : 500); e.classList.remove('press'); if (s.btn === 'dbl') { await sleep(150); e.classList.add('press'); await sleep(200); e.classList.remove('press'); } await sleep(200); }
        return;
      }
      if (a === 'wait') { if (!inst) await sleep(s.ms || 800); return; }
    }
    return { build, run, cancel() { sleepers.forEach(clearTimeout); sleepers = []; } };
  }

  T0.registerSim('sim.screen_demo', {
    mount(el, params, ctx) {
      css();
      const E = T0.ui.el;
      const D = Object.assign({ steps: [] }, params || {});
      const S = stageOf(D);
      const root = E('div', { class: 'sd', 'data-kind': 'sim.screen_demo' });
      el.append(root);
      if (!S) { root.append(E('div', { class: 't0-unsupported', text: T0.t(Lb.nostage) + ': ' + (D.stage || D.stage_template_ref || '?') })); return { unmount() { root.remove(); } }; }
      const scr = E('div', { class: 'dscr', role: 'img' });
      const cap = E('p', { class: 'sd-cap', 'aria-live': 'polite' });
      const bR = E('button', { class: 't0-btn', type: 'button' }, '⟲');
      const bP = E('button', { class: 't0-btn', type: 'button' }, '‹');
      const bPl = E('button', { class: 't0-btn primary', type: 'button' });
      const bN = E('button', { class: 't0-btn', type: 'button' }, '›');
      const bS = E('button', { class: 't0-btn', type: 'button' }, '🔊');
      const bar = E('i'), cnt = E('span', { class: 'sd-n' });
      root.append(scr, cap, E('div', { class: 'sd-ctl' }, bR, bP, bPl, bN, bS, E('div', { class: 'sd-prog' }, bar), cnt));
      const eng = engine(scr, D, S);
      const steps = D.steps || [];
      const caps = steps.map((s, k) => (s.t ? k : -1)).filter((k) => k >= 0);
      const capOf = (k) => { let c = null; for (const x of caps) if (x <= k) c = x; return c; };
      let i = -1, playing = false, token = 0, snd = T0.store.get('sd:snd', true) !== false;
      const sim = ctx && ctx.sim;
      function labels() {
        bR.setAttribute('aria-label', T0.t(Lb.restart)); bP.setAttribute('aria-label', T0.t(Lb.prev)); bN.setAttribute('aria-label', T0.t(Lb.next));
        bS.setAttribute('aria-label', T0.t(Lb.sound)); bS.setAttribute('aria-pressed', String(snd)); bS.style.opacity = snd ? 1 : 0.5;
        bPl.textContent = playing ? '❚❚ ' + T0.t(Lb.pause) : '▶ ' + T0.t(Lb.play);
        scr.setAttribute('aria-label', tx((sim && sim.title) || D.title) || 'screen demo');
      }
      function ui() {
        labels();
        const c = capOf(Math.max(0, i));
        cnt.textContent = (caps.length ? caps.indexOf(c) + 1 : 0) + ' / ' + caps.length;
        bar.style.width = ((i + 1) / Math.max(1, steps.length)) * 100 + '%';
      }
      function showCap(k) {
        const c = capOf(k); cap.innerHTML = '';
        if (c == null) return;
        cap.append(E('span', { class: 'sd-no', text: String(caps.indexOf(c) + 1) }), E('span', { text: tx(steps[c].t) }));
      }
      function stopAll() { token++; eng.cancel(); T0.media.stop(); }
      async function goto(k) {
        stopAll();
        eng.build();
        for (const s of D.init || []) await eng.run(s, true, () => true);
        for (let j = 0; j < k; j++) await eng.run(steps[j], true, () => true);
        i = k - 1; showCap(Math.max(0, i)); ui();
      }
      const say = (s) => {
        if (!snd) return null;
        return s.audio_ref ? T0.media.play(s.audio_ref, { text: s.t }) : T0.media.speak(tx(s.t));
      };
      async function loop(my) {
        while (playing && i < steps.length - 1 && my === token && root.isConnected) {
          i++; const s = steps[i];
          let voice = null, minMs = 350;
          if (s.t) { showCap(i); voice = say(s); minMs = ['type', 'draw'].includes(s.a) ? 350 : Math.max(900, Math.min(2600, tx(s.t).length * 28)); await new Promise((r) => setTimeout(r, 400)); }
          ui();
          await eng.run(s, false, () => my === token);
          if (my !== token) return;
          await new Promise((r) => setTimeout(r, minMs));
          const nx = steps[i + 1];
          if (voice && (!nx || nx.t)) await voice; /* chờ đọc xong trước khi sang phụ đề kế */
          if (my !== token) return;
        }
        if (my === token && i >= steps.length - 1) { playing = false; ui(); }
      }
      function setPlaying(p) { playing = p; if (!p) stopAll(); ui(); }
      async function play() { playing = true; if (i >= steps.length - 1) await goto(0); const my = ++token; ui(); loop(my); }
      /* nhảy tới phụ đề k rồi diễn đoạn đó (không tự sang đoạn sau) */
      async function seg(tgt) {
        playing = false;
        await goto(tgt);
        const my = ++token;
        const end = caps.find((x) => x > tgt);
        if (steps[tgt] && steps[tgt].t) { showCap(tgt); say(steps[tgt]); }
        for (let j = tgt; j < (end == null ? steps.length : end); j++) { i = j; ui(); await eng.run(steps[j], false, () => my === token); if (my !== token) return; }
      }
      bPl.onclick = () => (playing ? setPlaying(false) : play());
      bR.onclick = async () => { playing = false; await goto(0); play(); };
      bN.onclick = () => { const nx = caps.find((x) => x > i); if (nx == null) { setPlaying(false); goto(steps.length); } else seg(nx); };
      bP.onclick = () => { const cur = capOf(Math.max(0, i)); const pv = caps.filter((x) => x < cur).pop(); seg(pv == null ? 0 : pv); };
      bS.onclick = () => { snd = !snd; T0.store.set('sd:snd', snd); if (!snd) T0.media.stop(); ui(); };
      const off = T0.on('t0:lang', () => { const was = playing; const at = Math.max(0, i + 1); playing = false; goto(at).then(() => { if (was) play(); }); });
      goto(0).then(() => { if (D.autoplay) play(); });
      return {
        unmount() { playing = false; stopAll(); off(); root.remove(); },
        /* cho kiểm tra tự động */
        goto, get index() { return i; }, steps: steps.length, captions: caps.length,
      };
    },
  });
})();
