const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";           // 13.3 x 7.5
pres.author = "張博堯";
pres.title = "NKC202 期末專題 — AWS CI/CD 演化闖關";

// 配色取自本專題實際做出來的網頁介面，不是隨便挑的
const BG = "0F172A";      // 深藍底
const CARD = "1E293B";    // 卡片
const LINE = "334155";    // 邊框
const SKY = "38BDF8";     // 主色（網頁上版本號的顏色）
const OK = "22C55E";
const WARN = "F59E0B";
const BAD = "EF4444";
const MUTE = "94A3B8";
const TEXT = "E2E8F0";
const LIGHT = "FFFFFF";
const INK = "1E293B";

const F = "Calibri";

// ── 共用元件 ───────────────────────────────────────────────
function darkSlide() {
  const s = pres.addSlide();
  s.background = { color: BG };
  return s;
}
function lightSlide(title, kicker) {
  const s = pres.addSlide();
  s.background = { color: LIGHT };
  if (kicker) {
    s.addText(kicker, {
      x: 0.6, y: 0.42, w: 8, h: 0.3, fontSize: 12, bold: true,
      color: SKY, fontFace: F, charSpacing: 1.5, margin: 0,
    });
  }
  s.addText(title, {
    x: 0.6, y: kicker ? 0.72 : 0.55, w: 12.1, h: 0.7,
    fontSize: 34, bold: true, color: INK, fontFace: F, margin: 0,
  });
  return s;
}
function card(s, x, y, w, h, fill) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.08,
    fill: { color: fill || "F1F5F9" },
    line: { color: "E2E8F0", width: 1 },
  });
}
function statCard(s, x, y, w, num, label, note, color) {
  card(s, x, y, w, 1.85, "F8FAFC");
  s.addText(num, { x: x + 0.05, y: y + 0.18, w: w - 0.1, h: 0.75,
    fontSize: 40, bold: true, color: color || INK, fontFace: F, align: "center", margin: 0 });
  s.addText(label, { x: x + 0.05, y: y + 0.95, w: w - 0.1, h: 0.3,
    fontSize: 13, bold: true, color: INK, fontFace: F, align: "center", margin: 0 });
  if (note) s.addText(note, { x: x + 0.05, y: y + 1.28, w: w - 0.1, h: 0.45,
    fontSize: 10, color: MUTE, fontFace: F, align: "center", margin: 0 });
}

// ═══════════════ 1. 封面 ═══════════════
{
  const s = darkSlide();
  s.addShape(pres.ShapeType.roundRect, {
    x: 1.1, y: 1.55, w: 11.1, h: 4.4, rectRadius: 0.1,
    fill: { color: CARD }, line: { color: LINE, width: 1 },
  });
  s.addText("NKC202 期末專題 · 題目 P3（Tier 3）", {
    x: 1.7, y: 2.0, w: 10, h: 0.35, fontSize: 14, bold: true, color: MUTE, fontFace: F, margin: 0 });
  s.addText("AWS CI/CD 演化闖關", {
    x: 1.7, y: 2.45, w: 10, h: 0.95, fontSize: 46, bold: true, color: TEXT, fontFace: F, margin: 0 });
  s.addText("把「改一行程式碼到上線」從 18 個步驟、16 分鐘的人工作業，\n變成 1 個步驟、80 秒的全自動流程", {
    x: 1.7, y: 3.5, w: 10, h: 0.95, fontSize: 17, color: SKY, fontFace: F, lineSpacing: 26, margin: 0 });
  s.addText("張博堯　|　2026 年 9 月", {
    x: 1.7, y: 4.9, w: 10, h: 0.35, fontSize: 14, color: MUTE, fontFace: F, margin: 0 });
  s.addText("github.com/CarlosChangYao/aws-cicd-pipeline", {
    x: 1.7, y: 5.3, w: 10, h: 0.32, fontSize: 12, color: MUTE, fontFace: F, italic: true, margin: 0 });
  s.addNotes(
`各位老師、各位同學好，我是張博堯。

我這次做的是 P3「CI/CD 演化闖關」，Tier 3。

一句話說明我做了什麼：我把「工程師改一行程式碼、到這行程式碼真的上線」這整件事，從原本需要 18 個步驟、花 16 分鐘的人工作業，改造成只要 1 個步驟、80 秒就完成的全自動流程。

而且這不是我用講的——後面每一關我都留下了實際量測的數字。

接下來大概 12 分鐘，我會帶大家走過這個演化過程，最後會現場 Demo 給大家看。`);
}

// ═══════════════ 2. 核心問題 ═══════════════
{
  const s = darkSlide();
  s.addText("這個專題在回答一個問題", {
    x: 0.9, y: 1.1, w: 11.5, h: 0.5, fontSize: 16, bold: true, color: MUTE, fontFace: F, margin: 0 });
  s.addText("工程師改了一行程式碼。\n這行程式碼要怎麼變成\n線上正在跑的網站？", {
    x: 0.9, y: 1.85, w: 11.5, h: 2.6, fontSize: 40, bold: true, color: TEXT, fontFace: F, lineSpacing: 52, margin: 0 });
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.9, y: 4.85, w: 11.5, h: 1.55, rectRadius: 0.08,
    fill: { color: CARD }, line: { color: LINE, width: 1 } });
  s.addText("這個問題有六種答案，一種比一種好。", {
    x: 1.3, y: 5.1, w: 10.7, h: 0.4, fontSize: 19, bold: true, color: SKY, fontFace: F, margin: 0 });
  s.addText("本專題把六種都做過一遍，並記錄每一種的步驟數、耗時、失敗次數、是否可追溯——用數字證明自動化的價值，而不是宣稱。", {
    x: 1.3, y: 5.6, w: 10.7, h: 0.6, fontSize: 14, color: TEXT, fontFace: F, lineSpacing: 22, margin: 0 });
  s.addNotes(
`先講清楚這個專題的命題是什麼。

它不是「我學會了 GitHub Actions」，也不是「我會用 Docker」。它在回答一個很具體的問題：工程師改了一行程式碼，這行程式碼要怎麼變成線上正在跑的網站？

這個問題聽起來很簡單，但它有六種不同層次的答案。從最原始的「自己登入伺服器手動複製檔案」，一路到「完全自動、而且換版時使用者完全不會斷線」。

我這次的做法是：六種我全部做過一遍，而且每一種我都記錄了四個數字——需要幾個步驟、花多少時間、失敗幾次、事後查不查得到線上跑的是哪一版。

所以等一下我講的每一個改善幅度，背後都有實際量測的數字，不是我估的。`);
}

// ═══════════════ 3. 六關全貌 ═══════════════
{
  const s = lightSlide("六關演進：每一關解決前一關的一個問題", "專題全貌");
  const gates = [
    { n: "關 0", t: "手動部署", d: "體會痛點\n建立基準線", c: OK },
    { n: "關 1", t: "容器化 + ECR", d: "環境固定\n傳輸可靠", c: OK },
    { n: "關 2", t: "自動建置", d: "push 即打包\n測試把關", c: OK },
    { n: "關 3", t: "自動部署", d: "改一行程式碼\n自動上線", c: OK },
    { n: "關 4", t: "滾動更新", d: "換版不中斷\n跨可用區", c: OK },
    { n: "關 5", t: "跨雲分發", d: "評估後\n決定不做", c: BAD },
  ];
  gates.forEach((g, i) => {
    const x = 0.6 + i * 2.08;
    card(s, x, 1.9, 1.9, 2.5, "F8FAFC");
    s.addShape(pres.ShapeType.roundRect, { x: x + 0.55, y: 2.1, w: 0.8, h: 0.42,
      rectRadius: 0.06, fill: { color: g.c }, line: { color: g.c, width: 1 } });
    s.addText(g.n, { x: x + 0.55, y: 2.13, w: 0.8, h: 0.36, fontSize: 12, bold: true,
      color: "FFFFFF", fontFace: F, align: "center", margin: 0 });
    s.addText(g.t, { x: x + 0.08, y: 2.68, w: 1.74, h: 0.6, fontSize: 14, bold: true,
      color: INK, fontFace: F, align: "center", margin: 0 });
    s.addText(g.d, { x: x + 0.08, y: 3.3, w: 1.74, h: 0.85, fontSize: 11,
      color: MUTE, fontFace: F, align: "center", lineSpacing: 15, margin: 0 });
    if (i < 5) s.addText("→", { x: x + 1.88, y: 2.95, w: 0.25, h: 0.4,
      fontSize: 18, color: LINE, fontFace: F, align: "center", margin: 0 });
  });
  card(s, 0.6, 4.75, 12.1, 1.55, "F0F9FF");
  s.addText("關卡之間不是「學了新工具」，而是「解決了上一關記錄下來的具體問題」", {
    x: 1.0, y: 5.0, w: 11.3, h: 0.4, fontSize: 17, bold: true, color: "0369A1", fontFace: F, margin: 0 });
  s.addText("例如關 0 記錄到「程式碼手貼會貼壞，失敗 2 次」→ 關 1 用 docker pull 解決；關 1 記錄到「打包仍需人工」→ 關 2 用 Actions 解決。", {
    x: 1.0, y: 5.5, w: 11.3, h: 0.55, fontSize: 13, color: INK, fontFace: F, lineSpacing: 20, margin: 0 });
  s.addNotes(
`這是整個專題的地圖。

六個關卡，我做到關 4，關 5 評估後決定不做——這個決定的理由我後面會說明。

我想強調的是這張圖右邊那句話：關卡與關卡之間，不是「我又學了一個新工具」，而是「我解決了上一關記錄下來的一個具體問題」。

舉例來說。關 0 我手動部署的時候，程式碼是用貼的貼進伺服器，貼壞了兩次。這個痛點我記錄下來了。所以關 1 我做容器化，用 docker pull 傳輸，這個問題就消失了。

再例如，關 1 做完之後，映像檔還是要我自己打指令建置、自己推上去。這個痛點也記錄下來了。所以關 2 我做自動建置。

這樣一關一關推進，每一關都有明確要解決的東西。這也是為什麼關 0 那份「手動部署有多痛」的紀錄非做不可——沒有它，後面四關就只是四個工具，沒有故事。`);
}

// ═══════════════ 4. 關 0 ═══════════════
{
  const s = lightSlide("關 0：手動部署——建立基準線", "第一關");
  s.addText("這一關的目標不是「部署成功」，而是「記錄部署有多痛」。", {
    x: 0.6, y: 1.62, w: 12.1, h: 0.35, fontSize: 15, color: MUTE, fontFace: F, italic: true, margin: 0 });
  statCard(s, 0.6, 2.2, 2.85, "18", "個步驟", "從連線到驗證完成", INK);
  statCard(s, 3.7, 2.2, 2.85, "16", "分鐘", "以截圖時間戳為據", INK);
  statCard(s, 6.8, 2.2, 2.85, "2", "次失敗", "並記錄根本原因", BAD);
  statCard(s, 9.9, 2.2, 2.8, "無", "版本可追溯", "GIT_COMMIT 只能\n填 none-manual-deploy", BAD);

  card(s, 0.6, 4.35, 5.95, 2.0, "FEF2F2");
  s.addText("兩次失敗的根本原因", { x: 1.0, y: 4.55, w: 5.2, h: 0.32,
    fontSize: 14, bold: true, color: "991B1B", fontFace: F, margin: 0 });
  s.addText([
    { text: "sudo -i 會開新的 shell，後面用 && 串接的指令不會執行", options: { bullet: true, breakLine: true } },
    { text: "Session Manager 走 WebSocket，一次貼 58 行會掉字", options: { bullet: true } },
  ], { x: 1.0, y: 4.95, w: 5.2, h: 1.2, fontSize: 12, color: INK, fontFace: F,
       lineSpacing: 17, paraSpaceAfter: 8, margin: 0 });

  card(s, 6.75, 4.35, 5.95, 2.0, "F8FAFC");
  s.addText("記錄下來的七個痛點（節選）", { x: 7.15, y: 4.55, w: 5.2, h: 0.32,
    fontSize: 14, bold: true, color: INK, fontFace: F, margin: 0 });
  s.addText([
    { text: "版本號人工填，無機制保證與程式碼一致", options: { bullet: true, breakLine: true } },
    { text: "不知道線上跑哪一版，無法回滾", options: { bullet: true, breakLine: true } },
    { text: "每改一行，18 個步驟要從頭再來一次", options: { bullet: true } },
  ], { x: 7.15, y: 4.95, w: 5.2, h: 1.2, fontSize: 12, color: INK, fontFace: F,
       lineSpacing: 17, paraSpaceAfter: 6, margin: 0 });
  s.addNotes(
`關 0 是手動部署。

這一關我要特別說明一下，因為它跟大家想的可能不一樣：這一關的目標「不是」部署成功。手動部署本來就一定會成功，只是花時間而已。

這一關真正的產出，是右邊這四個數字：18 個步驟、16 分鐘、失敗 2 次、版本完全無法追溯。

這四個數字是整個專題的基準線。後面每一關的價值，都是靠跟這四個數字對照才顯現出來的。

時間是怎麼算的？我不是用回憶估的，是用截圖檔案的時間戳回推——連線成功那張是 11 點 40 分 12 秒，驗證成功那張是 11 點 56 分 15 秒，中間 16 分鐘。

左下角這兩個失敗也值得一提。第一個是 sudo -i 之後用 && 串指令不會執行，第二個是 Session Manager 一次貼 58 行程式碼會掉字。這兩個都是真實踩到的坑，我把錯誤訊息和根本原因都記錄下來了。

右下角是我記錄的七個痛點，我挑三個唸：版本號是我人工填的、完全不知道線上跑的是哪一版、每改一行程式碼這 18 步要重來一次。

這七個痛點，就是後面四關要一個一個解決的東西。`);
}

// ═══════════════ 5. 關 1 ═══════════════
{
  const s = lightSlide("關 1：容器化 + ECR——把環境一起打包", "第二關");
  card(s, 0.6, 1.75, 5.9, 2.35, "FEF2F2");
  s.addText("關 0 的做法", { x: 1.0, y: 1.95, w: 5.1, h: 0.32,
    fontSize: 14, bold: true, color: "991B1B", fontFace: F, margin: 0 });
  s.addText([
    { text: "程式碼用貼的貼進伺服器（會貼壞）", options: { bullet: true, breakLine: true } },
    { text: "目標機器要先裝 Python", options: { bullet: true, breakLine: true } },
    { text: "要自己建虛擬環境、自己裝套件", options: { bullet: true, breakLine: true } },
    { text: "換一台機器，全部重來", options: { bullet: true } },
  ], { x: 1.0, y: 2.35, w: 5.1, h: 1.6, fontSize: 12.5, color: INK, fontFace: F,
       lineSpacing: 18, paraSpaceAfter: 7, margin: 0 });

  card(s, 6.8, 1.75, 5.9, 2.35, "F0FDF4");
  s.addText("關 1 的做法", { x: 7.2, y: 1.95, w: 5.1, h: 0.32,
    fontSize: 14, bold: true, color: "166534", fontFace: F, margin: 0 });
  s.addText([
    { text: "docker pull 完整傳輸，不會壞", options: { bullet: true, breakLine: true } },
    { text: "Python 已經在映像檔裡", options: { bullet: true, breakLine: true } },
    { text: "套件在建置時就裝好，封在映像檔內", options: { bullet: true, breakLine: true } },
    { text: "同一個映像檔到哪台機器都一樣", options: { bullet: true } },
  ], { x: 7.2, y: 2.35, w: 5.1, h: 1.6, fontSize: 12.5, color: INK, fontFace: F,
       lineSpacing: 18, paraSpaceAfter: 7, margin: 0 });

  statCard(s, 0.6, 4.35, 2.85, "7", "個步驟", "關 0 是 18 步", OK);
  statCard(s, 3.7, 4.35, 2.85, "37", "秒", "關 0 是 16 分鐘", OK);
  statCard(s, 6.8, 4.35, 2.85, "0", "次失敗", "傳輸不再出錯", OK);
  statCard(s, 9.9, 4.35, 2.8, "1cfbef1", "版本可追溯", "首次能對應到\n真實的 git commit", OK);
  s.addNotes(
`關 1 是容器化。

左邊是關 0 的做法，右邊是關 1 的做法，我用同樣四個面向對照。

程式碼傳輸：以前是用貼的，會貼壞；現在是 docker pull，完整傳輸不會壞。
執行環境：以前目標機器要先裝 Python、要自己建虛擬環境、自己裝套件；現在這些全部封裝在映像檔裡面。
換機器：以前全部重來；現在同一個映像檔丟到哪台機器，行為都一模一樣。

這裡我想多解釋一個觀念，叫「不可變基礎設施」。映像檔一旦建好就不再修改，要改就重新建一個新的。所以線上跑的東西永遠是確定的，不會有「這台機器上次有人手動改過什麼」這種問題。

下面的數字：步驟從 18 降到 7，時間從 16 分鐘降到 37 秒，傳輸失敗歸零。

最右邊那格特別重要。關 0 的時候，版本這一格我只能填「none-manual-deploy」，因為手動部署根本不知道自己在部署哪一版。關 1 開始，我把 git commit 的編號烤進映像檔裡，所以線上跑的是哪一版，第一次變成查得到的事情。

不過關 1 還有沒解決的問題：建置跟推送還是我自己打指令，版本號也還是我自己決定的。這兩件事留給關 2。`);
}

// ═══════════════ 6. 關 2 ═══════════════
{
  const s = lightSlide("關 2：自動建置——push 就打包，測試不過不准上線", "第三關");
  const steps = [
    { n: "1", t: "git push", d: "唯一的人工動作", c: SKY },
    { n: "2", t: "執行測試", d: "pytest 不過\n流水線紅燈中止", c: WARN },
    { n: "3", t: "建置映像檔", d: "版本號由機器產生\n人工無法介入", c: OK },
    { n: "4", t: "推送 ECR", d: "三個標籤：\ncommit / 版本 / latest", c: OK },
  ];
  steps.forEach((st, i) => {
    const x = 0.6 + i * 3.13;
    card(s, x, 1.85, 2.92, 2.25, "F8FAFC");
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.15, y: 2.05, w: 0.45, h: 0.45,
      fill: { color: st.c }, line: { color: st.c, width: 1 } });
    s.addText(st.n, { x: x + 0.15, y: 2.11, w: 0.45, h: 0.34, fontSize: 14, bold: true,
      color: "FFFFFF", fontFace: F, align: "center", margin: 0 });
    s.addText(st.t, { x: x + 0.72, y: 2.08, w: 2.05, h: 0.4, fontSize: 15, bold: true,
      color: INK, fontFace: F, margin: 0 });
    s.addText(st.d, { x: x + 0.15, y: 2.68, w: 2.6, h: 1.2, fontSize: 12,
      color: MUTE, fontFace: F, lineSpacing: 17, margin: 0 });
  });

  card(s, 0.6, 4.35, 12.1, 2.0, "F0F9FF");
  s.addText("最重要的設計：全程沒有任何 AWS 金鑰", {
    x: 1.0, y: 4.58, w: 11.3, h: 0.35, fontSize: 17, bold: true, color: "0369A1", fontFace: F, margin: 0 });
  s.addText("常見做法是把 AWS 的 access key 存進 GitHub Secrets——等於把帳號鑰匙永久交給第三方平台保管。", {
    x: 1.0, y: 5.0, w: 11.3, h: 0.32, fontSize: 13, color: INK, fontFace: F, margin: 0 });
  s.addText("本專題改用 OIDC：GitHub 每次執行時簽發一張數分鐘有效的身分證明，AWS 驗證「確實來自這個 repo」後才發給 1 小時的臨時憑證，用完即失效。兩邊都沒有金鑰存在。", {
    x: 1.0, y: 5.4, w: 11.3, h: 0.7, fontSize: 13, color: INK, fontFace: F, lineSpacing: 20, margin: 0 });
  s.addNotes(
`關 2 是自動建置。

上面這四格是流水線的流程。第一步 git push 是我唯一要做的動作，後面三步全部是機器自己做。

第二步我想特別提。測試被我獨立成一個關卡，而且設定成「測試沒過，後面的建置和部署完全不會執行」。

這件事在技術上叫 CI，但如果用金融業的語言來說，這叫「自動化的內控關卡」。以前的變更管理是靠人簽核、靠人記得檢查；現在是機器強制執行，繞不過去。這對稽核來說比一疊簽核單有力得多。

第三步的版本號，現在是機器用 commit 編號跟流水線執行次數自動產生的。關 0 的時候那個版本號是我自己隨手打的，我可以打錯、可以忘記改。現在我連想填錯都沒機會。

下面這一塊是關 2 最重要的設計，我要多花點時間講。

一般人的做法是：去 AWS 開一組 access key，存進 GitHub 的 Secrets。但這等於把你 AWS 帳號的鑰匙，永久交給第三方平台保管。

我用的是 OIDC。運作方式是：GitHub 在每次執行流水線的時候，幫這次執行簽發一張身分證明，這張證明只有幾分鐘有效。拿這張證明去跟 AWS 說「我是這個 repo 的 main 分支」，AWS 驗證通過之後，才發給一組一小時後就失效的臨時憑證。

結果是：GitHub 那邊沒有金鑰，AWS 這邊也沒有金鑰。整條流水線裡找不到任何一組長期密碼。

這一關的設定我卡了很久，後面有一頁專門講那個過程。`);
}

// ═══════════════ 7. 關 3 ═══════════════
{
  const s = lightSlide("關 3：自動部署——改一行程式碼，80 秒自動上線", "第四關");
  card(s, 0.6, 1.8, 6.1, 2.5, "F0FDF4");
  s.addText("實測結果（檢核點 #17）", { x: 1.0, y: 2.0, w: 5.3, h: 0.32,
    fontSize: 14, bold: true, color: "166534", fontFace: F, margin: 0 });
  const tl = [
    ["14:22:49", "git push（唯一的人工動作）"],
    ["—", "自動測試 → 建置 → 推 ECR → SSM 部署"],
    ["14:24:09", "線上版本自動更新"],
  ];
  tl.forEach((r, i) => {
    s.addText(r[0], { x: 1.0, y: 2.45 + i * 0.5, w: 1.25, h: 0.35, fontSize: 12.5,
      bold: true, color: SKY, fontFace: F, margin: 0 });
    s.addText(r[1], { x: 2.3, y: 2.45 + i * 0.5, w: 4.1, h: 0.35, fontSize: 12.5,
      color: INK, fontFace: F, margin: 0 });
  });
  s.addText("總計 80 秒，中間我沒有做任何事", { x: 1.0, y: 3.9, w: 5.3, h: 0.3,
    fontSize: 13, bold: true, color: "166534", fontFace: F, margin: 0 });

  card(s, 7.0, 1.8, 5.7, 2.5, "F8FAFC");
  s.addText("可追溯性形成閉環", { x: 7.4, y: 2.0, w: 4.9, h: 0.32,
    fontSize: 14, bold: true, color: INK, fontFace: F, margin: 0 });
  s.addText("線上網頁顯示", { x: 7.4, y: 2.5, w: 4.9, h: 0.28, fontSize: 11, color: MUTE, fontFace: F, margin: 0 });
  s.addText("Git Commit　dc4758f", { x: 7.4, y: 2.78, w: 4.9, h: 0.32, fontSize: 15, bold: true, color: SKY, fontFace: F, margin: 0 });
  s.addText("本機 git log", { x: 7.4, y: 3.25, w: 4.9, h: 0.28, fontSize: 11, color: MUTE, fontFace: F, margin: 0 });
  s.addText("dc4758f　Demo：改一行程式碼…", { x: 7.4, y: 3.53, w: 4.9, h: 0.32, fontSize: 15, bold: true, color: SKY, fontFace: F, margin: 0 });
  s.addText("線上跑的是哪一版，現在是確定的事", { x: 7.4, y: 3.95, w: 4.9, h: 0.3,
    fontSize: 12, bold: true, color: INK, fontFace: F, margin: 0 });

  card(s, 0.6, 4.55, 12.1, 1.75, "F0F9FF");
  s.addText("部署方式：SSM Run Command，不使用 SSH", {
    x: 1.0, y: 4.78, w: 11.3, h: 0.35, fontSize: 16, bold: true, color: "0369A1", fontFace: F, margin: 0 });
  s.addText("EC2 完全不開 22 port，主機內的 sshd 也已停用。GitHub 不需要保管任何主機金鑰。\n運作方式是主機上的代理程式「主動」向 AWS 輪詢指令，所以不需要開放任何對外連接埠——每次部署還會留下完整的稽核軌跡。", {
    x: 1.0, y: 5.2, w: 11.3, h: 0.85, fontSize: 13, color: INK, fontFace: F, lineSpacing: 20, margin: 0 });
  s.addNotes(
`關 3 是這個專題的主軸，做到這裡 Tier 3 就成立了。

左上角是我實際做的驗證。我在 app.py 裡加了一行程式碼，git push 出去，然後什麼都不做，就在旁邊等。

14 點 22 分 49 秒 push，14 點 24 分 09 秒線上版本自己變了。總共 80 秒。中間我沒有登入任何機器、沒有下任何指令。

右上角這個我覺得是關 3 最漂亮的地方。線上網頁顯示的 Git Commit 是 dc4758f，我本機 git log 最新一筆也是 dc4758f。這兩個對得起來。

回到關 0 那一格「none-manual-deploy」——從那個什麼都查不到的狀態，到現在線上跑的是哪一版是百分之百確定的事。這中間的差距，就是「可追溯性」。

下面這塊講部署方式。

我沒有用 SSH。EC2 完全不開 22 port，連主機裡面的 sshd 服務我都停掉了。

為什麼可以不開 port？因為 SSM 的運作方式是反過來的——不是我從外面連進去，是主機上的代理程式主動打電話出來問「有沒有我的工作」。所以完全不需要任何對外開放的連接埠。

這對資安稽核的意義是：如果被問「誰有權限登入生產主機」，我的答案是「沒有人能 SSH，因為根本沒有這個服務」。而且每一次操作都綁定到具體身分，全部記錄在 CloudTrail。`);
}

// ═══════════════ 8. 關 4 ═══════════════
{
  const s = lightSlide("關 4：滾動更新——換版時服務完全不中斷", "第五關");
  card(s, 0.6, 1.75, 5.9, 1.7, "FEF2F2");
  s.addText("關 3 剩下的問題", { x: 1.0, y: 1.95, w: 5.1, h: 0.3,
    fontSize: 14, bold: true, color: "991B1B", fontFace: F, margin: 0 });
  s.addText("docker rm -f  → 先殺掉舊容器（服務中斷）\ndocker run    → 再啟動新容器（才恢復）", {
    x: 1.0, y: 2.35, w: 5.1, h: 0.7, fontSize: 12.5, color: INK, fontFace: F, lineSpacing: 19, margin: 0 });
  s.addText("單機只有一個容器，殺掉就沒了", { x: 1.0, y: 3.05, w: 5.1, h: 0.28,
    fontSize: 11.5, color: MUTE, fontFace: F, italic: true, margin: 0 });

  card(s, 6.8, 1.75, 5.9, 1.7, "F0FDF4");
  s.addText("關 4 的解法：滾動更新", { x: 7.2, y: 1.95, w: 5.1, h: 0.3,
    fontSize: 14, bold: true, color: "166534", fontFace: F, margin: 0 });
  s.addText("① 先啟動新任務（暫時擴充到 200%）\n② 等新任務通過負載平衡器健康檢查\n③ 才逐一終止舊任務", {
    x: 1.0 + 6.2, y: 2.35, w: 5.1, h: 0.95, fontSize: 12.5, color: INK, fontFace: F, lineSpacing: 19, margin: 0 });

  statCard(s, 0.6, 3.7, 3.9, "300", "次請求", "部署期間每 0.5 秒打一次", INK);
  statCard(s, 4.75, 3.7, 3.9, "300", "次 HTTP 200", "全部成功", OK);
  statCard(s, 8.9, 3.7, 3.8, "0", "次失敗", "可用率 100.00%", OK);

  card(s, 0.6, 5.8, 12.1, 1.2, "F0F9FF");
  s.addText("換版瞬間，新舊版本同時服務約 15 秒——這就是「先起新的、確認健康、再收舊的」的證據", {
    x: 1.0, y: 6.0, w: 11.3, h: 0.35, fontSize: 15, bold: true, color: "0369A1", fontFace: F, margin: 0 });
  s.addText("15:11:26 舊版　→　15:11:27 新版　→　15:11:28 舊版　→　15:11:31 新版　⋯　15:11:47 完全切換", {
    x: 1.0, y: 6.42, w: 11.3, h: 0.32, fontSize: 12, color: INK, fontFace: F, margin: 0 });
  s.addNotes(
`關 4 是我最後做的一關，解決的是關 3 剩下的最後一個問題。

左上角：關 3 的部署動作是先 docker rm 殺掉舊容器，再 docker run 啟動新的。中間那幾秒，那台機器上是完全沒有服務的。這在單機上無法避免，因為只有一個容器，殺掉就沒了。

在金融業，這對應到「上線需要停機窗口」——必須排在收盤後或週末，還要動員人力待命。

右上角是關 4 的解法。我把部署目標換成 ECS Fargate，設定成滾動更新：先啟動新任務，等它通過負載平衡器的健康檢查，才逐一終止舊任務。全程至少維持原有數量的健康任務。

中間這三個數字是這一關唯一要證明的事，也是我覺得整個專題最硬的證據。

我在部署的同時，開了一支程式每 0.5 秒打一次網站，持續四分鐘。結果是 300 次請求、300 次成功、0 次失敗，可用率百分之百。

最下面這行是換版瞬間的明細，我覺得很有意思。

26 秒的時候是舊版，27 秒變新版，28 秒又回到舊版，31 秒又是新版……新舊版本交錯出現了大概 15 秒。

這個交錯就是滾動更新的指紋。它證明系統不是「先殺再起」，而是新舊任務同時活著、流量逐步轉移。而在這 15 秒裡面，沒有任何一個使用者的請求失敗。

對照關 3：那幾秒是真的斷線。對照關 4：使用者完全無感。`);
}

// ═══════════════ 9. 成果對照（圖表） ═══════════════
{
  const s = lightSlide("成果：用數字說話", "核心結論");
  s.addChart(pres.ChartType.bar, [
    { name: "人工步驟數", labels: ["關 0 手動", "關 1 容器化", "關 2 自動建置", "關 3 自動部署"], values: [18, 7, 1, 1] },
  ], {
    x: 0.6, y: 1.75, w: 6.0, h: 3.3,
    barDir: "col", showTitle: true, title: "人工步驟數：18 → 1（減少 94%）",
    titleFontSize: 14, titleColor: INK,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 13, dataLabelColor: INK,
    chartColors: [SKY], showLegend: false,
    catAxisLabelColor: MUTE, valAxisLabelColor: MUTE,
    catAxisLabelFontSize: 11, valAxisLabelFontSize: 10,
    valGridLine: { color: "E2E8F0", size: 1 }, catGridLine: { style: "none" },
    valAxisMaxVal: 20,
  });
  s.addChart(pres.ChartType.bar, [
    { name: "端到端耗時（秒）", labels: ["關 0 手動", "關 1 容器化", "關 2 自動建置", "關 3 自動部署"], values: [960, 37, 56, 80] },
  ], {
    x: 6.8, y: 1.75, w: 5.9, h: 3.3,
    barDir: "col", showTitle: true, title: "端到端耗時：960 秒 → 80 秒（減少 92%）",
    titleFontSize: 14, titleColor: INK,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: INK,
    chartColors: [OK], showLegend: false,
    catAxisLabelColor: MUTE, valAxisLabelColor: MUTE,
    catAxisLabelFontSize: 11, valAxisLabelFontSize: 10,
    valGridLine: { color: "E2E8F0", size: 1 }, catGridLine: { style: "none" },
  });
  const cols = [
    ["人工介入", "每次都要", "零"],
    ["失敗次數", "2 次", "0 次"],
    ["測試關卡", "無", "自動阻擋"],
    ["版本可追溯", "否", "對應 commit"],
    ["換版中斷", "有", "無"],
  ];
  card(s, 0.6, 5.3, 12.1, 1.55, "F8FAFC");
  cols.forEach((c, i) => {
    const x = 0.85 + i * 2.4;
    s.addText(c[0], { x, y: 5.45, w: 2.25, h: 0.28, fontSize: 11, color: MUTE, fontFace: F, align: "center", margin: 0 });
    s.addText(c[1], { x, y: 5.75, w: 2.25, h: 0.3, fontSize: 13, bold: true, color: BAD, fontFace: F, align: "center", margin: 0 });
    s.addText("↓", { x, y: 6.05, w: 2.25, h: 0.22, fontSize: 10, color: MUTE, fontFace: F, align: "center", margin: 0 });
    s.addText(c[2], { x, y: 6.28, w: 2.25, h: 0.3, fontSize: 13, bold: true, color: OK, fontFace: F, align: "center", margin: 0 });
  });
  s.addNotes(
`這一頁是整個專題的結論。

左邊這張圖是人工步驟數。關 0 是 18 步，關 1 降到 7 步，關 2 之後就只剩 1 步，就是 git push。減少 94%。

右邊是端到端耗時。關 0 是 960 秒，也就是 16 分鐘。關 3 是 80 秒。減少 92%。

這裡我想誠實說明一件事：關 1 的 37 秒看起來比關 3 的 80 秒快，但那不是退步。關 1 的 37 秒是「機器執行的時間」，人還要自己去打指令、自己去部署。關 3 的 80 秒是「從我按下 push，到使用者看得到新版」的完整時間，中間完全沒有人。

下面這五欄是不能用圖表呈現、但同樣重要的改善。

人工介入：從每次都要，變成零。
失敗次數：從 2 次變成 0 次。
測試關卡：從沒有，變成機器自動阻擋。
版本可追溯：從查不到，變成精確對應到某一次 commit。
換版中斷：從有，變成沒有。

我想強調最後三欄。前面兩欄是「快多少」，後面三欄是「安不安全、查不查得到、會不會影響使用者」——在金融業，後面三欄其實比前面兩欄重要。`);
}

// ═══════════════ 10. 安全設計 ═══════════════
{
  const s = lightSlide("安全設計：整條流水線零長期憑證", "評分維度③");
  const rows = [
    ["GitHub Actions → AWS", "OIDC 換取臨時憑證", "1 小時"],
    ["Actions → ECR", "以臨時憑證換取推送權杖", "12 小時"],
    ["Actions → EC2", "SSM Run Command（不經 SSH）", "單次"],
    ["EC2 → ECR", "EC2 IAM Role 換取權杖", "12 小時"],
  ];
  card(s, 0.6, 1.8, 12.1, 2.55, "F8FAFC");
  s.addText("環節", { x: 1.0, y: 2.0, w: 3.6, h: 0.3, fontSize: 11, bold: true, color: MUTE, fontFace: F, margin: 0 });
  s.addText("認證方式", { x: 4.8, y: 2.0, w: 5.2, h: 0.3, fontSize: 11, bold: true, color: MUTE, fontFace: F, margin: 0 });
  s.addText("有效期", { x: 10.2, y: 2.0, w: 2.2, h: 0.3, fontSize: 11, bold: true, color: MUTE, fontFace: F, margin: 0 });
  rows.forEach((r, i) => {
    const y = 2.38 + i * 0.47;
    s.addText(r[0], { x: 1.0, y, w: 3.6, h: 0.35, fontSize: 12.5, bold: true, color: INK, fontFace: F, margin: 0 });
    s.addText(r[1], { x: 4.8, y, w: 5.2, h: 0.35, fontSize: 12.5, color: INK, fontFace: F, margin: 0 });
    s.addText(r[2], { x: 10.2, y, w: 2.2, h: 0.35, fontSize: 12.5, bold: true, color: SKY, fontFace: F, margin: 0 });
  });
  const more = [
    "不開 22 port，且主機內 sshd 已停用（縱深防禦，不依賴單一控制點）",
    "容器以非 root 使用者執行；ECR 私有倉庫並啟用推送掃描，實際掃出 CRITICAL 4 / HIGH 8",
    "IAM 權限精確到單一資源：只能推特定倉庫、只能對特定主機下指令、只能更新特定服務",
    "私有子網使用獨立路由表且無對外路由——「出不去」由路由層保證，非倚賴防火牆規則",
  ];
  card(s, 0.6, 4.6, 12.1, 2.15, "F0F9FF");
  s.addText("其他措施", { x: 1.0, y: 4.8, w: 11.3, h: 0.3,
    fontSize: 14, bold: true, color: "0369A1", fontFace: F, margin: 0 });
  s.addText(more.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < more.length - 1 } })),
    { x: 1.0, y: 5.18, w: 11.3, h: 1.4, fontSize: 12.5, color: INK, fontFace: F,
      lineSpacing: 18, paraSpaceAfter: 6, margin: 0 });
  s.addNotes(
`這一頁講安全設計，我認為是這個專題最值得說明的部分。

上面這個表是整條流水線的四個環節。每一個環節我都列出它怎麼認證、憑證活多久。

四個環節，沒有任何一個存放長期金鑰。全部都是「用身分換取短期憑證，用完即失效」。

最長的也只有 12 小時。就算某段日誌不小心外洩，隔天就沒用了。

下面四點是其他措施，我挑兩個講。

第二點的漏洞掃描。我把 ECR 設定成推送時自動掃描，結果實際掃出 4 個嚴重、8 個高風險漏洞——來源是基礎映像檔裡的作業系統套件，不是我寫的程式。

這件事的意義是：你不會知道自己用的基底有什麼問題，除非有人幫你掃。2021 年 Log4j 事件的時候，很多金融機構最痛苦的問題就是「我們到底哪些系統用了它」，查了好幾天。這就是軟體供應鏈安全。

第四點我想解釋一下。很多人以為「資料庫連不到外網」是靠防火牆擋的。其實不是。防火牆是門鎖，管的是誰可以進來；路由表是有沒有路，沒有路根本走不出去。

我的私有子網路由表裡只有一條本地路由，沒有任何對外通道。這叫從根本上斷絕，比靠防火牆規則可靠得多。`);
}

// ═══════════════ 11. 最難的一關 ═══════════════
{
  const s = lightSlide("最難的一關：一句話的錯誤訊息，卡了 6 次執行", "問題排除");
  card(s, 0.6, 1.75, 12.1, 0.85, "FEF2F2");
  s.addText("Error: Could not assume role with OIDC: Not authorized to perform sts:AssumeRoleWithWebIdentity", {
    x: 1.0, y: 1.98, w: 11.3, h: 0.4, fontSize: 14, bold: true, color: "991B1B", fontFace: F, margin: 0 });
  const runs = [
    ["第 1 次", "首次執行", "❌", BAD],
    ["第 2 次", "推測①：IAM 傳播延遲", "❌ 推測錯誤", BAD],
    ["第 3 次", "加入除錯步驟，印出實際送出的身分內容", "❌ 但取得關鍵資料", WARN],
    ["第 4 次", "推測②：憑證指紋過期", "❌ 推測錯誤", BAD],
    ["第 5 次", "推測③：大小寫不符", "❌ 推測錯誤", BAD],
    ["第 6 次", "讀除錯輸出後對症下藥", "✅ 成功", OK],
  ];
  runs.forEach((r, i) => {
    const y = 2.8 + i * 0.44;
    s.addText(r[0], { x: 0.9, y, w: 1.2, h: 0.32, fontSize: 12, bold: true, color: MUTE, fontFace: F, margin: 0 });
    s.addText(r[1], { x: 2.2, y, w: 7.2, h: 0.32, fontSize: 12.5, color: INK, fontFace: F, margin: 0 });
    s.addText(r[2], { x: 9.6, y, w: 3.0, h: 0.32, fontSize: 12, bold: true, color: r[3], fontFace: F, margin: 0 });
  });
  card(s, 0.6, 5.55, 12.1, 1.35, "F0F9FF");
  s.addText("三次推測全錯，花了 10 分鐘；一次量測直接命中，3 秒定位。", {
    x: 1.0, y: 5.72, w: 11.3, h: 0.35, fontSize: 16, bold: true, color: "0369A1", fontFace: F, margin: 0 });
  s.addText("真正的原因：GitHub 已改用「不可變主體識別」格式，在身分內容中嵌入帳號與 repo 的數字 ID，與網路教學上的舊格式不同。", {
    x: 1.0, y: 6.13, w: 11.3, h: 0.6, fontSize: 13, color: INK, fontFace: F, lineSpacing: 20, margin: 0 });
  s.addNotes(
`這一頁我想花點時間講，因為它是這個專題我學到最多的地方。

關 2 設定 OIDC 的時候，我卡了六次執行才成功。錯誤訊息從頭到尾都是上面這一句：「未被授權執行這個動作」。

這句話的問題是——它只說「不被允許」，完全不說是哪一個條件不符。資訊量幾乎是零。

中間這六行是我的完整過程，我沒有美化。

第一次失敗。第二次我推測是 AWS 的設定傳播需要時間，重跑一次——錯了。第四次我推測是憑證指紋過期，我還特地去抓了 GitHub 目前真正的憑證來更新——也錯了。第五次我推測是大小寫不符——還是錯了。

三次推測，全部都錯，總共花了大概 10 分鐘。

轉折在第三次。我在流水線裡加了一個除錯步驟，把 GitHub 實際送出的身分內容整個印出來。當時那次還是失敗，但我拿到了關鍵資料。

第六次，我讀了那個輸出，答案三秒鐘就出現了。

真正的原因是：GitHub 已經改用一種新的格式，在身分內容裡面嵌入了帳號跟 repo 的數字編號。而我照著網路教學設定的是舊格式。兩邊格式根本不一樣，當然對不上。

我想講的重點不是這個技術細節，而是這件事給我的啟示：

當錯誤訊息的資訊量不足的時候，唯一有效的方法是把雙方實際的值印出來直接比對，而不是憑經驗猜測。

三次推測 10 分鐘，一次量測 3 秒。這個對比我印象很深。`);
}

// ═══════════════ 12. 關 5 決策 ═══════════════
{
  const s = lightSlide("關 5：評估後決定不執行", "取捨");
  card(s, 0.6, 1.9, 5.9, 2.6, "F8FAFC");
  s.addText("關 5 要做什麼", { x: 1.0, y: 2.1, w: 5.1, h: 0.3,
    fontSize: 14, bold: true, color: INK, fontFace: F, margin: 0 });
  s.addText([
    { text: "另開 Google Cloud 帳號並綁定帳單", options: { bullet: true, breakLine: true } },
    { text: "設定 GCP 版的身分聯邦（Workload Identity）", options: { bullet: true, breakLine: true } },
    { text: "學習 Cloud Run 的部署模型", options: { bullet: true, breakLine: true } },
    { text: "撰寫並維護第二套流水線", options: { bullet: true } },
  ], { x: 1.0, y: 2.5, w: 5.1, h: 1.8, fontSize: 12.5, color: INK, fontFace: F,
       lineSpacing: 18, paraSpaceAfter: 8, margin: 0 });

  card(s, 6.8, 1.9, 5.9, 2.6, "F0F9FF");
  s.addText("評估結果", { x: 7.2, y: 2.1, w: 5.1, h: 0.3,
    fontSize: 14, bold: true, color: "0369A1", fontFace: F, margin: 0 });
  s.addText("預估投入", { x: 7.2, y: 2.55, w: 2.3, h: 0.28, fontSize: 11, color: MUTE, fontFace: F, margin: 0 });
  s.addText("5–8 小時", { x: 7.2, y: 2.82, w: 2.3, h: 0.35, fontSize: 20, bold: true, color: BAD, fontFace: F, margin: 0 });
  s.addText("Tier 認定", { x: 9.9, y: 2.55, w: 2.4, h: 0.28, fontSize: 11, color: MUTE, fontFace: F, margin: 0 });
  s.addText("不變（仍為 3）", { x: 9.9, y: 2.82, w: 2.4, h: 0.35, fontSize: 20, bold: true, color: BAD, fontFace: F, margin: 0 });
  s.addText("同樣的時間投入關 4 的滾動更新與文件完整度，\n對專題品質的貢獻明顯更高。", {
    x: 7.2, y: 3.4, w: 5.1, h: 0.8, fontSize: 12.5, color: INK, fontFace: F, lineSpacing: 19, margin: 0 });

  card(s, 0.6, 4.75, 12.1, 1.55, "F0FDF4");
  s.addText("「評估過、有理由地決定不做」與「沒做完」是兩件事", {
    x: 1.0, y: 4.98, w: 11.3, h: 0.35, fontSize: 17, bold: true, color: "166534", fontFace: F, margin: 0 });
  s.addText("架構設計的工作不只是「把東西做出來」，也包含「判斷什麼不該做」。能講出評估的依據與取捨的代價，比硬把六關做滿更接近實務。", {
    x: 1.0, y: 5.42, w: 11.3, h: 0.6, fontSize: 13, color: INK, fontFace: F, lineSpacing: 20, margin: 0 });
  s.addNotes(
`關 5 我沒有做，我想說明我是怎麼決定的。

左邊是關 5 需要做的事：另外開一個 Google Cloud 帳號並綁信用卡、設定 GCP 版的身分聯邦、學 Cloud Run 的部署模型、然後維護第二套流水線。

右邊是我的評估：大概要投入 5 到 8 小時，但這個題目的 Tier 認定不會因此提升，還是 3。

同樣的 5 到 8 小時，我拿去做關 4 的滾動更新，加上把文件寫完整——我判斷這樣對專題品質的貢獻明顯更高。

事實證明這個判斷是對的：關 4 那個「300 次請求零失敗」的數據，是整份報告最有力的證據之一。如果我拿那些時間去做跨雲，我會多一個關卡，但少一個能拿出來講的成果。

下面這句話是我想強調的：「評估過、有理由地決定不做」跟「沒做完」，是完全不同的兩件事。

架構設計的工作不只是把東西做出來，也包含判斷什麼不該做。我在文件裡把這個評估過程完整寫下來了，包括投入估計、Tier 影響、替代方案的比較。

我覺得這比硬把六關做滿，更接近實務上的工作方式。`);
}

// ═══════════════ 13. 金融業對應 ═══════════════
{
  const s = lightSlide("這套流程解決的是什麼問題", "延伸應用");
  s.addText("在金融業，「系統上線」不是技術問題，是風險與法遵問題。", {
    x: 0.6, y: 1.6, w: 12.1, h: 0.4, fontSize: 17, bold: true, color: SKY, fontFace: F, margin: 0 });
  const map = [
    ["18 個步驟仰賴人不出錯", "作業風險", "自動化，人只做 1 步"],
    ["不知道線上是哪一版", "稽核軌跡 / 可追溯性", "每次部署綁定 commit"],
    ["出錯後復原耗時", "營運持續（BCP）", "指定舊版重新部署即可回滾"],
    ["上線需人工登入主機", "存取控制 / 特權帳號管理", "全程無 SSH，留下稽核紀錄"],
    ["沒有審批與檢查紀錄", "變更管理 / 內控三道防線", "測試不過流水線中止"],
    ["換版需停機窗口", "服務中斷 / SLA", "滾動更新，營業時間可上線"],
  ];
  card(s, 0.6, 2.15, 12.1, 3.85, "F8FAFC");
  s.addText("手動部署的風險", { x: 1.0, y: 2.35, w: 3.9, h: 0.28, fontSize: 11, bold: true, color: MUTE, fontFace: F, margin: 0 });
  s.addText("內控術語", { x: 5.1, y: 2.35, w: 3.4, h: 0.28, fontSize: 11, bold: true, color: MUTE, fontFace: F, margin: 0 });
  s.addText("本專題的解法", { x: 8.7, y: 2.35, w: 3.7, h: 0.28, fontSize: 11, bold: true, color: MUTE, fontFace: F, margin: 0 });
  map.forEach((r, i) => {
    const y = 2.72 + i * 0.53;
    s.addText(r[0], { x: 1.0, y, w: 3.9, h: 0.4, fontSize: 12, color: INK, fontFace: F, margin: 0 });
    s.addText(r[1], { x: 5.1, y, w: 3.4, h: 0.4, fontSize: 12, bold: true, color: SKY, fontFace: F, margin: 0 });
    s.addText(r[2], { x: 8.7, y, w: 3.7, h: 0.4, fontSize: 12, color: INK, fontFace: F, margin: 0 });
  });
  s.addText("金管會已鬆綁金融業上雲委外規範，此類需求在券商將持續增加。", {
    x: 0.6, y: 6.25, w: 12.1, h: 0.35, fontSize: 13, color: MUTE, fontFace: F, italic: true, margin: 0 });
  s.addNotes(
`最後一個部分，我想講這套流程實際上解決什麼問題。

我目前在金融業擔任商業分析的工作，所以我會特別從這個角度看。

在金融業，「系統上線」從來不是純技術問題，它是風險與法遵問題。

一般科技公司上線出錯，使用者抱怨一下，修一修就好。券商上線出錯，客戶下不了單、可能上新聞、可能被主管機關盯上。

所以金融業對上線的態度是「寧可慢，不可錯」。於是流程變成：排上線窗口、收盤後或週末做、IT 跟業務一起待命、人工執行、出事人工回滾。

但這套「安全」的做法，本身製造了幾個風險。這張表把它們一條一條對應到內控術語。

第一條，18 個步驟仰賴人不出錯——這叫作業風險。自動化之後人只做 1 步。

第二條，不知道線上跑哪一版——這叫稽核軌跡。內稽如果問「六月十五號那天線上是哪一版」，手動部署答不出來。

第三條，出錯復原耗時——這叫營運持續，也就是 BCP。現在指定舊版本重新部署就好。

第四條，上線需人工登入主機——這叫存取控制。資安稽核如果問「誰能登入生產主機」，我的答案是沒有人能 SSH。

第五條，沒有審批紀錄——這叫變更管理。現在測試不過流水線就中止，機器強制執行，繞不過去。

第六條，換版需停機窗口——關 4 解決了。

最下面這行：金管會已經鬆綁金融業上雲的委外規範，這類需求在券商只會愈來愈多。`);
}

// ═══════════════ 14. Demo ═══════════════
{
  const s = darkSlide();
  s.addText("現場 Demo", { x: 0.9, y: 1.2, w: 11.5, h: 0.7,
    fontSize: 38, bold: true, color: TEXT, fontFace: F, margin: 0 });
  s.addText("改一行程式碼 → git push → 什麼都不做 → 網站自己更新", {
    x: 0.9, y: 2.0, w: 11.5, h: 0.45, fontSize: 18, color: SKY, fontFace: F, margin: 0 });
  const demo = [
    ["1", "打開網頁，記下目前的版本號與 commit 編號"],
    ["2", "在編輯器改一行程式碼，執行 git push"],
    ["3", "打開 GitHub Actions，看四個階段依序變綠"],
    ["4", "回到網頁重新整理——版本號自己變了"],
    ["5", "比對網頁上的 commit 編號與本機 git log，完全一致"],
  ];
  demo.forEach((d, i) => {
    const y = 2.75 + i * 0.72;
    s.addShape(pres.ShapeType.ellipse, { x: 1.0, y: y + 0.04, w: 0.42, h: 0.42,
      fill: { color: SKY }, line: { color: SKY, width: 1 } });
    s.addText(d[0], { x: 1.0, y: y + 0.09, w: 0.42, h: 0.32, fontSize: 13, bold: true,
      color: BG, fontFace: F, align: "center", margin: 0 });
    s.addText(d[1], { x: 1.65, y: y + 0.05, w: 10.5, h: 0.42, fontSize: 16,
      color: TEXT, fontFace: F, margin: 0 });
  });
  s.addNotes(
`接下來我現場示範一次。

流程是這樣：我會先打開網頁，請大家記一下現在的版本號。然後我在編輯器裡改一行程式碼，git push 出去。

push 完之後，我就不會再碰任何東西了。我們一起看 GitHub Actions 的畫面，會看到四個階段依序變綠：測試、建置、部署到 EC2、部署到 ECS。

大概 80 秒之後，我回到網頁重新整理，版本號就會自己變成新的。

最後我會把網頁上顯示的 commit 編號，跟我本機的 git log 對照給大家看，兩邊會完全一致。

如果時間夠，我還可以示範另外兩件事：
第一，故意把測試改壞，讓大家看到流水線紅燈中止、完全不會部署。
第二，指定一個舊版本的編號重新部署，示範回滾。

（實際操作時的提醒：先確認 EC2 是開機狀態；先把要改的那一行準備好；網頁記得先開好兩個分頁，一個 EC2 的、一個 ECS 的。）`);
}

// ═══════════════ 15. 結語 ═══════════════
{
  const s = darkSlide();
  s.addText("結語", { x: 0.9, y: 1.1, w: 11.5, h: 0.6,
    fontSize: 32, bold: true, color: MUTE, fontFace: F, margin: 0 });
  s.addText("這個專題真正的產出，\n不是四個關卡，是兩份紀錄。", {
    x: 0.9, y: 1.9, w: 11.5, h: 1.3, fontSize: 34, bold: true, color: TEXT, fontFace: F, lineSpacing: 46, margin: 0 });

  s.addShape(pres.ShapeType.roundRect, { x: 0.9, y: 3.5, w: 5.6, h: 1.9,
    rectRadius: 0.08, fill: { color: CARD }, line: { color: LINE, width: 1 } });
  s.addText("關 0 的基準線", { x: 1.3, y: 3.72, w: 4.8, h: 0.35,
    fontSize: 16, bold: true, color: SKY, fontFace: F, margin: 0 });
  s.addText("18 步、16 分鐘、2 次失敗、版本無法追溯。\n沒有這四個數字，後面四關就只是四個工具。", {
    x: 1.3, y: 4.15, w: 4.8, h: 1.0, fontSize: 13, color: TEXT, fontFace: F, lineSpacing: 20, margin: 0 });

  s.addShape(pres.ShapeType.roundRect, { x: 6.8, y: 3.5, w: 5.6, h: 1.9,
    rectRadius: 0.08, fill: { color: CARD }, line: { color: LINE, width: 1 } });
  s.addText("六次失敗的除錯歷程", { x: 7.2, y: 3.72, w: 4.8, h: 0.35,
    fontSize: 16, bold: true, color: SKY, fontFace: F, margin: 0 });
  s.addText("三次推測全錯，一次量測命中。\n它證明的不是我會用工具，是我會找出問題。", {
    x: 7.2, y: 4.15, w: 4.8, h: 1.0, fontSize: 13, color: TEXT, fontFace: F, lineSpacing: 20, margin: 0 });

  s.addText("感謝聆聽　·　github.com/CarlosChangYao/aws-cicd-pipeline", {
    x: 0.9, y: 5.85, w: 11.5, h: 0.4, fontSize: 15, color: MUTE, fontFace: F, margin: 0 });
  s.addNotes(
`最後做個總結。

我覺得這個專題真正的產出，不是我做完了四個關卡，而是兩份紀錄。

第一份是關 0 的基準線：18 步、16 分鐘、2 次失敗、版本完全無法追溯。

如果沒有這四個數字，我後面做的四關就只是四個工具——「我學會了 Docker」、「我學會了 GitHub Actions」。有了這四個數字，它們才變成「我解決了四個具體的問題，而且改善幅度是可以量化的」。

第二份是關 2 那六次失敗的除錯歷程。三次推測全錯、一次量測命中。

我特別把這段完整寫進報告，包括我猜錯的那三次。因為我覺得它證明的不是我會用工具——照著教學抄也會用工具——而是我會在沒有現成答案的時候，找出問題在哪裡。

這兩件事是我這次最大的收穫。

以上是我的報告，謝謝大家。`);
}

pres.writeFile({ fileName: "/Users/carloschang/Desktop/Tibame/專題/簡報/NKC202_期末專題_驗收簡報.pptx" })
  .then(f => console.log("✅ 已產生：" + f));
