#!/bin/bash
# Chạy thử chuyen_db.py trên dump giả trong mau-thu/ (không chạm db thật). Kết quả: mau-thu/ra-<cuon>/
cd "$(dirname "$0")"
for c in kimyo8 biologiya5 adabiyot5 matematika5; do python3 -I chuyen_db.py --cuon $c --dump mau-thu/$c.json --ra mau-thu/ra-$c || exit 1; done
