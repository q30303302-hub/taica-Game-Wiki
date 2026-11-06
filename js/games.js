document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('game-list');
  const search = document.getElementById('game-search');
  const filter = document.getElementById('genre-filter');
  const count = document.getElementById('game-count');
  try {
    const games = await GameWiki.loadJson('data/games.json');
    const genres = [...new Set(games.flatMap(game => game.genres || []))].sort((a,b) => a.localeCompare(b, 'zh-Hant'));
    genres.forEach(genre => { const option = document.createElement('option'); option.value = genre; option.textContent = genre; filter.append(option); });
    const requestedGenre = GameWiki.queryParam('genre');
    if (requestedGenre && genres.some(genre => genre.includes(requestedGenre))) filter.value = genres.find(genre => genre.includes(requestedGenre));
    function render() {
      const keyword = search.value.trim().toLocaleLowerCase();
      const genre = filter.value;
      const results = games.filter(game => {
        const text = [game.name, game.englishName, game.summary, game.description, ...(game.genres || [])].join(' ').toLocaleLowerCase();
        return (!keyword || text.includes(keyword)) && (!genre || (game.genres || []).includes(genre));
      });
      count.textContent = `共找到 ${results.length} 款遊戲`;
      list.innerHTML = results.length ? results.map(game => GameWiki.gameCard(game)).join('') : '<div class="empty-state"><span class="empty-icon">⌕</span><h2>找不到符合的遊戲</h2><p>請試試其他關鍵字或分類。</p></div>';
    }
    search.addEventListener('input', render);
    filter.addEventListener('change', render);
    render();
  } catch (error) { GameWiki.showError(list, error.message); }
});
