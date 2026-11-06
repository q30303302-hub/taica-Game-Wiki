document.addEventListener('DOMContentLoaded', async () => {
  const gamesTarget = document.getElementById('featured-games');
  const articlesTarget = document.getElementById('latest-articles');

  const [gamesResult, articlesResult] = await Promise.allSettled([
    GameWiki.loadJson('data/games.json'),
    GameWiki.loadJson('data/articles.json')
  ]);

  let games = [];
  if (gamesResult.status === 'fulfilled' && Array.isArray(gamesResult.value)) {
    games = gamesResult.value;
    const featured = games.filter(game => game.featured).slice(0, 3);
    gamesTarget.innerHTML = featured.length
      ? featured.map(game => GameWiki.gameCard(game)).join('')
      : '<p class="empty-note">目前尚無精選遊戲。</p>';
  } else {
    GameWiki.showError(gamesTarget, gamesResult.status === 'rejected'
      ? gamesResult.reason.message
      : '遊戲資料格式不正確，請確認 data/games.json。');
  }

  if (articlesResult.status === 'fulfilled' && Array.isArray(articlesResult.value)) {
    const gameMap = new Map(games.map(game => [game.id, game]));
    const latest = [...articlesResult.value]
      .sort((a, b) => (b.checkedAt || '').localeCompare(a.checkedAt || ''))
      .slice(0, 4);
    articlesTarget.innerHTML = latest.length
      ? latest.map(article => GameWiki.articleCard(article, gameMap.get(article.gameId))).join('')
      : '<p class="empty-note">目前尚無攻略文章。</p>';
  } else {
    GameWiki.showError(articlesTarget, articlesResult.status === 'rejected'
      ? articlesResult.reason.message
      : '攻略資料格式不正確，請確認 data/articles.json。');
  }
});
