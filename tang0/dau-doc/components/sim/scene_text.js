/* components/sim/scene_text.js — agent B (đề xuất 001). Bốn loại cảnh "video" dạng chữ, theo params của
 * thu-vien/mo-phong/danh-muc.json (không đổi schema):
 *   sim.scene_text_lines  {lines: [chuỗi | chuoi_da_ngu], delay_s = 1.3}   dòng hiện dần; ký pháp {a/b} (012)
 *   sim.scene_steps       {items: [chuoi_da_ngu], delay_s = 1.1}            bước đánh số hiện dần
 *   sim.scene_keys        {combos: [{keys: ['Ctrl','C'], t}]}               nắp phím + ý nghĩa
 *   sim.scene_code_blocks {items: [{c: events|motion|…, t, in}]}           khối lệnh kiểu Scratch
 * Mã gốc: V() k='lines'|'steps'|'keys'|'blocks' của matematika5/informatika5/kimyo8/fizika8. */
(function () {
  const T0 = window.T0;
  const K = () => T0.sceneKit;

  const CSS = `
.sk-lines{align-self:center;display:flex;flex-direction:column;gap:.55em;font-size:clamp(17px,4.4vw,23px);font-weight:700;max-width:100%}
.sk-lines .sk-ln{white-space:pre-wrap}
.sk-lines .sk-ln.sk-ind{font-weight:500;color:#D7E6EF}
.sk-lines .sk-ln .sk-main{white-space:pre-wrap}
.sk-steps{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.6em;font-size:clamp(15px,3.9vw,19px)}
.sk-step{display:flex;gap:.7em;align-items:flex-start;font-weight:600}
.sk-step-n{flex:none;width:1.9em;height:1.9em;border-radius:50%;display:grid;place-items:center;background:#F2B632;color:#1B1300;font-weight:800;font-size:.9em;margin-top:-.1em}
.sk-step:nth-child(4n+2) .sk-step-n{background:#5FB8F5}
.sk-step:nth-child(4n+3) .sk-step-n{background:#7DD87F}
.sk-step:nth-child(4n+4) .sk-step-n{background:#F59AC0}
.sk-step>div{min-width:0;flex:1}
.sk-keys{display:flex;flex-direction:column;gap:.75em;font-size:clamp(15px,3.9vw,18px)}
.sk-combo{display:flex;flex-wrap:wrap;align-items:center;gap:.4em .8em}
.sk-caps{display:inline-flex;align-items:center;gap:.3em;flex:none}
.sk-cap{display:inline-flex;align-items:center;justify-content:center;min-width:2.3em;height:2.2em;padding:0 .6em;border-radius:.45em;background:linear-gradient(#FDFEFF,#DCE5EC);color:#14222D;font-family:var(--font-mono);font-weight:700;font-size:.92em;box-shadow:0 .2em 0 #8EA3B3,0 .3em .5em rgba(0,0,0,.35);border:1px solid #B8C7D2}
.sk-plus{color:#A9C3D3;font-weight:700}
.sk-combo>div{flex:1 1 12em;min-width:0}
.sk-blocks{display:flex;flex-direction:column;gap:3px;align-self:flex-start;max-width:100%;font-size:clamp(14px,3.8vw,17px)}
.sk-blk{position:relative;display:block;width:max-content;max-width:100%;padding:.5em .9em;border-radius:.45em;color:#111;font-weight:700;box-shadow:inset 0 -3px 0 rgba(0,0,0,.18)}
.sk-blk .sk-sub{color:rgba(0,0,0,.66)}
.sk-blk.c-events{border-radius:1.1em .9em .45em .45em;padding-top:.75em}
.sk-blk.c-events{background:#FFBF00}.sk-blk.c-motion{background:#4C97FF}.sk-blk.c-looks{background:#9966FF}.sk-blk.c-sound{background:#CF63CF}
.sk-blk.c-control{background:#FFAB19}.sk-blk.c-sensing{background:#5CB1D6}.sk-blk.c-pen{background:#0FBD8C}.sk-blk.c-operators{background:#59C059}
.sk-blk.c-variables{background:#FF8C1A}.sk-blk.c-other{background:#C9D4DC}`;
  const css = () => { if (!document.getElementById('sk-text-css')) { const s = document.createElement('style'); s.id = 'sk-text-css'; s.textContent = CSS; document.head.append(s); } };

  /* "   chữ" (thụt lề bằng dấu cách ở mã gốc) -> dòng phụ thụt vào */
  const indentOf = (v) => { const s = typeof v === 'string' ? v : (v && (v.uz || Object.values(v)[0])) || ''; const m = /^( +)/.exec(s); return m ? m[1].length : 0; };
  const trimLead = (v) => {
    if (typeof v === 'string') return v.replace(/^ +/, '');
    if (!v || typeof v !== 'object') return v;
    const o = {}; for (const k in v) o[k] = typeof v[k] === 'string' ? v[k].replace(/^ +/, '') : v[k]; return o;
  };

  T0.registerSim('sim.scene_text_lines', {
    mount(el, params) {
      css();
      return K().mount(el, params, (root, p, o) => {
        const box = K().E('div', 'sk-lines');
        const nodes = (Array.isArray(p.lines) ? p.lines : []).map((l) => {
          const ind = indentOf(l);
          const n = K().line(trimLead(l), 'sk-ln' + (ind ? ' sk-ind' : ''));
          if (ind) n.style.paddingLeft = Math.min(4, ind * 0.4).toFixed(2) + 'em';
          return n;
        });
        box.append(...nodes);
        root.append(box);
        if (o.animate) K().reveal(nodes, K().num(p.delay_s, 1.3));
      }, 'lines');
    },
  });

  /* "1. Chữ" đã có số ở đầu -> lấy số đó cho vòng tròn, bỏ khỏi chữ (tránh "1  1. Chữ") */
  const NUM = /^\s*(\d{1,2})[.)]\s+/;
  function splitNum(v) {
    const probe = typeof v === 'string' ? v : (v && (v.uz || Object.values(v)[0])) || '';
    const m = NUM.exec(probe);
    if (!m) return { n: null, v };
    if (typeof v === 'string') return { n: m[1], v: v.replace(NUM, '') };
    const o = {}; for (const k in v) o[k] = typeof v[k] === 'string' ? v[k].replace(NUM, '') : v[k];
    return { n: m[1], v: o };
  }

  T0.registerSim('sim.scene_steps', {
    mount(el, params) {
      css();
      return K().mount(el, params, (root, p, o) => {
        const ol = K().E('ol', 'sk-steps');
        const nodes = (Array.isArray(p.items) ? p.items : []).map((it, i) => {
          const s = splitNum(it);
          const li = K().E('li', 'sk-step', K().E('span', 'sk-step-n', s.n || String(i + 1)));
          li.firstChild.setAttribute('aria-hidden', 'true');
          li.append(K().line(s.v, ''));
          return li;
        });
        ol.append(...nodes);
        root.append(ol);
        if (o.animate) K().reveal(nodes, K().num(p.delay_s, 1.1));
      }, 'steps');
    },
  });

  T0.registerSim('sim.scene_keys', {
    mount(el, params) {
      css();
      return K().mount(el, params, (root, p, o) => {
        const box = K().E('div', 'sk-keys');
        const nodes = (Array.isArray(p.combos) ? p.combos : []).map((c) => {
          const caps = K().E('span', 'sk-caps');
          (c.keys || []).forEach((k, i) => { if (i) caps.append(K().E('span', 'sk-plus', '+')); caps.append(K().E('kbd', 'sk-cap', String(k))); });
          caps.setAttribute('aria-label', (c.keys || []).join(' + '));
          return K().E('div', 'sk-combo', caps, K().line(c.t, ''));
        });
        box.append(...nodes);
        root.append(box);
        if (o.animate) K().reveal(nodes, K().num(p.delay_s, 1.1));
      }, 'keys');
    },
  });

  const CATS = ['events', 'motion', 'looks', 'sound', 'control', 'sensing', 'pen', 'operators', 'variables'];
  T0.registerSim('sim.scene_code_blocks', {
    mount(el, params) {
      css();
      return K().mount(el, params, (root, p, o) => {
        const box = K().E('div', 'sk-blocks');
        box.setAttribute('role', 'list');
        const nodes = (Array.isArray(p.items) ? p.items : []).map((b) => {
          const c = CATS.includes(b.c) ? b.c : 'other';
          const n = K().line(b.t, 'sk-blk c-' + c);
          n.setAttribute('role', 'listitem');
          const lv = Math.max(0, Math.min(6, K().num(b.in, 0)));
          if (lv) n.style.marginLeft = (lv * 1.4) + 'em';
          return n;
        });
        box.append(...nodes);
        root.append(box);
        if (o.animate) K().reveal(nodes, K().num(p.delay_s, 0.9));
      }, 'blocks');
    },
  });
})();
