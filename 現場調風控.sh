#!/bin/bash
# 【故事 A · 黑天鵝】盤中極端波動，風控單位緊急調降單筆委託上限
cd "$(dirname "$0")" || exit 1
python3 - <<'PY'
import re
p = 'app/app.py'
s = open(p, encoding='utf-8').read()
# 用行首錨定，避免誤改到 NORMAL_ORDER_LIMIT
new, n = re.subn(r'^ORDER_LIMIT = 500000', 'ORDER_LIMIT = 100000', s, flags=re.M)
if n:
    open(p, 'w', encoding='utf-8').write(new)
    print('單筆委託上限已從 500,000 緊急調降為 100,000。')
else:
    print('目前不是 500000。要重新演練請先執行：bash 現場還原.sh')
PY
find . -name __pycache__ -type d -exec rm -rf {} + 2>/dev/null
echo
echo "============ 這次改了什麼 ============"
git --no-pager diff --unified=0 -- app/app.py | grep -E "^[+-][^+-]" | sed -e 's/^+/  新增  /' -e 's/^-/  刪除  /'
echo "======================================"
echo
python3 - <<'PY'
import re
s = open('app/app.py', encoding='utf-8').read()
g = lambda k: int(re.search(rf'^{k} = (\d+)', s, re.M).group(1))
cur, normal = g('ORDER_LIMIT'), g('NORMAL_ORDER_LIMIT')
print(f'  現行上限 NT$ {cur:,} ／ 平時上限 NT$ {normal:,}')
print(f'  風控狀態：{"加強中（畫面會變紅）" if cur < normal else "正常"}')
PY
