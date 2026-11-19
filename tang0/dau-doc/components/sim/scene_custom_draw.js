/* components/sim/scene_custom_draw.js — R2 (F đợt 1: ủy quyền cho T0.legacy khi có gói mã cũ). sim.scene_custom_draw (thu-vien/mo-phong/danh-muc.json):
   cảnh "video" vẽ tay bằng hàm draw(p,s,L) trong mã cũ (tabiiy5 window.VIDEOS), KHÔNG có tham số dữ liệu —
   params chỉ có code_ref trỏ về mã gốc. Không chép lại hàm vẽ (mã thừa theo README bước ②), nên hiển thị
   một khung thay thế trung thực: hình minh họa trung tính + nhãn "hình cảnh chưa chuyển".
   Lời thuyết minh/phụ đề do trình phát sim.scene_player (R1) lo. */
(function () {
  const T0 = window.T0;
  const UI = { pending: { uz: 'Sahna rasmi hali ko‘chirilmagan', ru: 'Рисунок сцены ещё не перенесён', vi: 'Hình cảnh (vẽ bằng mã) chưa được chuyển sang thư viện' } };
  const css = `
.t0cd{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;min-height:140px;padding:12px;text-align:center;color:inherit}
.t0cd svg{width:96px;height:64px;opacity:.55}
.t0cd small{font-size:var(--text-xs);opacity:.7}`;
  T0.registerSim('sim.scene_custom_draw', {
    mount(el, params) {
      // F (007 bước 1): có gói mã cũ (components/sim/legacy/<cuốn>.js) thì vẽ cảnh thật trong iframe sandbox; không thì khung thay thế.
      if (T0.legacy && T0.legacy.has(params.code_ref)) return T0.legacy.mount(el, params, { mode: 'scene' });
      if (!document.getElementById('t0cd-css')) document.head.append(Object.assign(document.createElement('style'), { id: 't0cd-css', textContent: css }));
      const box = document.createElement('div');
      box.className = 't0cd';
      box.dataset.codeRef = params.code_ref || '';
      box.innerHTML = '<svg viewBox="0 0 96 64" aria-hidden="true"><rect x="2" y="2" width="92" height="60" rx="8" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="6 5"/><circle cx="30" cy="24" r="7" fill="currentColor"/><path d="M10 54l22-20 14 12 12-9 26 17z" fill="currentColor"/></svg>';
      const s = document.createElement('small'); s.textContent = T0.t(UI.pending); box.append(s);
      el.append(box);
      const off = T0.on ? T0.on('t0:lang', () => { s.textContent = T0.t(UI.pending); }) : null;
      return { unmount() { off && off(); box.remove(); } };
    }
  });
})();
