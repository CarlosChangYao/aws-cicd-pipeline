#!/bin/bash
# 把警語移除，回到基準狀態（重新演練用）
cd "$(dirname "$0")" || exit 1
python3 - <<'PY'
p = 'app/app.py'
s = open(p, encoding='utf-8').read()
line = '  <div class="notice">⚠ 依主管機關規定：本頁資訊僅供參考，不構成投資建議。投資人應自行審慎評估，並詳閱公開說明書。</div>\n'
if line in s:
    open(p, 'w', encoding='utf-8').write(s.replace(line, ''))
    print('已還原到基準狀態（沒有警語）。')
else:
    print('本來就是基準狀態，不用還原。')
PY
