# 044 – Thư viện trò chơi lớp, vận động theo lời (TPR), trò chơi thẻ nhóm

**Ưu tiên:** P2 · **Độ khó:** vừa · **Phụ thuộc:** [026](026-thu-vien-phuong-phap-va-du-an.md), [027](027-che-do-giao-an-trinh-chieu.md) · **Số chỗ thiếu thô gộp vào:** 6

## Thay đổi gì
- `sim.class_game` có tham số: `rule: bingo|snowball|simon_says|look_and_guess|backdrawing|card_flip|kubik|domino|teskari_test`, `items[]` (từ/tranh/thẻ), `teams?`, `scoring?` – chơi một máy (HS) hoặc chiếu bảng (GV, 027).
- `ex.reverse_test` ("Teskari test": cho đáp án, HS viết câu hỏi; chấm AI gợi ý + GV) nằm trong `teskari_test`.
- TPR: khái niệm bộ mục `tpr_movement` (063) + video/hoạt hình làm mẫu + lệnh audio, chấm `ex.mark_done`.

## Vì sao + bằng chứng
ingliz2_darslik C9 (Bingo tr.13, Snowball tr.10, Simon says tr.83, bàn cờ tr.41, 73), C10 (tr.10, 14, 6), M3; geografiya7_metodika C5 (tr.153), C6 (thẻ nhóm tr.112), M1; onatili3_metodika C5 (thi đua 2 nhóm tr.10).

## Ảnh hưởng cuốn nào
- **7 cuốn đã chuyển:** không cuốn nào phải sửa dữ liệu.
- **Loại sách mới:** ingliz2_darslik, geografiya7_metodika, onatili3_metodika.
- **Nguồn đã nêu chỗ thiếu này:** geografiya7_metodika, ingliz2_darslik

## Tương thích ngược
Có.

## Độ khó / Ưu tiên / Phụ thuộc
- Độ khó: vừa
- Ưu tiên: P2
- Phụ thuộc: [026](026-thu-vien-phuong-phap-va-du-an.md), [027](027-che-do-giao-an-trinh-chieu.md)

## Cần người quyết
Không. Áp dụng được khi D3 thông qua danh sách.

## Chỗ thiếu thô đã gộp (dòng trong `tong-hop-cho-thieu.csv`)
| stt | nguồn | loại | id gốc | mô tả (rút gọn) |
|---|---|---|---|---|
| 206 | geografiya7_metodika | ex | ex.reverse_test | 'Teskari test': cho sẵn các đáp án, HS viết câu hỏi tương ứng; chấm bằng AI/GV. |
| 207 | geografiya7_metodika | sim | ex.group_card_game | Trò chơi thẻ theo nhóm (lật thẻ tên – nhóm nói 5 sự kiện, rồi 5 câu test) và 'Kubik', 'Domino' – hoạt động lớp có điểm nhóm; bản số có thể … |
| 212 | geografiya7_metodika | media | media_dac_thu[1] | thẻ hoạt động nhóm |
| 250 | ingliz2_darslik | sim | ex.speaking_game | Trò chơi lời nói theo luật cố định (Bingo, Snowball, Simon says, I can say…, Backdrawing, Look and guess) – hiện chỉ map được ex.mark_done.… |
| 251 | ingliz2_darslik | truc | tpr_movement | Bộ mục 'jismoniy mashqlar' – vận động theo lời (TPR): trẻ làm theo lệnh 'Jump', '1,2,3 – hop!', 'Look and do'. Bản số: video/hoạt hình làm … |
| 261 | ingliz2_darslik | media | media_dac_thu[3] | Hoạt hình/video làm mẫu động tác TPR |
