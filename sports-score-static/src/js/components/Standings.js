export function renderStandings(standingsData, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const medalIcons = {
    1: '🥇',
    2: '🥈',
    3: '🥉'
  };

  const positionClass = (position) => {
    if (position === 1) return 'champion';
    if (position === 2) return 'runner-up';
    if (position === 3) return 'third-place';
    if (position <= 4) return 'top-4';
    if (position <= 6) return 'top-6';
    if (position >= standingsData.length - 2) return 'relegation';
    return '';
  };

  const html = `
    <table class="standings-table">
      <thead>
        <tr>
          <th>#</th>
          <th>球队</th>
          <th>场次</th>
          <th>胜</th>
          <th>平</th>
          <th>负</th>
          <th>进球</th>
          <th>失球</th>
          <th>净胜</th>
          <th>积分</th>
        </tr>
      </thead>
      <tbody>
        ${standingsData.map(team => `
          <tr class="standings-row position-${team.position}">
            <td class="position ${positionClass(team.position)}">
              ${medalIcons[team.position] || team.position}
            </td>
            <td>
              <div class="team-info">
                <div class="team-logo">${team.team.abbr}</div>
                <span class="team-name">${team.team.name}</span>
              </div>
            </td>
            <td>${team.played}</td>
            <td>${team.won}</td>
            <td>${team.drawn}</td>
            <td>${team.lost}</td>
            <td>${team.goalsFor}</td>
            <td>${team.goalsAgainst}</td>
            <td>${team.goalDifference > 0 ? '+' : ''}${team.goalDifference}</td>
            <td class="points">${team.points}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  container.innerHTML = html;
}
