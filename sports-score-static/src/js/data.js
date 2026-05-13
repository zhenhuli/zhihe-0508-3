export const teams = {
  premier: [
    { id: 1, name: '曼城', abbr: 'MCI' },
    { id: 2, name: '阿森纳', abbr: 'ARS' },
    { id: 3, name: '利物浦', abbr: 'LIV' },
    { id: 4, name: '曼联', abbr: 'MUN' },
    { id: 5, name: '切尔西', abbr: 'CHE' },
    { id: 6, name: '热刺', abbr: 'TOT' },
    { id: 7, name: '纽卡斯尔', abbr: 'NEW' },
    { id: 8, name: '阿斯顿维拉', abbr: 'AVL' },
    { id: 9, name: '布莱顿', abbr: 'BHA' },
    { id: 10, name: '西汉姆', abbr: 'WHU' },
    { id: 11, name: '水晶宫', abbr: 'CRY' },
    { id: 12, name: '埃弗顿', abbr: 'EVE' },
    { id: 13, name: '伯恩茅斯', abbr: 'BOU' },
    { id: 14, name: '富勒姆', abbr: 'FUL' },
    { id: 15, name: '狼队', abbr: 'WOL' },
    { id: 16, name: '布伦特福德', abbr: 'BRE' },
    { id: 17, name: '诺丁汉森林', abbr: 'NFO' },
    { id: 18, name: '卢顿', abbr: 'LUT' },
    { id: 19, name: '谢菲尔德联', abbr: 'SHU' },
    { id: 20, name: '伯恩利', abbr: 'BUR' }
  ],
  laliga: [
    { id: 21, name: '皇家马德里', abbr: 'RMA' },
    { id: 22, name: '巴塞罗那', abbr: 'FCB' },
    { id: 23, name: '马德里竞技', abbr: 'ATM' },
    { id: 24, name: '皇家社会', abbr: 'RSO' },
    { id: 25, name: '比利亚雷亚尔', abbr: 'VIL' },
    { id: 26, name: '皇家贝蒂斯', abbr: 'BET' },
    { id: 27, name: '塞维利亚', abbr: 'SEV' },
    { id: 28, name: '毕尔巴鄂竞技', abbr: 'BIL' },
    { id: 29, name: '瓦伦西亚', abbr: 'VAL' },
    { id: 30, name: '奥萨苏纳', abbr: 'OSA' }
  ],
  bundesliga: [
    { id: 31, name: '拜仁慕尼黑', abbr: 'FCB' },
    { id: 32, name: '多特蒙德', abbr: 'BVB' },
    { id: 33, name: '莱比锡', abbr: 'RBL' },
    { id: 34, name: '勒沃库森', abbr: 'B04' },
    { id: 35, name: '法兰克福', abbr: 'SGE' },
    { id: 36, name: '门兴', abbr: 'BMG' },
    { id: 37, name: '沃尔夫斯堡', abbr: 'WOB' },
    { id: 38, name: '弗莱堡', abbr: 'SCF' },
    { id: 39, name: '霍芬海姆', abbr: 'HOF' },
    { id: 40, name: '科隆', abbr: 'KOE' }
  ]
};

export const leagues = {
  premier: '英格兰足球超级联赛',
  laliga: '西班牙足球甲级联赛',
  bundesliga: '德国足球甲级联赛'
};

function generateMatches(leagueKey, leagueTeams, baseDate) {
  const matches = [];
  const statuses = ['live', 'finished', 'upcoming'];
  
  for (let i = 0; i < 6; i++) {
    const homeIndex = i * 2 % leagueTeams.length;
    const awayIndex = (i * 2 + 1) % leagueTeams.length;
    const status = statuses[i % 3];
    const date = new Date(baseDate);
    date.setDate(date.getDate() + Math.floor(i / 2));
    
    let homeScore = 0;
    let awayScore = 0;
    let time = '';
    
    if (status === 'live') {
      homeScore = Math.floor(Math.random() * 3);
      awayScore = Math.floor(Math.random() * 3);
      time = `${Math.floor(Math.random() * 45) + 45}'`;
    } else if (status === 'finished') {
      homeScore = Math.floor(Math.random() * 5);
      awayScore = Math.floor(Math.random() * 5);
      time = '已结束';
    } else {
      time = `${15 + Math.floor(Math.random() * 6)}:00`;
    }
    
    matches.push({
      id: `${leagueKey}-${i}`,
      league: leagues[leagueKey],
      homeTeam: leagueTeams[homeIndex],
      awayTeam: leagueTeams[awayIndex],
      homeScore,
      awayScore,
      status,
      time,
      date: date.toISOString().split('T')[0],
      timestamp: date.getTime()
    });
  }
  
  return matches;
}

const baseDate = new Date();
export const matches = [
  ...generateMatches('premier', teams.premier, baseDate),
  ...generateMatches('laliga', teams.laliga, new Date(baseDate.getTime() + 86400000)),
  ...generateMatches('bundesliga', teams.bundesliga, new Date(baseDate.getTime() + 172800000))
];

function generateStandings(leagueTeams) {
  return leagueTeams.slice(0, 10).map((team, index) => {
    const played = 30;
    const won = Math.floor(Math.random() * 20) + 5;
    const drawn = Math.floor(Math.random() * 10) + 2;
    const lost = played - won - drawn;
    const goalsFor = Math.floor(Math.random() * 30) + 30;
    const goalsAgainst = Math.floor(Math.random() * 30) + 20;
    
    return {
      team,
      played,
      won,
      drawn,
      lost,
      goalsFor,
      goalsAgainst,
      goalDifference: goalsFor - goalsAgainst,
      points: won * 3 + drawn
    };
  }).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  }).map((team, index) => ({
    ...team,
    position: index + 1
  }));
}

export const standings = {
  premier: generateStandings(teams.premier),
  laliga: generateStandings(teams.laliga),
  bundesliga: generateStandings(teams.bundesliga)
};

export function getWeekDates(baseDate) {
  const dates = [];
  const startOfWeek = new Date(baseDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push({
      date: date.toISOString().split('T')[0],
      dayName: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
      dayNumber: date.getDate(),
      matchesCount: matches.filter(m => m.date === date.toISOString().split('T')[0]).length
    });
  }
  
  return dates;
}

export function getMatchesByDate(date) {
  return matches.filter(m => m.date === date);
}

export function getLiveMatches() {
  return matches.filter(m => m.status === 'live' || m.status === 'finished');
}
