#!/bin/bash
# 【故事 B · 業務邏輯】業務單位要求把定期定額手續費優惠從 6 折調到 5 折
cd "$(dirname "$0")" || exit 1
python3 - <<'PY'
p = 'app/app.py'
s = open(p, encoding='utf-8').read()
if 'FEE_DISCOUNT = 0.6' in s:
    open(p, 'w', encoding='utf-8').write(s.replace('FEE_DISCOUNT = 0.6', 'FEE_DISCOUNT = 0.5'))
    print('折扣已從 6 折改為 5 折。')
else:
    print('折扣不是 0.6。要重新演練請先執行：bash 現場還原.sh')
PY
echo
echo "============ 這次改了什麼 ============"
git --no-pager diff --unified=0 -- app/app.py | grep -E "^[+-][^+-]" | sed -e 's/^+/  新增  /' -e 's/^-/  刪除  /'
echo "======================================"
echo
python3 -c "
import sys; sys.path.insert(0,'app')
import app as m
print(f'  手續費：{m.MONTHLY_AMOUNT:,} x {m.FEE_RATE*100:g}% x {m.FEE_DISCOUNT*10:g}折 = NT\$ {m.calc_fee()}')
"
