import os
import socket
from datetime import datetime, timezone

from flask import Flask

app = Flask(__name__)

# 這三個值由部署流程注入。手動部署時是人工填，
# 到了關 2 之後改由 GitHub Actions 自動帶入 —— 這正是本專題要對照的差異。
BUILD_VERSION = os.getenv("BUILD_VERSION", "v0.0.0-local")
GIT_COMMIT = os.getenv("GIT_COMMIT", "unknown")
DEPLOYED_AT = os.getenv("DEPLOYED_AT", "unknown")

# ── 業務參數（示範用，非真實商品）─────────────────────────
# 模擬券商「定期定額」的手續費試算。
# 驗收 Demo 會現場調整 FEE_DISCOUNT，示範一次業務規則變更如何自動上線。
# 風控參數：市場劇烈波動時，風控單位會緊急調降委託上限以控制曝險。
NORMAL_ORDER_LIMIT = 500000   # 平時的單筆委託上限
ORDER_LIMIT = 500000          # 現行上限  ← 風控單位緊急調整的就是這個

MONTHLY_AMOUNT = 10000      # 每月扣款金額
FEE_RATE = 0.001425         # 券商手續費率 0.1425%
FEE_DISCOUNT = 0.6          # 定期定額優惠折扣  ← 業務單位會調整的就是這個
MIN_FEE = 1                 # 最低手續費


def risk_elevated():
    """現行委託上限低於平時水準，代表風控處於加強狀態。

    這是一條判斷，不是一段寫死的文字——只要調整 ORDER_LIMIT，
    畫面上的顏色、標籤、卡片外框都會跟著改變。
    """
    return ORDER_LIMIT < NORMAL_ORDER_LIMIT


def calc_fee():
    """依現行費率與折扣，算出每次扣款的手續費。"""
    return max(MIN_FEE, round(MONTHLY_AMOUNT * FEE_RATE * FEE_DISCOUNT))


PAGE = """<!doctype html>
<meta charset="utf-8">
<title>CI/CD 演化闖關</title>
<style>
  body {{ font-family: ui-monospace, Menlo, monospace; background: #0f172a;
         color: #e2e8f0; display: grid; place-items: center; min-height: 100vh;
         margin: 0; padding: 2rem 1rem; box-sizing: border-box; }}
  .card {{ background: #1e293b; padding: 2.5rem 3rem; border-radius: 12px;
           border: 1px solid #334155; max-width: 34rem; }}
  h1 {{ font-size: .8rem; color: #64748b; font-weight: 500; margin: 0 0 .4rem;
        letter-spacing: .02em; }}
  h2 {{ font-size: 1.15rem; color: #e2e8f0; font-weight: 600; margin: 0 0 1.5rem; }}
  dl {{ display: grid; grid-template-columns: auto auto; gap: .5rem 1.5rem;
        margin: 0; font-size: .9rem; }}
  dt {{ color: #64748b; }}
  dd {{ margin: 0; }}
  .biz {{ font-size: 1rem; gap: .7rem 2rem; margin: 0 0 1.5rem; }}
  .biz .hl {{ color: #38bdf8; font-weight: 600; }}
  hr {{ border: 0; border-top: 1px solid #334155; margin: 1.5rem 0; }}
  .v {{ font-size: 2.2rem; color: #38bdf8; margin: 0 0 1.2rem; }}
  /* 主管機關要求的風險警語樣式 */
  .card.alert {{ border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,.15); }}
  .alarm {{ color: #f87171 !important; }}
  .badge {{ display: inline-block; background: #7f1d1d; border: 1px solid #dc2626;
            color: #fecaca; font-size: .7rem; padding: .15rem .5rem;
            border-radius: 999px; margin-left: .6rem; vertical-align: middle; }}
  .notice {{ background: #422006; border: 1px solid #a16207; color: #fde68a;
             padding: .8rem 1rem; border-radius: 8px; margin: 0 0 1.5rem;
             font-size: .78rem; line-height: 1.7; }}
</style>
<div class="card{alert_cls}">
  <h1>NKC202 期末專題 · P3 CI/CD 演化闖關</h1>
  <h2>定期定額手續費試算（示範）</h2>
  <dl class="biz">
    <dt>每月扣款</dt><dd>NT$ {amount:,}</dd>
    <dt>手續費率</dt><dd>{rate}</dd>
    <dt>優惠折扣</dt><dd class="hl">{discount}</dd>
    <dt>每次手續費</dt><dd class="hl">NT$ {fee}</dd>
    <dt>單筆委託上限</dt><dd class="hl {limit_cls}">NT$ {limit:,}{badge}</dd>
  </dl>
  <hr>
  <p class="v">{version}</p>
  <dl>
    <dt>Git Commit</dt><dd>{commit}</dd>
    <dt>Deployed At</dt><dd>{deployed}</dd>
    <dt>Served By</dt><dd>{host}</dd>
    <dt>Deployed Via</dt><dd>GitHub Actions -> ECR -> SSM (no SSH)</dd>
    <dt>Server Time</dt><dd>{now}</dd>
  </dl>
</div>
"""


@app.route("/")
def index():
    return PAGE.format(
        amount=MONTHLY_AMOUNT,
        rate=f"{FEE_RATE * 100:g}%",
        discount=f"{FEE_DISCOUNT * 10:g} 折",
        fee=calc_fee(),
        limit=ORDER_LIMIT,
        alert_cls=" alert" if risk_elevated() else "",
        limit_cls="alarm" if risk_elevated() else "",
        badge='<span class="badge">⚠ 風控加強中</span>' if risk_elevated() else "",
        version=BUILD_VERSION,
        commit=GIT_COMMIT,
        deployed=DEPLOYED_AT,
        host=socket.gethostname(),
        now=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
    )


@app.route("/healthz")
def healthz():
    """給 ALB / ECS 健康檢查用，關 4 會用到。"""
    return {"status": "ok", "version": BUILD_VERSION}, 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
