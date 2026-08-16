# ─────────────────────────────────────────────────────────────
# 關 1：把「程式 + 執行環境」整包打成一個映像檔
#
# 這份 Dockerfile 直接對應關 0 記錄的痛點：
#   關 0 的問題                         這裡怎麼解
#   ─────────────────────────           ──────────────────────
#   程式碼要手貼，會貼壞          →     COPY，檔案完整複製
#   要自己建 venv、裝套件          →     RUN pip install，寫死在映像檔裡
#   換台機器就要重做一次           →     同一個映像檔到哪都一樣
#   不知道跑的是哪一版             →     ARG/ENV 把版本資訊烤進映像檔
# ─────────────────────────────────────────────────────────────

# 用官方的 Python slim 映像檔當底。
# 選 slim 而非完整版：完整版約 1GB，slim 約 150MB。
# 映像檔越小，推送到 ECR 越快、EC2 拉取越快、儲存費越省。
FROM python:3.11-slim

# 版本資訊由 build 時傳入。
# 關 1 還是人工帶入，關 2 之後會由 GitHub Actions 自動用 git commit 帶入
# —— 那時候「網頁顯示的版本」與「實際程式碼」就再也不可能對不上。
ARG BUILD_VERSION=v0.0.0-unknown
ARG GIT_COMMIT=unknown
ARG DEPLOYED_AT=unknown
ENV BUILD_VERSION=$BUILD_VERSION \
    GIT_COMMIT=$GIT_COMMIT \
    DEPLOYED_AT=$DEPLOYED_AT \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# 先只複製套件清單再安裝，最後才複製程式碼。
# 這是為了利用 Docker 的「層快取」：
# 改程式碼時 requirements.txt 沒變，這一層就直接沿用快取，
# 不必每次重新下載套件。build 時間從數十秒降到數秒。
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

# 建立非 root 使用者來跑應用。
# 容器預設用 root 執行，萬一應用被入侵，攻擊者就是容器內的 root。
# 這是最小權限原則在容器層的實作（評分維度③）。
RUN useradd --create-home --shell /bin/bash appuser \
    && chown -R appuser:appuser /app
USER appuser

# 容器內部監聽 8080 而非 80。
# 原因：Linux 規定 1024 以下的 port 需要 root 權限才能綁定，
# 而我們刻意用非 root 執行。對外仍是 80 —— 靠 docker run 的 -p 80:8080 對應。
EXPOSE 8080

# 容器層的健康檢查。Docker 會定期打 /healthz，
# 失敗時把容器標記為 unhealthy。關 4 上 ECS 時會用到同一個端點。
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://localhost:8080/healthz').status==200 else 1)"

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "2", "app:app"]
