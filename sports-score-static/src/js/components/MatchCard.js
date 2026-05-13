export function renderMatchCard(match) {
  const statusText = {
    live: '进行中',
    finished: '已结束',
    upcoming: '即将开始'
  };

  const scoreDisplay = match.status === 'upcoming' 
    ? 'VS' 
    : `${match.homeScore} - ${match.awayScore}`;

  const scoreClass = match.status === 'upcoming' ? 'score vs' : 'score';

  const timeDisplay = match.status === 'upcoming' 
    ? `${match.time} 开球` 
    : match.time;

  return `
    <div class="match-card" data-match-id="${match.id}">
      <div class="match-header">
        <span class="league">${match.league}</span>
        <span class="match-status ${match.status}">${statusText[match.status]}</span>
      </div>
      <div class="match-teams">
        <div class="team home">
          <div class="team-logo">${match.homeTeam.abbr}</div>
          <span class="team-name">${match.homeTeam.name}</span>
        </div>
        <div class="match-score">
          <div class="${scoreClass}">${scoreDisplay}</div>
          <div class="time">${timeDisplay}</div>
        </div>
        <div class="team away">
          <span class="team-name">${match.awayTeam.name}</span>
          <div class="team-logo">${match.awayTeam.abbr}</div>
        </div>
      </div>
    </div>
  `;
}

export function renderMatches(matches, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (matches.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 2rem;">暂无比赛数据</p>';
    return;
  }

  container.innerHTML = matches.map(match => renderMatchCard(match)).join('');
}
