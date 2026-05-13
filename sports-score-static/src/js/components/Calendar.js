export function renderCalendar(dates, containerId, selectedDate, onDateSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = dates.map(date => `
    <div class="calendar-day ${date.date === selectedDate ? 'active' : ''}" data-date="${date.date}">
      <div class="day-name">${date.dayName}</div>
      <div class="day-date">${date.dayNumber}</div>
      <div class="match-count">${date.matchesCount}场</div>
    </div>
  `).join('');

  container.querySelectorAll('.calendar-day').forEach(day => {
    day.addEventListener('click', () => {
      onDateSelect(day.dataset.date);
    });
  });
}

export function updateCurrentDateDisplay(date, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  container.textContent = `${year}年${month}月`;
}
