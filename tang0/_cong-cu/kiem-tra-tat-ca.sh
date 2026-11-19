#!/usr/bin/env bash
# Chay toan bo bo kiem tra tang 0 (v0.9.0) va in tong ket. Ma thoat 0 = tat ca DAT.
# Dung: bash _cong-cu/kiem-tra-tat-ca.sh            (tu bat ky dau)
#       bash _cong-cu/kiem-tra-tat-ca.sh --day-du    (them: dung lai dau doc build.py; Playwright neu co thu-d2.js)
T="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG="$(mktemp -d)"
declare -a TEN KQ
chay() {  # chay <ten> <thu muc> <lenh...>
  local ten="$1" dir="$2"; shift 2
  local f="$LOG/$(echo "$ten" | tr ' /' '__').log"
  if (cd "$T/$dir" && "$@") >"$f" 2>&1; then KQ+=("DAT"); else KQ+=("KHONG DAT"); fi
  TEN+=("$ten")
  printf '%-34s %-10s %s\n' "$ten" "${KQ[-1]}" "$(grep -v '^\s*$' "$f" | tail -1 | cut -c1-90)"
}
echo "== Tang 0 – kiem tra tat ca ($(date -u +%Y-%m-%dT%H:%MZ))"
chay "schema/kiem-tra.py"            schema            python3 -I kiem-tra.py
chay "bai-tap/kiem_tra.py"           thu-vien/bai-tap  python3 -I kiem_tra.py
chay "gia-su/kiem-tra-loi-nhac --html" gia-su          python3 -I kiem-tra-loi-nhac.py --html
chay "_cong-cu/kiem-tra-truc.py"     .                 python3 -I _cong-cu/kiem-tra-truc.py
chay "_cong-cu/sinh-enum.py --kiem"  .                 python3 -I _cong-cu/sinh-enum.py --kiem
chay "nha-may-media/kiem-tra.py"     nha-may-media     python3 -I _cong-cu/kiem-tra.py
if [ "$1" = "--day-du" ]; then
  chay "dau-doc/build.py"            dau-doc           python3 -I build.py
  if command -v node >/dev/null 2>&1; then
    # dist/index.html: khong loi console, anh '@ru_pages/', cham accept_v2, cell_options, id ben (Playwright)
    chay "dau-doc dist (Playwright)"   dau-doc           bash -c 'out=$(NODE_PATH=$(npm root -g) node _thu/thu-d2.js dist/index.html) || exit 1; echo "$out"; echo "$out" | grep -q "^ERR \[\]$"'
  fi
fi
n_loi=0
for k in "${KQ[@]}"; do [ "$k" = "DAT" ] || n_loi=$((n_loi+1)); done
echo "--"
echo "TONG KET: $(( ${#KQ[@]} - n_loi ))/${#KQ[@]} bo kiem tra DAT; nhat ky: $LOG"
[ "$n_loi" -eq 0 ] && echo "KET QUA: DAT" || echo "KET QUA: KHONG DAT"
exit $n_loi
