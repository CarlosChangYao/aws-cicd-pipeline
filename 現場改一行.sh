#!/bin/bash
# 9/5 驗收現場 Demo
# 情境：主管機關要求所有頁面加註風險警語
cd "$(dirname "$0")" || exit 1

python3 - <<'PY'
p = 'app/app.py'
s = open(p, encoding='utf-8').read()
line = '  <div class="notice">⚠ 依主管機關規定：本頁資訊僅供參考，不構成投資建議。投資人應自行審慎評估，並詳閱公開說明書。</div>\n'
if line in s:
    print('警語已經在裡面了，不重複加。')
    print('（若要重新演練，先執行 bash 現場還原.sh）')
else:
    s = s.replace('  <p class="v">', line + '  <p class="v">')
    open(p, 'w', encoding='utf-8').write(s)
    print('已加入一行風險警語。')
PY

echo
echo "================ 這次改動的內容 ================"
git --no-pager diff --unified=0 -- app/app.py | grep -E "^\+[^+]" | sed 's/^+/  新增: /'
echo "================================================"
