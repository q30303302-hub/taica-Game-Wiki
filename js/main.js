(() => {
  const mainScript = document.currentScript;
  const projectRoot = mainScript
    ? new URL('../', mainScript.src)
    : new URL('./', document.baseURI);
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  if (header) {
    header.innerHTML = `
      <div class="nav-wrap container">
        <a class="brand" href="index.html" aria-label="Game Wiki 首頁"><span class="brand-mark">GW</span><span>GAME <b>WIKI</b><small>遊戲攻略知識庫</small></span></a>
        <nav class="main-nav" aria-label="主要導覽">
          <a href="index.html" ${currentPage === 'index.html' ? 'aria-current="page"' : ''}>首頁</a>
          <a href="games.html" ${['games.html','game.html'].includes(currentPage) ? 'aria-current="page"' : ''}>遊戲列表</a>
          <a href="index.html#latest-guides">攻略文章</a>
        </nav>
        <a class="nav-cta" href="games.html">開始探索 <span aria-hidden="true">↗</span></a>
      </div>`;
  }
  if (footer) {
    footer.innerHTML = `<div class="container footer-inner"><a class="brand footer-brand" href="index.html"><span class="brand-mark">GW</span><span>GAME <b>WIKI</b><small>遊戲攻略知識庫</small></span></a><p>整理遊戲知識，讓每一次冒險都有方向。</p><small>Game Wiki · 個人課程專案</small></div>`;
  }

  window.GameWiki = {
    async loadJson(path) {
      const cleanPath = String(path).replace(/^\.\//, '').replace(/^\//, '');

      // 瀏覽器不允許 file:// 頁面以 fetch() 讀取本機 JSON，因此改用隨頁面載入的備援資料。
      if (location.protocol === 'file:') {
        const fallback = window.GAME_WIKI_FALLBACK?.[cleanPath];
        if (fallback === undefined) {
          throw new Error(`找不到本機備援資料：${cleanPath}。請確認 js/data-fallback.js 是否存在。`);
        }
        return JSON.parse(JSON.stringify(fallback));
      }

      // 以 main.js 的實際位置推算專案根目錄，支援一般網域及 GitHub Pages 專案子路徑。
      const dataUrl = new URL(cleanPath, projectRoot);
      let response;
      try {
        response = await fetch(dataUrl.href, { cache: 'no-cache' });
      } catch (error) {
        throw new Error(`無法連線至資料檔：${cleanPath}。請確認網站是透過本機伺服器或 GitHub Pages 開啟。`);
      }
      if (!response.ok) {
        throw new Error(`無法載入資料：${cleanPath}（HTTP ${response.status}）。請確認檔案位置及大小寫。`);
      }
      try {
        return await response.json();
      } catch (error) {
        throw new Error(`資料格式錯誤：${cleanPath} 不是有效的 JSON。`);
      }
    },
    escapeHtml(value) {
      return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
    },
    queryParam(name) { return new URLSearchParams(location.search).get(name); },
    gameCard(game) {
      const e = this.escapeHtml;
      const genres = (game.genres || []).slice(0, 2).map(g => `<span class="chip">${e(g)}</span>`).join('');
      const popularity = game.popularity?.shortLabel ? `<span class="chip popularity-chip">${e(game.popularity.shortLabel)}</span>` : '';
      return `<article class="game-card"><a class="game-card-link" href="game.html?id=${encodeURIComponent(game.id)}"><div class="game-art ${game.image ? 'has-image' : ''}" ${game.image ? `style="background-image:url('${e(game.image)}')"` : ''}><span class="art-monogram">${e((game.englishName || game.name || 'GW').slice(0,2).toUpperCase())}</span><span class="art-label">GAME</span></div><div class="game-card-body"><div class="chip-row">${genres}${popularity}</div><h3>${e(game.name)}</h3><p>${e(game.summary)}</p><span class="card-more">查看遊戲資料 <b aria-hidden="true">→</b></span></div></a></article>`;
    },
    articleCard(article, game) {
      const e = this.escapeHtml;
      return `<article class="article-row"><div class="article-index">GUIDE</div><div class="article-row-content"><div class="chip-row"><span class="chip">${e(article.category)}</span><span class="muted-chip">${e(game?.name || '遊戲攻略')}</span></div><h3><a href="article.html?id=${encodeURIComponent(article.id)}">${e(article.title)}</a></h3><p>${e(article.summary)}</p><div class="article-meta"><span>查核日期：${e(article.checkedAt || '未提供')}</span><span class="status status-${e(article.status || 'draft')}">${article.status === 'published' ? '已發布' : article.status === 'reviewed' ? '已審核' : '待審核'}</span></div></div><a class="row-arrow" href="article.html?id=${encodeURIComponent(article.id)}" aria-label="閱讀${e(article.title)}">↗</a></article>`;
    },
    showError(target, message) {
      if (target) target.innerHTML = `<div class="empty-state"><span class="empty-icon">!</span><h2>目前無法顯示內容</h2><p>${this.escapeHtml(message)}</p><a class="button button-primary" href="index.html">返回首頁</a></div>`;
    }
  };
})();
