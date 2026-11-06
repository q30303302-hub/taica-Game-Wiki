# Game Wiki｜遊戲攻略知識庫

Game Wiki 是一個使用繁體中文呈現的跨遊戲類型攻略網站起始專案。網站以原生 HTML、CSS、JavaScript 與 JSON 製作，可部署至 GitHub Pages。

## 專案特色

- 支援不同遊戲類型，不限定單一作品。
- 提供首頁、遊戲列表、遊戲介紹及攻略文章頁。
- 支援遊戲搜尋、類型篩選及文章關鍵字搜尋。
- 遊戲與文章內容集中存放在 `data/`，方便依照 `AGENTS.md` 持續擴充。
- 使用響應式深色版面，支援桌面與手機瀏覽。
- 支援本機伺服器與直接開啟 HTML；`file://` 預覽時會使用 `js/data-fallback.js` 備援資料。

## 專案結構

```text
Game-Wiki/
├── AGENTS.md
├── README.md
├── index.html
├── games.html
├── game.html
├── article.html
├── css/style.css
├── js/main.js
├── js/data-fallback.js
├── js/home.js
├── js/games.js
├── js/game.js
├── js/article.js
├── data/games.json
├── data/articles.json
└── assets/images/
```

## 如何在本機預覽

網站建議使用本機 HTTP 伺服器預覽；也支援直接以 `file://` 開啟 HTML。使用 `file://` 時，網站會讀取 `js/data-fallback.js` 內的備援資料。若修改了 `data/games.json` 或 `data/articles.json`，請同步更新備援資料。

### 方法一：直接開啟（快速預覽）

直接雙擊 `index.html` 即可預覽首頁。若要檢查 JSON 原始資料是否同步，仍建議使用以下本機伺服器方式。

### 方法二：Visual Studio Code

1. 使用 VS Code 開啟 `Game-Wiki` 資料夾。
2. 安裝並啟用 Live Server 擴充功能。
3. 在 `index.html` 按右鍵，選擇 **Open with Live Server**。

### 方法三：Python

在 `Game-Wiki` 資料夾執行：

```bash
python -m http.server 8000
```

然後用瀏覽器開啟 `http://localhost:8000`。

## 新增遊戲或攻略

1. 先閱讀 `AGENTS.md`。
2. 在 `data/games.json` 新增遊戲資料。
3. 在 `data/articles.json` 新增攻略資料，並以 `gameId` 關聯遊戲。
4. 確認 `id` 唯一、JSON 格式正確、來源連結可用。
5. 重新整理網站，檢查新資料是否出現。

文章欄位、命名規則、來源查核及 AI 修改規範，以 `AGENTS.md` 為準。

## GitHub Pages 部署

1. 在 GitHub 建立新的 Repository。
2. 將本資料夾內所有檔案上傳到 Repository 根目錄。
3. 開啟 Repository 的 **Settings → Pages**。
4. 在 **Build and deployment** 選擇 **Deploy from a branch**。
5. 選擇 `main` 分支及 `/(root)`，按下 Save。
6. 等待 GitHub Pages 完成部署後，開啟顯示的網址測試各頁面。

## 初始內容

目前收錄「艾爾登法環」及依據 2026 年 11 月熱門榜單新增的多款遊戲，另附一篇「惡兆妖鬼瑪爾基特」攻略草稿。熱門榜單資料含台灣 PC 口碑聲量與 Steam 全球同時在線兩種來源，統計口徑不同，不應直接比較名次。文章狀態為 `draft`，正式發布前請依照遊戲目前版本重新核對內容及來源。


## 熱門遊戲收錄依據

- 台灣 PC 線上遊戲口碑：網路溫度計 DailyView，分析期間 2026-10-05 至 2026-11-03，查核日期 2026-11-06。來源：[PC 線上遊戲口碑聲量排行](https://dailyview.tw/top100/topic/77)。
- 全球 Steam 同時在線：SteamPeaks 於 2026-11-06 擷取的排行榜快照。來源：[SteamPeaks 排行榜](https://steampeaks.com/)。這是第三方統計資料，排名會持續變動。
- 上述兩種榜單的統計方式不同，僅用來決定收錄候選遊戲，不代表兩者排名可以直接比較。
