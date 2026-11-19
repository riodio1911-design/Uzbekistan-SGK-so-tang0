/* components/ex/sort_bins.js — R2. Dạng ex.sort_bins (thu-vien/bai-tap/danh-muc.json):
   chạm thẻ rồi chạm nhóm (không kéo thả); chấm per_card: đúng nếu nhóm đã đặt === bin; điểm theo thẻ.
   Dữ liệu: bins[i18n] ; cards[{text, bin(chỉ số hoặc key), image?}] ; ảnh thẻ dự phòng: data.card_images (theo thứ tự thẻ).
   Phần đầu (prompt) và nút Kiểm tra/Làm lại do T0.renderEx (core) vẽ.
   Đáp án lưu: T0.store 'ex:<id>:ans' = {chỉ số thẻ: chỉ số nhóm}. */
(function () {
  const T0 = window.T0 = window.T0 || {};
  const UI = {
    pick: { uz: 'Kartani tanlang, so‘ng guruhni bosing.', ru: 'Выберите карточку, затем нажмите на группу.', vi: 'Chọn một thẻ, rồi chạm vào nhóm phù hợp.' },
    left: { uz: 'Kartalar', ru: 'Карточки', vi: 'Các thẻ' },
    drop: { uz: 'Shu yerga qo‘yish', ru: 'Положить сюда', vi: 'Đặt vào đây' },
    allRight: { uz: 'Barakalla! Hammasi to‘g‘ri.', ru: 'Молодец! Всё верно.', vi: 'Giỏi lắm! Tất cả đều đúng.' },
    someWrong: { uz: 'Qizil bilan belgilanganlarni qayta ko‘rib chiqing.', ru: 'Проверьте карточки, отмеченные красным.', vi: 'Hãy xem lại các thẻ viền đỏ.' },
    notAll: { uz: 'Hamma kartalarni joylashtiring.', ru: 'Разложите все карточки.', vi: 'Hãy xếp hết các thẻ.' }
  };
  const t = o => (T0.t ? T0.t(o) : (o && (o[T0.lang] || o.uz))) || '';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const asset = p => !p ? '' : /^(data:|https?:|blob:|\/)/.test(p) ? p : (T0.asset ? T0.asset(p) : 'mau/' + T0.book.book_id + '/' + p);

  function render(el, ex, ctx) {
    const bins = (ex.bins || []).map((b, i) => ({ key: (b && b.key) || i, name: b && b.name ? b.name : b }));
    const imgs = ex.data && ex.data.card_images ? Object.values(ex.data.card_images) : [];
    const cards = (ex.cards || []).map((c, i) => ({
      i, text: c.text, image: c.image || imgs[i] || null,
      bin: typeof c.bin === 'number' ? c.bin : Math.max(0, bins.findIndex(b => b.key === c.bin))
    }));
    const skey = 'ex:' + ex.id + ':ans';
    let place = Object.assign({}, (T0.store && T0.store.get(skey, null)) || {});
    let pick = null, checked = false;
    const save = () => T0.store && T0.store.set(skey, place);

    const cardH = c => {
      const st = checked && place[c.i] != null ? (place[c.i] === c.bin ? ' ok' : ' bad') : '';
      return `<button type="button" class="t0x-card k-hit${st}" data-c="${c.i}" aria-pressed="${pick === c.i}">${c.image ? `<img src="${esc(asset(c.image))}" alt="" loading="lazy">` : ''}<span>${esc(t(c.text))}</span></button>`;
    };
    const draw = () => {
      const free = cards.filter(c => place[c.i] == null);
      el.innerHTML = `<div class="t0x-sort">
        <p class="t0x-hint">${esc(t(UI.pick))}</p>
        <div class="t0x-pool" aria-label="${esc(t(UI.left))}">${free.map(cardH).join('')}</div>
        <div class="t0x-bins">${bins.map((b, bi) => `<div class="t0x-bin${pick != null ? ' armed' : ''}" data-b="${bi}">
          <button type="button" class="t0x-binhead k-hit" data-b="${bi}">${esc(t(b.name))}${pick != null ? `<small>${esc(t(UI.drop))}</small>` : ''}</button>
          <div class="t0x-bincards">${cards.filter(c => place[c.i] === bi).map(cardH).join('')}</div></div>`).join('')}</div></div>`;
      el.querySelectorAll('[data-c]').forEach(b => b.onclick = e => {
        e.stopPropagation(); const k = +b.dataset.c;
        if (place[k] != null) { delete place[k]; checked = false; pick = k; save(); }
        else pick = pick === k ? null : k;
        draw();
      });
      el.querySelectorAll('button[data-b]').forEach(b => b.onclick = () => {
        if (pick == null) return; place[pick] = +b.dataset.b; pick = null; checked = false; save(); draw();
      });
    };
    draw();
    return {
      check() {
        checked = true; draw();
        const right = cards.filter(c => place[c.i] === c.bin).length, n = cards.length;
        const all = cards.every(c => place[c.i] != null);
        const ok = right === n;
        return { ok, score: n ? right / n : 0, feedback: ok ? t(UI.allRight) : (!all ? t(UI.notAll) + ' ' : '') + (right < cards.filter(c => place[c.i] != null).length ? t(UI.someWrong) : '') + ` (${right}/${n})` };
      },
      reset() { place = {}; pick = null; checked = false; save(); draw(); },
      answer() { return Object.assign({}, place); }
    };
  }

  const css = `
.t0x-q{margin:0 0 6px;font-weight:700}.t0x-hint{margin:0 0 var(--space-2);color:var(--color-ink-2);font-size:var(--text-sm)}
.t0x-pool{display:flex;flex-wrap:wrap;gap:var(--space-2);min-height:var(--touch-min);margin-bottom:var(--space-3)}
.t0x-card{display:inline-flex;align-items:center;gap:8px;min-height:var(--touch-min);padding:4px 12px 4px 4px;border-radius:var(--radius-sm);border:2px solid var(--color-line);background:var(--color-surface);color:var(--color-ink);font:inherit;font-weight:700;cursor:pointer}
.t0x-card:not(:has(img)){padding-left:12px}
.t0x-card img{width:44px;height:44px;object-fit:cover;border-radius:6px}
.t0x-card[aria-pressed=true]{border-color:var(--hue-orange);box-shadow:0 0 0 3px var(--hue-orange-soft)}
.t0x-card.ok{border-color:var(--color-ok);background:var(--color-ok-soft)}.t0x-card.bad{border-color:var(--color-bad);background:var(--color-bad-soft)}
.t0x-bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--space-3)}
.t0x-bin{border:2px dashed var(--color-line);border-radius:var(--radius-md);padding:var(--space-2);background:var(--color-surface-2);min-height:110px}
.t0x-bin.armed{border-color:var(--color-accent)}
.t0x-binhead{display:block;width:100%;min-height:var(--touch-min);border:0;border-radius:var(--radius-sm);background:var(--color-accent-soft);color:var(--color-accent-ink);font:inherit;font-weight:800;padding:6px 8px;cursor:pointer;text-align:center}
.t0x-binhead small{display:block;font-weight:600;font-size:var(--text-xs)}
.t0x-bincards{display:flex;flex-wrap:wrap;gap:6px;margin-top:var(--space-2)}
`;
  if (!document.getElementById('t0x-sort-css')) { const s = document.createElement('style'); s.id = 't0x-sort-css'; s.textContent = css; document.head.append(s); }
  T0.registerEx('ex.sort_bins', { render });
})();
