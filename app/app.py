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

PAGE = """<!doctype html>
<meta charset="utf-8">
<title>CI/CD 演化闖關</title>
<style>
  body {{ font-family: ui-monospace, Menlo, monospace; background: #0f172a;
         color: #e2e8f0; display: grid; place-items: center; height: 100vh; margin: 0; }}
  .card {{ background: #1e293b; padding: 2.5rem 3rem; border-radius: 12px;
           border: 1px solid #334155; }}
  h1 {{ font-size: 1.1rem; color: #94a3b8; font-weight: 500; margin: 0 0 1.5rem; }}
  .v {{ font-size: 2.5rem; color: #38bdf8; margin: 0 0 1.5rem; }}
  dl {{ display: grid; grid-template-columns: auto auto; gap: .5rem 1.5rem;
        margin: 0; font-size: .9rem; }}
  dt {{ color: #64748b; }}
  dd {{ margin: 0; }}
  /* 主管機關要求的風險警語樣式 */
  .notice {{ background: #422006; border: 1px solid #a16207; color: #fde68a;
             padding: .8rem 1rem; border-radius: 8px; margin: 0 0 1.5rem;
             font-size: .78rem; line-height: 1.7; max-width: 30rem; }}
</style>
<div class="card">
  <h1>NKC202 期末專題 · P3 CI/CD 演化闖關</h1>
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
