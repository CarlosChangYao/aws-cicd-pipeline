const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, PageBreak, PageOrientation } = require("docx");
const S = "/private/tmp/claude-501/-Users-carloschang-Desktop-Tibame/7aaed3fd-2aa3-4adc-a314-605034dbaef4/scratchpad/";
const items = [
  ["d1_完整架構.png", "圖一：完整架構", "從 git push 到使用者瀏覽器的全鏈路"],
  ["d2_六關演進.png", "圖二：六關演進", "每一關解決前一關記錄下來的具體問題"],
  ["d3_認證流程.png", "圖三：認證流程", "全程零長期憑證，每一段都是用身分換短期憑證"],
];
const kids = [];
items.forEach(([f, title, sub], i) => {
  const buf = fs.readFileSync(S + f);
  const dim = (() => { // 讀 PNG 寬高
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  })();
  const MAXW = 1020, MAXH = 600;
  const r = Math.min(MAXW / dim.w, MAXH / dim.h);
  kids.push(new Paragraph({ spacing: { after: 60 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: title, font: "Calibri", size: 30, bold: true, color: "1F2937" })] }));
  kids.push(new Paragraph({ spacing: { after: 200 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: sub, font: "Calibri", size: 20, color: "6B7280" })] }));
  kids.push(new Paragraph({ alignment: AlignmentType.CENTER,
    children: [new ImageRun({ type: "png", data: buf,
      transformation: { width: Math.round(dim.w * r), height: Math.round(dim.h * r) } })] }));
  if (i < items.length - 1) kids.push(new Paragraph({ children: [new PageBreak()] }));
});
const doc = new Document({
  creator: "張博堯",
  title: "NKC202 期末專題 — 系統架構圖",
  sections: [{
    properties: { page: { size: { orientation: PageOrientation.LANDSCAPE }, margin: { top: 620, right: 620, bottom: 620, left: 620 } } },
    children: kids,
  }],
});
Packer.toBuffer(doc).then(b => {
  fs.writeFileSync("/Users/carloschang/Desktop/Tibame/專題/docs/架構圖.docx", b);
  console.log("✅ 已產生 架構圖.docx");
});
