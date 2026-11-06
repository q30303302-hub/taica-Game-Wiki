document.addEventListener('DOMContentLoaded', async () => {
  const target = document.getElementById('article-detail');
  const id = GameWiki.queryParam('id');
  if (!id) { GameWiki.showError(target, '網址缺少文章 ID。'); return; }
  try {
    const [games, articles] = await Promise.all([GameWiki.loadJson('data/games.json'), GameWiki.loadJson('data/articles.json')]);
    const article = articles.find(item => item.id === id);
    if (!article) { GameWiki.showError(target, '找不到這篇攻略文章。'); return; }
    const game = games.find(item => item.id === article.gameId);
    const e = GameWiki.escapeHtml;
    document.title = `${article.title}｜Game Wiki`;
    const sections = (article.sections || []).map(section => `
      <section class="prose-section"><h2>${e(section.heading)}</h2>
        ${(section.paragraphs || []).map(paragraph => `<p>${e(paragraph)}</p>`).join('')}
        ${(section.steps || []).length ? `<ol>${section.steps.map(step => `<li>${e(step)}</li>`).join('')}</ol>` : ''}
        ${(section.bullets || []).length ? `<ul>${section.bullets.map(item => `<li>${e(item)}</li>`).join('')}</ul>` : ''}
      </section>`).join('');
    const sources = (article.sources || []).map(source => `<li><a href="${e(source.url)}" target="_blank" rel="noopener noreferrer">${e(source.name)}</a><span class="source-type">${e(source.type || '參考資料')}</span></li>`).join('');
    target.innerHTML = `
      <article class="article-page">
        <header class="article-header"><div class="chip-row"><a class="chip chip-link" href="game.html?id=${encodeURIComponent(article.gameId)}">${e(game?.name || '遊戲攻略')}</a><span class="chip">${e(article.category)}</span></div><h1>${e(article.title)}</h1><p class="article-summary">${e(article.summary)}</p><div class="article-meta"><span>查核日期：${e(article.checkedAt || '未提供')}</span><span>適用版本：${e(article.version || '未提供')}</span><span class="status status-${e(article.status || 'draft')}">${article.status === 'published' ? '已發布' : article.status === 'reviewed' ? '已審核' : '待審核'}</span></div></header>
        <div class="article-layout"><div class="article-prose">${sections}</div><aside class="article-sidebar"><div class="sidebar-card"><h3>文章資訊</h3><p><span>適合對象</span>${e(article.audience || '一般玩家')}</p><div class="tag-list">${(article.tags || []).map(tag => `<span class="tag">#${e(tag)}</span>`).join('')}</div></div><div class="sidebar-card"><h3>參考來源</h3><ul class="source-list">${sources || '<li>尚未提供來源</li>'}</ul></div></aside></div>
      </article>`;
  } catch (error) { GameWiki.showError(target, error.message); }
});
