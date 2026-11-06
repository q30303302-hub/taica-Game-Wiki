document.addEventListener('DOMContentLoaded', async () => {
  const target = document.getElementById('game-detail');
  const id = GameWiki.queryParam('id');
  if (!id) { GameWiki.showError(target, '網址缺少遊戲 ID。'); return; }
  try {
    const [games, articles] = await Promise.all([GameWiki.loadJson('data/games.json'), GameWiki.loadJson('data/articles.json')]);
    const game = games.find(item => item.id === id);
    if (!game) { GameWiki.showError(target, '找不到這款遊戲，請返回遊戲列表。'); return; }
    document.title = `${game.name}｜Game Wiki`;
    document.getElementById('breadcrumb-current').textContent = game.name;
    const e = GameWiki.escapeHtml;
    const related = articles.filter(article => article.gameId === game.id);
    const popularity = game.popularity && /^https?:\/\//i.test(game.popularity.sourceUrl || '')
      ? `<aside class="popularity-note"><strong>熱門收錄依據</strong><p>${e(game.popularity.note || '')}</p><small>統計期間：${e(game.popularity.period || '未提供')}　｜　查核日期：${e(game.popularity.checkedAt || '未提供')}</small><a href="${e(game.popularity.sourceUrl)}" target="_blank" rel="noopener noreferrer">${e(game.popularity.sourceName || '查看排行榜來源')} ↗</a></aside>`
      : '';
    target.innerHTML = `
      <section class="game-detail-hero"><div class="game-detail-art"><span>${e((game.englishName || game.name).slice(0,2).toUpperCase())}</span></div><div class="game-detail-copy"><p class="eyebrow">GAME PROFILE</p><div class="chip-row">${(game.genres || []).map(g => `<span class="chip">${e(g)}</span>`).join('')}</div><h1>${e(game.name)}</h1><p class="english-name">${e(game.englishName || '')}</p><p class="lead">${e(game.description || game.summary)}</p>${popularity}<a class="button button-primary" href="#related-guides">查看相關攻略 ↓</a></div></section>
      <section id="related-guides" class="section-block"><div class="section-heading"><div><p class="eyebrow">RELATED GUIDES</p><h2>相關攻略</h2></div><span class="muted-text">${related.length} 篇文章</span></div><div class="article-list">${related.length ? related.map(article => GameWiki.articleCard(article, game)).join('') : '<p class="empty-note">這款遊戲目前還沒有攻略文章。</p>'}</div></section>`;
  } catch (error) { GameWiki.showError(target, error.message); }
});
