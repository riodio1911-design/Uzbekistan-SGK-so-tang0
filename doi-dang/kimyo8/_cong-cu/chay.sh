#!/bin/sh
# Chạy lại toàn bộ đối chiếu kimyo8. R = thư mục scratchpad gốc.
R=${R:-$(cd "$(dirname "$0")/../../.." && pwd)}
D=$R/doi-dang/kimyo8
python3 -I $D/_cong-cu/tach_cu.py $R/fix/kimyo8/index.html $D/_tmp      # tách mã bản cũ để đọc
cp $R/fix/kimyo8/index.html $D/_cu/index.html                            # bản cũ + ảnh/audio mẫu trong _cu/
(cd $D/_cu && python3 -m http.server 8701 >/dev/null 2>&1) & P1=$!
(cd $R/tang0/dau-doc/dist/kimyo8 && python3 -m http.server 8702 >/dev/null 2>&1) & P2=$!
sleep 1
node $D/_cong-cu/chay.js "$1"                                            # ảnh + _anh/do.json
python3 -I $D/_cong-cu/sinh_csv.py                                        # bang-doi-dang.csv
node $D/_cong-cu/chay-v2.js "$1"                                         # v2: _anh/v2/
node $D/_cong-cu/do-them-v2.js                                           # đo bổ sung v2 (audio mặc định, onRoute, tự luận)
python3 -I $D/_cong-cu/sinh_csv_v2.py                                     # bang-doi-dang-v2.csv
kill $P1 $P2
