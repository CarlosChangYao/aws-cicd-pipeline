#!/bin/bash
# 【故事 A · 法遵】主管機關要求所有頁面加註風險警語
cd "$(dirname "$0")" || exit 1
python3 - <<'PY'
p = 'app/app.py'
s = open(p, encoding='utf-8').read()
line = '  <div class="notice">⚠ 依主管機關規定：本頁試算僅供參考，不構成投資建議。實際費用以交易當日為準，投資人應詳閱公開說明書。</div>\n'
if line in s:
    print('警語已經在裡面了。要重新演練請先執行：bash 現場還原.sh')
else:
    s = s.replace('  <dl class="biz">', line + '  <dl class="biz">')
    open(p, 'w', encoding='utf-8').write(s)
    print('已加入一行風險警語。')
PY
echo
echo "============ 這次改了什麼 ============"
git --no-pager diff --unified=0 -- app/app.py | grep -E "^[+-][^+-]" | sed -e 's/^+/  新增  /' -e 's/^-/  刪除  /'
echo "======================================"
