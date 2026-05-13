import { getLiveMatches, getMatchesByDate, getWeekDates, standings } from './data.js';
import { renderMatches } from './components/MatchCard.js';
import { renderStandings } from './components/Standings.js';
import { renderCalendar, updateCurrentDateDisplay } from './components/Calendar.js';

let currentWeekOffset = 0;
let selectedDate = new Date().toISOString().split('T')[0];
let currentLeague = 'premier';

function initNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.section');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const sectionId = btn.dataset.section;
      
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      sections.forEach(s => s.classList.remove('active'));
      document.getElementById(sectionId).classList.add('active');
    });
  });
}

function initLeagueSelector() {
  const leagueBtns = document.querySelectorAll('.league-btn');
  
  leagueBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const league = btn.dataset.league;
      
      leagueBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentLeague = league;
      renderStandings(standings[league], 'standings-table');
    });
  });
}

function initCalendarNav() {
  const prevBtn = document.getElementById('prev-week');
  const nextBtn = document.getElementById('next-week');

  prevBtn.addEventListener('click', () => {
    currentWeekOffset--;
    updateCalendar();
  });

  nextBtn.addEventListener('click', () => {
    currentWeekOffset++;
    updateCalendar();
  });
}

function updateCalendar() {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + currentWeekOffset * 7);
  
  const weekDates = getWeekDates(baseDate);
  
  updateCurrentDateDisplay(baseDate, 'current-date');
  
  renderCalendar(weekDates, 'calendar-days', selectedDate, handleDateSelect);
}

function handleDateSelect(date) {
  selectedDate = date;
  updateCalendar();
  
  const matches = getMatchesByDate(date);
  renderMatches(matches, 'schedule-matches');
}

function initLiveMatches() {
  const liveMatches = getLiveMatches();
  renderMatches(liveMatches, 'live-matches');
}

function initStandings() {
  renderStandings(standings[currentLeague], 'standings-table');
}

function initSchedule() {
  updateCalendar();
  handleDateSelect(selectedDate);
}

function init() {
  initNavigation();
  initLeagueSelector();
  initCalendarNav();
  initLiveMatches();
  initStandings();
  initSchedule();
}

document.addEventListener('DOMContentLoaded', init);
