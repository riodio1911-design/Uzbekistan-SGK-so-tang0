/* components/sim/legacy_embed.js — agent F, đề xuất 007 bước 1 (D3: chỉ tabiiy5, cờ trục 9 `ma_cu_nhung_tam`, hạn gỡ đợt 2).
 *
 * sim.legacy_embed  params: {code_ref: "<cuốn>/index.html#ACT.lab13" | "...#VIDEOS.v1.scenes[0].draw", text?: [{uz,vi,ru}], min?: giây}
 *   Chạy hàm cũ trong <iframe sandbox="allow-scripts"> (không same-origin: không đụng localStorage/T0 của đầu đọc,
 *   các global cũ – T, S, C, Object.prototype.ru – chỉ sống trong iframe). Mã cũ lấy từ gói window.T0_LEGACY[<cuốn>]
 *   (sinh bởi legacy/_sinh-<cuốn>.py). Chữ ru: RUDICT cũ + cặp uz→ru trong params.text của mọi mô phỏng của cuốn
 *   (đã đa ngữ trong book.json) – params.text thắng.
 * Đồng thời đăng ký 22 kind KHTN của tabiiy5 (germination_lab … satellite_uses): có renderer gốc thì dùng renderer gốc,
 *   không thì nhúng mã cũ theo params.code_ref; thiếu gói/thiếu code_ref → khung "chưa hỗ trợ" như core.
 * API cho file khác: T0.legacy.has(code_ref), T0.legacy.mount(el, params, {mode:'act'|'scene', min}).
 */
(function () {
  const T0 = window.T0;
  const KINDS = ['sim.germination_lab', 'sim.camouflage_game', 'sim.particle_states', 'sim.drying_variables', 'sim.heating_curve',
    'sim.dissolving', 'sim.falling_paper', 'sim.balanced_forces', 'sim.sound_vibration', 'sim.sound_speed_race', 'sim.magnet_lab',
    'sim.dot_plot_collect', 'sim.pie_explorer', 'sim.jar_rain', 'sim.cycle_diagram', 'sim.proportion_drilldown', 'sim.smog_sources',
    'sim.oil_spill_cleanup', 'sim.solar_system_models', 'sim.earth_orbit', 'sim.seasons', 'sim.sun_earth_moon', 'sim.satellite_uses'];
  const UI = {
    flag: { uz: 'Eski kod (vaqtincha)', ru: 'Старый код (временно)', vi: 'Mã cũ (tạm)' },
    replay: { uz: 'Qayta ko‘rish', ru: 'Повторить', vi: 'Xem lại' },
  };
  const CSS = `
.t0lg{position:relative;width:100%}
.t0lg iframe{display:block;width:100%;border:0;background:transparent;min-height:120px}
.t0lg.scene iframe{aspect-ratio:16/9;min-height:0;border-radius:var(--radius-sm,8px)}
.t0lg-flag{position:absolute;right:4px;bottom:4px;font-size:var(--text-xs,12px);opacity:.55;pointer-events:none;background:var(--color-surface);color:var(--color-ink-2);border-radius:var(--radius-pill,999px);padding:0 8px}`;
  function css() { if (!document.getElementById('t0lg-css')) document.head.append(Object.assign(document.createElement('style'), { id: 't0lg-css', textContent: CSS })); }

  function parseRef(ref) {
    const m = /^([a-z0-9_]+)\/[^#]*#(.+)$/i.exec(String(ref || ''));
    if (!m) return null;
    const entry = m[2].trim();
    let mode = null;
    if (/^ACT\.[A-Za-z0-9_]+$/.test(entry)) mode = 'act';
    else if (/^VIDEOS\.[A-Za-z0-9_]+\.scenes\[\d+\]\.draw$/.test(entry)) mode = 'scene';
    return mode ? { bundle: m[1], entry, mode } : null;
  }
  const bundleOf = (r) => r && (window.T0_LEGACY || {})[r.bundle];
  function has(ref) { const r = parseRef(ref); return !!bundleOf(r); }

  function ruPairs(params) {
    const out = {};
    const add = (arr) => (arr || []).forEach((o) => { if (o && typeof o.uz === 'string' && typeof o.ru === 'string') out[o.uz] = o.ru; });
    ((T0.book && T0.book.simulations) || []).forEach((s) => add(s.params && s.params.text));
    add(params && params.text);
    return out;
  }
  function theme() {
    const r = document.documentElement;
    if (r.dataset.theme === 'dark' || r.dataset.theme === 'light') return r.dataset.theme;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function baseHref() {
    try { return new URL(T0.asset('x'), location.href).href.replace(/x$/, ''); } catch (e) { return ''; }
  }
  const safe = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

  // Mã chạy TRONG iframe. Nhận cấu hình từ <script type="application/json" id="cfg">.
  const RUNNER = `
(function(){
  var cfg=JSON.parse(document.getElementById('cfg').textContent);
  var app=document.getElementById('app'), raf=0, t0=0;
  function post(){ try{ parent.postMessage({t0lg:cfg.id,h:Math.ceil(Math.max(app.scrollHeight,app.getBoundingClientRect().height))+8},'*'); }catch(e){} }
  function run(){
    cancelAnimationFrame(raf); S.text=cfg.lang; S.audio=cfg.lang; document.documentElement.lang=cfg.lang;
    document.documentElement.setAttribute('data-theme',cfg.theme);
    if(cfg.mode==='act'){ var f=ACT[cfg.entry.slice(4)]; app.innerHTML=''; if(f) f(app); else app.textContent='?'+cfg.entry; post(); return; }
    var m=/^VIDEOS\\.(\\w+)\\.scenes\\[(\\d+)\\]/.exec(cfg.entry), v=window.VIDEOS[m[1]], sc=v&&v.scenes[+m[2]];
    if(!sc){ app.textContent='?'+cfg.entry; return; }
    var dur=Math.max(2,(cfg.min||sc.min||8)), L=function(o){ return o==null?'':typeof o==='string'?o:(o[cfg.lang]||o.uz); };
    app.innerHTML='<svg viewBox="0 0 960 540" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img"></svg>';
    var svg=app.firstChild, still=matchMedia('(prefers-reduced-motion: reduce)').matches;
    function fr(now){ var s=(now-t0)/1000, p=Math.min(1,s/Math.max(.5,dur-.4)); try{ svg.innerHTML=sc.draw(p,s,L); }catch(e){ console.error(e); } if(p<1) raf=requestAnimationFrame(fr); }
    if(still){ try{ svg.innerHTML=sc.draw(.999,dur,L); }catch(e){ console.error(e); } }
    else { t0=performance.now(); raf=requestAnimationFrame(fr); }
    app.onclick=function(){ if(!still){ cancelAnimationFrame(raf); t0=performance.now(); raf=requestAnimationFrame(fr); } };
  }
  addEventListener('message',function(e){ var d=e.data||{}; if(d.t0lg!==cfg.id) return; if(d.lang) cfg.lang=d.lang; if(d.theme) cfg.theme=d.theme; run(); });
  if(window.ResizeObserver) new ResizeObserver(post).observe(app);
  new MutationObserver(function(){ setTimeout(post,30); }).observe(app,{childList:true,subtree:true,attributes:true});
  addEventListener('load',post);
  run();
})();`;

  let seq = 0;
  function mount(el, params, opts) {
    css();
    opts = opts || {};
    const r = parseRef(params.code_ref);
    const B = bundleOf(r);
    if (!B) {
      const box = T0.ui.el('div', { class: 't0-unsupported', 'data-kind': 'sim.legacy_embed' }, T0.s('unsupported') + ': ', T0.ui.el('code', { text: String(params.code_ref || 'sim.legacy_embed') }));
      el.append(box); return { unmount() { box.remove(); } };
    }
    const id = 'lg' + (++seq) + '_' + Date.now().toString(36);
    const cfg = { id, mode: r.mode, entry: r.entry, lang: T0.lang, theme: theme(), min: opts.min || params.min || 0 };
    const ru = Object.assign({}, B.ru, ruPairs(params));
    const doc = '<!doctype html><html lang="' + T0.lang + '" data-theme="' + cfg.theme + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
      + '<base href="' + baseHref().replace(/"/g, '&quot;') + '"><style>' + B.css
      + '\nhtml,body{background:transparent!important;margin:0;overflow-x:hidden}body{padding:2px 2px 6px}'
      + (r.mode === 'scene' ? 'html,body,#app{height:100%;padding:0;overflow:hidden}#app svg{display:block;cursor:pointer}' : '')
      + '\nbutton,select,.btn,.chip,.opt,.card{min-height:44px}</style></head><body><div id="app"></div>'
      + '<script type="application/json" id="cfg">' + safe(cfg) + '<\/script>'
      + '<script>window.RUDICT=' + safe(ru) + ';var S={text:"uz",audio:"uz",rate:1,subs:true,voiceMode:"auto"};\n' + B.js + '\n' + RUNNER + '<\/script></body></html>';
    const wrap = T0.ui.el('div', { class: 't0lg ' + r.mode, 'data-flag': B.flag || 'ma_cu_nhung_tam', 'data-code-ref': params.code_ref });
    const fr = document.createElement('iframe');
    fr.setAttribute('sandbox', 'allow-scripts');
    fr.setAttribute('title', String(params.code_ref));
    fr.srcdoc = doc;
    wrap.append(fr);
    if (r.mode === 'act') wrap.append(T0.ui.el('span', { class: 't0lg-flag', text: T0.t(UI.flag) }));
    el.append(wrap);
    const onMsg = (e) => { if (e.source !== fr.contentWindow || !e.data || e.data.t0lg !== id) return; if (r.mode === 'act' && e.data.h > 0) fr.style.height = (e.data.h + 4) + 'px'; };
    window.addEventListener('message', onMsg);
    const send = (o) => { try { fr.contentWindow && fr.contentWindow.postMessage(Object.assign({ t0lg: id }, o), '*'); } catch (e) {} };
    const offLang = T0.on('t0:lang', () => { send({ lang: T0.lang }); const f = wrap.querySelector('.t0lg-flag'); if (f) f.textContent = T0.t(UI.flag); });
    const mo = new MutationObserver(() => send({ theme: theme() }));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return { unmount() { window.removeEventListener('message', onMsg); offLang(); mo.disconnect(); wrap.remove(); }, frame: fr };
  }

  T0.legacy = { has, mount, parseRef, kinds: KINDS.slice() };
  T0.registerSim('sim.legacy_embed', { mount(el, params) { return mount(el, params || {}); } });
  KINDS.forEach((k) => {
    if (T0.hasSim(k)) return; // renderer gốc (vd. germination_lab.js) đã đăng ký và tự gọi T0.legacy khi cần
    T0.registerSim(k, { mount(el, params) { return mount(el, params || {}); } });
  });
  // tabiiy5 types92: kind sim.figure_explorer nhưng không có parts/figure, logic ở ACT.types92 → nhúng mã cũ.
  // Bọc renderer figure_explorer sẵn có (không sửa file của R1); mọi trường hợp khác đi thẳng renderer gốc.
  const fe = T0._sim && T0._sim['sim.figure_explorer'];
  const feMount = (el, p, ctx) => {
    const base = T0._sim['sim.figure_explorer'] === feWrap ? fe : T0._sim['sim.figure_explorer'];
    if (p && !p.parts && !p.figure && !p.items && !p.points && /#ACT\./.test(p.code_ref || '') && has(p.code_ref)) return mount(el, p);
    return base ? base.mount(el, p, ctx) : { unmount() {} };
  };
  const feWrap = { mount: feMount };
  if (fe) T0.registerSim('sim.figure_explorer', feWrap);
})();
