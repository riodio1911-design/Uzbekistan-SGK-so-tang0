# Bị chặn mạng – chưa sinh được giọng tiếng Nga Kimyo 8

- Thời điểm: 21/11/2026 (lượt chạy theo lịch, trên máy đám mây)
- Host bị chặn: `translate.google.com:443` (gTTS cần host này)
- Lệnh kiểm tra: `curl -sS -o /dev/null -w "%{http_code}" https://translate.google.com/`
- Kết quả: `curl: (56) CONNECT tunnel failed, response 403` — proxy ra ngoài từ chối kết nối (connect_rejected, HTTP 403), tức host không nằm trong danh sách cho phép của phiên.

## Cách gỡ
Thêm `translate.google.com` vào danh sách domain được phép trên claude.ai (trình duyệt web):
Settings > Capabilities (gói cá nhân trả phí) hoặc Organization settings > Capabilities (Team/Enterprise).
Sau đó chạy lại tác vụ theo lịch; script `tang0/nha-may-media/sinh-giong-gtts.py` sẽ chạy từ đầu.

Chưa có cảnh nào được sinh (0/754).

## Lần chạy lại 2026-11-21 06:47 UTC
Vẫn bị chặn: `curl: (56) CONNECT tunnel failed, response 403` tới `translate.google.com:443`. 0/754 cảnh.
