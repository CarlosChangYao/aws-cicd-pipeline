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
# 直接讀原始碼算，不 import —— 避免 .pyc 快取拿到舊值
python3 - <<'PY'
import re
s = open('app/app.py', encoding='utf-8').read()
g = lambda k: float(re.search(rf'^{k} = ([\d.]+)', s, re.M).group(1))
amt, rate, disc = g('MONTHLY_AMOUNT'), g('FEE_RATE'), g('FEE_DISCOUNT')
print(f'  手續費：{amt:,.0f} x {rate*100:g}% x {disc*10:g}折 = NT$ {max(1, round(amt*rate*disc))}')
PY
