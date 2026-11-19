/* ex.oral_recording — ghi âm bài nói (agent C, đề xuất 003; ghi âm có chấm là đề xuất 040, đợt sau).
 * Dữ liệu: title/prompt (core vẽ), task_kind, paras[] (tùy chọn).
 * Ghi bằng MediaRecorder (nếu trình duyệt cho dùng micro), không được thì chọn tệp audio (capture). Tệp chỉ phát lại cục bộ,
 *   KHÔNG lưu, không gửi; chỉ lưu {done: bool}. Không chấm / giáo viên chấm (v1): Kiểm tra = Lưu. */
(function () {
  const T0 = window.T0;
  function render(el, ex, ctx) {
    const U = T0.exu; const E = U.el;
    const kind = ex.task_kind || (ex.data && ex.data.kind);
    if (kind && T0.s('exc_kind_' + kind) !== 'exc_kind_' + kind) el.append(E('p', { style: { margin: '0 0 var(--space-2,8px)' } }, E('span', { class: 'exc-tag', text: T0.s('exc_kind_' + kind) })));
    (ex.paras || (ex.data && ex.data.paras) || []).forEach((p) => el.append(E('p', { class: 'exc-qt', text: T0.t(p) })));
    const st = U.store(ctx, ex);
    let done = !!(st.get({}) || {}).done;
    const row = E('div', { class: 'exc-chips', style: { alignItems: 'center', marginBottom: 'var(--space-2,8px)' } });
    const rec = E('button', { type: 'button', class: 't0-btn primary' }, '● ' + U.s('exc_rec'));
    const fileIn = E('input', { type: 'file', accept: 'audio/*', capture: '', hidden: true });
    const fileBtn = E('button', { type: 'button', class: 't0-btn' }, U.s('exc_file'));
    fileBtn.onclick = () => fileIn.click();
    const status = E('span', { class: 'exc-hint', role: 'status', style: { margin: 0 } });
    row.append(rec, fileBtn, status, fileIn);
    const audio = E('audio', { controls: true, hidden: true, style: { width: '100%', margin: 'var(--space-2,8px) 0' } });
    const note = E('p', { class: 'exc-hint', text: U.s('exc_rec_local') });
    const doneBtn = E('button', { type: 'button', class: 'exc-check', role: 'checkbox', 'aria-checked': String(done) }, E('span', { class: 'box', 'aria-hidden': 'true' }), E('span', { text: U.s('exc_done') }));
    doneBtn.onclick = () => setDone(!done);
    el.append(row, audio, note, doneBtn);
    let url = null, mr = null, stream = null, chunks = [];
    function setDone(v) { done = v; st.set({ done }); doneBtn.setAttribute('aria-checked', String(done)); }
    function show(blob) {
      if (url) URL.revokeObjectURL(url);
      url = URL.createObjectURL(blob); audio.src = url; audio.hidden = false;
      if (!done) setDone(true);
    }
    fileIn.onchange = () => { const f = fileIn.files && fileIn.files[0]; if (f) show(f); };
    const canRec = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
    if (!canRec) { rec.disabled = true; status.textContent = U.s('exc_no_mic'); }
    rec.onclick = async () => {
      if (mr && mr.state === 'recording') { mr.stop(); return; }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        chunks = []; mr = new MediaRecorder(stream);
        mr.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
        mr.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          rec.textContent = '● ' + U.s('exc_rec'); status.textContent = '';
          if (chunks.length) show(new Blob(chunks, { type: chunks[0].type || 'audio/webm' }));
        };
        mr.start(); rec.textContent = '■ ' + U.s('exc_stop'); status.textContent = U.s('exc_recording');
      } catch (e) { status.textContent = U.s('exc_no_mic'); }
    };
    return {
      noCheck: true,
      check() { return done ? { ok: null, feedback: T0.s('saved') } : { empty: true, feedback: U.s('exc_done') + '?' }; },
      reset() { setDone(false); audio.hidden = true; if (url) { URL.revokeObjectURL(url); url = null; } },
      unmount() { try { mr && mr.state === 'recording' && mr.stop(); } catch (e) { /* */ } if (url) URL.revokeObjectURL(url); },
    };
  }
  T0.registerEx('ex.oral_recording', { render });
})();
