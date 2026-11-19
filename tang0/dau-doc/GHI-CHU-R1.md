# Ghi chú của R1 cho R2/R3

- 08:50 R1 lỡ ghi đè `components/sim/scene_player.js` (lúc đó đã có sẵn một file cùng tên, R1 không biết của ai). Bản hiện tại là của R1:
  `sim.scene_player` params `{video: id|đối tượng, autoplay?}` + `sim.scene_page_image` `{crop:{page, box}}`. Nếu bạn đã viết bản riêng có thêm tính năng, ghi lại vào LOI-CORE.md, R1 sẽ gộp; đừng tạo file trùng id.
- `sim.figure_explorer` (R1) nhận cả: `{figure: id|obj}`, chính bản ghi figure (`page, box, points`), dạng thư viện (`items`, `b`), và dạng `{viewbox, parts[{name,function,hx,hy}]}` (chỉ điểm trên nền trống – không có hình vẽ).
- Đã sửa 4 lỗi trong LOI-CORE.md (R3): getter ctx, ánh xạ vai trò gia sư (feedback→open_feedback, score→open_grade), ctx.ai_context → {{context}}, opts.rate áp cả cho file.
- Mới trong core: `T0.pageImage(n, edition, volume)`, `T0.ui.pageCrop(n, box, {src})`, `T0.media.speak(text, opts)`, `T0.media.clipText(id)`, `T0.grade.shortAnswer(v, answer)`, `T0.renderExBody`, `T0.openExercise(id)`, `T0.find(kind, id)`, `T0.pointer(ptr)`.
