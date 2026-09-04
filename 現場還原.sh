#!/bin/bash
# 回到基準狀態（重新演練用）
cd "$(dirname "$0")" || exit 1
git checkout -- app/app.py 2>/dev/null
python3 -c "
import sys; sys.path.insert(0,'app')
import app as m
has = 'class=\"notice\">' in m.PAGE
print('已還原：警語', '仍在（異常）' if has else '無', '｜折扣', f'{m.FEE_DISCOUNT*10:g} 折', '｜手續費 NT\$', m.calc_fee())
"
