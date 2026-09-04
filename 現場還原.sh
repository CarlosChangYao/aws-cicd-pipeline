#!/bin/bash
# 回到基準狀態（重新演練用）
cd "$(dirname "$0")" || exit 1
git checkout -- app/app.py 2>/dev/null
find . -name __pycache__ -type d -exec rm -rf {} + 2>/dev/null
python3 - <<'PY'
import re
s = open('app/app.py', encoding='utf-8').read()
g = lambda k: float(re.search(rf'^{k} = ([\d.]+)', s, re.M).group(1))
amt, rate, disc = g('MONTHLY_AMOUNT'), g('FEE_RATE'), g('FEE_DISCOUNT')
cur, normal = g('ORDER_LIMIT'), g('NORMAL_ORDER_LIMIT')
warn = '有（異常）' if 'class="notice">' in s else '無'
print('目前狀態 ──')
print(f'  警語　　　：{warn}')
print(f'  優惠折扣　：{disc*10:g} 折（手續費 NT$ {max(1, round(amt*rate*disc))}）')
print(f'  委託上限　：NT$ {cur:,.0f}　風控：{"加強中" if cur < normal else "正常"}')
PY
