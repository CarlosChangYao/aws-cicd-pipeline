# 9/5 驗收 Demo 腳本

> 當天翻開這份照做即可，不需要背。
> 所有指令都可以直接複製貼上。

---

## 一、前一天（9/4）晚上必做

**這一步不能省。** 最常見的翻車原因是「當天才發現機器關了」。

### 1. 確認雲端資源都活著

```bash
export AWS_PROFILE=nkc202 AWS_DEFAULT_REGION=ap-northeast-1
aws ec2 describe-instances --instance-ids i-0937ad0e32c5fedca \
  --query 'Reservations[0].Instances[0].State.Name' --output text
aws ecs describe-services --cluster nkc202-cicd-cluster --services nkc202-cicd-service \
  --query 'services[0].[status,runningCount]' --output text
```

**期望結果：** `running` ／ `ACTIVE  2`

若 EC2 是 `stopped`，開機並等兩分鐘：

```bash
aws ec2 start-instances --instance-ids i-0937ad0e32c5fedca
```

### 2. 實際打一次兩個網址

```bash
curl -s http://52.199.107.190/healthz; echo
curl -s http://nkc202-cicd-alb-1176135322.ap-northeast-1.elb.amazonaws.com/healthz; echo
```

兩個都要回 `{"status":"ok","version":"..."}`。

### 3. 完整跑一次流水線（確認端到端沒問題）

```bash
cd ~/Desktop/Tibame/專題
git commit --allow-empty -m "驗收前測試：確認流水線正常"
git push origin main
```

到 https://github.com/CarlosChangYao/aws-cicd-pipeline/actions 確認四個 job 全綠。

### 4. 想好當天要改哪一行

建議改 `app/app.py` 第 31 行的標題文字，因為**改動會直接顯示在網頁上**，觀眾一眼就看得到：

```python
  <h1>NKC202 期末專題 · P3 CI/CD 演化闖關</h1>
```

當天改成（加上日期即可）：

```python
  <h1>NKC202 期末專題 · P3 CI/CD 演化闖關（9/5 現場 Demo）</h1>
```

---

## 二、當天開場前 5 分鐘

### 瀏覽器先開好這四個分頁，依序排列

| # | 分頁 | 網址 |
|---|---|---|
| 1 | 線上網站（EC2） | http://52.199.107.190 |
| 2 | 線上網站（ECS + ALB） | http://nkc202-cicd-alb-1176135322.ap-northeast-1.elb.amazonaws.com |
| 3 | GitHub Actions | https://github.com/CarlosChangYao/aws-cicd-pipeline/actions |
| 4 | GitHub Repo 首頁 | https://github.com/CarlosChangYao/aws-cicd-pipeline |

### 終端機先跑好這行（環境變數不會跨視窗，一定要先跑）

```bash
export AWS_PROFILE=nkc202 AWS_DEFAULT_REGION=ap-northeast-1 && cd ~/Desktop/Tibame/專題 && git pull -q && echo READY
```

### 編輯器打開 `app/app.py`，游標停在第 31 行

---

## 三、Demo 腳本

> **時間規劃：** 驗收通常 12–15 分鐘，簡報約佔 9 分鐘，Demo 約 4 分鐘。
> **段落一必做（Live）；段落二、三時間夠才 Live，否則用今天的實測數據講。**

---

### 段落一：改一行程式碼 → 自動上線（Live，約 3 分半）

**這是主秀，一定要現場做。**

#### ① 先讓大家看現在的版本（分頁 1）

> 「這是現在線上的網站。請大家記一下版本號——**v1.2.20-ci**，還有下面這個 Git Commit 編號。」

#### ② 切到編輯器，改一行

> 「我現在改一行程式碼，在標題後面加上今天的日期。」

（改完存檔）

#### ③ 回終端機，push

```bash
git add -A && git commit -m "9/5 驗收現場 Demo" && git push origin main
```

> 「這是我今天唯一會做的人工動作。接下來我不會再碰任何東西。」

#### ④ 立刻切到分頁 3（Actions）

> 「流水線已經自己啟動了。大家看這四個階段——
> 第一個是**測試**，測試不過的話後面完全不會執行；
> 第二個是**建置映像檔**並推上 AWS 的映像檔倉庫；
> 第三、第四個是**部署**，一個部署到 EC2、一個部署到 ECS，兩個平行進行。」

（等待約 80 秒。這段時間可以講下面這幾句填空檔）

> **填空檔的話術：**
> 「這 80 秒裡面，版本號是機器自動產生的，用的是這次 commit 的編號加上流水線的執行序號，我完全沒有介入的機會。
> 另外整個過程沒有用到任何一組 AWS 的長期金鑰——GitHub 是用 OIDC 換一小時就失效的臨時憑證。
> 部署到主機也不是用 SSH，那台機器連 22 port 都沒開，sshd 也被我停掉了。」

#### ⑤ 四個 job 全綠後，回分頁 1 重整

> 「版本號變了。從 v1.2.20 變成 v1.2.21。」

#### ⑥ 對照 commit（關鍵的一步，不要跳過）

```bash
git log --oneline -1
```

> 「網頁上顯示的 Git Commit，跟我本機最新的 commit 完全一樣。
> 這代表**線上跑的到底是哪一版程式碼，是百分之百確定的事**。
> 對照我報告裡關 0 的手動部署——那時候這一格只能填 `none-manual-deploy`，因為手動部署根本不知道自己在部署哪一版。」

#### ⑦ 補一句 ECS（切分頁 2）

> 「另外這個網址是 ECS 的版本，剛才同一次 push 也一併更新了。」

---

### 段落二：測試守門（時間夠才 Live，約 3 分鐘）

**若時間不夠，改用今天的實測結果講述 + 展示 Actions 歷史紀錄。**

#### Live 版本

```bash
# 把測試改壞（把 200 改成 201）
sed -i '' 's/    assert resp.status_code == 200$/    assert resp.status_code == 201/' app/test_app.py
git add -A && git commit -m "Demo：故意讓測試失敗" && git push origin main
```

> 「我現在故意把測試寫錯，讓它預期一個不可能的結果，然後 push 上去。」

（等約 40 秒，Actions 出現紅燈）

> 「大家看——**第一個 job 紅燈，後面三個直接標成 skipped，完全沒有執行**。」

（回分頁 1 重整）

> 「而線上的版本**完全沒有變**。壞掉的程式碼連映像檔倉庫都沒有進去，更不可能到線上。
>
> 這在技術上叫持續整合，但用金融業的語言來說，這是**自動化的內控關卡**。
> 以前變更管理靠人簽核、靠人記得檢查；現在是機器強制執行，繞不過去。」

**修回來：**

```bash
sed -i '' 's/    assert resp.status_code == 201$/    assert resp.status_code == 200/' app/test_app.py
git add -A && git commit -m "修復測試" && git push origin main
```

#### 講述版本（時間不夠時用）

切到 Actions 頁面，指著歷史紀錄裡的紅色項目：

> 「這些紅色的是我實際演練過的。8/16 那次我故意把測試改壞，結果是：測試 job 紅燈，後面三個 job 全部 skipped，線上版本完全沒動，ECR 也沒有新映像檔進去。詳細紀錄在報告第六章。」

---

### 段落三：回滾（時間夠才 Live，約 2 分半）

> 「最後示範回滾。假設剛才那版上線後發現問題，要退回舊版。」

```bash
export AWS_PROFILE=nkc202 AWS_DEFAULT_REGION=ap-northeast-1
ECR=265311920986.dkr.ecr.ap-northeast-1.amazonaws.com
OLD=f7f62d4          # ← 當天先用下面的指令確認一個實際存在的舊 SHA

aws ssm send-command --instance-ids i-0937ad0e32c5fedca \
  --document-name AWS-RunShellScript --comment "Rollback demo" \
  --parameters "commands=[\"aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin $ECR\",\"docker pull $ECR/nkc202-cicd-app:$OLD\",\"docker rm -f nkc202app || true\",\"docker run -d --name nkc202app --restart always -p 80:8080 $ECR/nkc202-cicd-app:$OLD\"]" \
  --query 'Command.CommandId' --output text
```

**當天先查可用的舊版本：**

```bash
aws ecr describe-images --repository-name nkc202-cicd-app \
  --query 'sort_by(imageDetails,&imagePushedAt)[-6:].imageTags' --output text
```

（等約 30 秒，重整分頁 1）

> 「版本號退回去了。
>
> 這件事之所以做得到，是因為我在設計時**刻意讓部署指定 commit 編號，而不是用 latest**。
> latest 會被後面的建置覆蓋，只有 commit 編號能永久對應到那一版程式碼。
>
> 在金融業，這對應到**營運持續**——出事時的復原時間，從小時級降到分鐘級。」

**復原到最新版：**

```bash
git commit --allow-empty -m "復原至最新版" && git push origin main
```

---

## 四、可能出錯的狀況與應變

| 狀況 | 應變 |
|---|---|
| **網站打不開** | 先確認 EC2 是否 running（`aws ec2 describe-instances`）。若是 stopped，`start-instances` 後等 2 分鐘。**改用 ECS 那個網址繼續 Demo**，它跟 EC2 是獨立的 |
| **Actions 卡住不動** | 到 Actions 頁面按 `Re-run all jobs`。同時改用「講述版本」，指著歷史紀錄說明 |
| **push 被拒絕** | 先 `git pull --rebase` 再 push |
| **80 秒等太久，場面尷尬** | 用上面準備好的「填空檔話術」。或先切到分頁 4 展示 repo 結構、架構圖 |
| **老師問「這樣要花多少錢」** | 「開發階段幾乎都在免費額度內。目前主要成本是負載平衡器和 Fargate，約每天 1.3 美元。我有設 Budgets 告警，驗收後會把資源全部清除。」 |
| **老師問「為什麼不做關 5」** | 翻到簡報第 12 頁，照著講稿講評估過程 |
| **完全跑不起來** | 打開報告第三章與證據截圖，用今天實測的數據講。**所有數字都有截圖佐證，不是憑空講的** |

---

## 五、驗收後（9/5 當天結束後）

**確認不再需要 Demo 之後**，執行資源清除（檢核點 #30）：

```bash
export AWS_PROFILE=nkc202 AWS_DEFAULT_REGION=ap-northeast-1
aws cloudformation delete-stack --stack-name nkc202-cicd-ecs
aws cloudformation wait stack-delete-complete --stack-name nkc202-cicd-ecs
aws cloudformation delete-stack --stack-name nkc202-cicd-base
aws cloudformation wait stack-delete-complete --stack-name nkc202-cicd-base
```

**清除後截圖存證**（檢核點 #30 的證據）：

```bash
aws cloudformation describe-stacks --stack-name nkc202-cicd-base 2>&1 | tail -2
aws ec2 describe-instances --instance-ids i-0937ad0e32c5fedca \
  --query 'Reservations[0].Instances[0].State.Name' --output text
```

回報 `does not exist` 與 `terminated` 即為完成。

> ⚠️ **9/7 報告繳交前不要清除**，萬一老師要看線上服務就沒了。
> 建議 9/7 交完報告後再執行。
