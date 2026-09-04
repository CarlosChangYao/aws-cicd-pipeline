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
warn = '有（異常，應該要沒有）' if 'class="notice">' in s else '無'
print(f'已還原 ── 警語：{warn} ｜ 折扣：{disc*10:g} 折 ｜ 手續費：NT$ {max(1, round(amt*rate*disc))}')
PY
