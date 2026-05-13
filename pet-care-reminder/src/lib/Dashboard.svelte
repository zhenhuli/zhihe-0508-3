<script>
  import { pets, reminders, reminderTypes } from './store.js';
  
  function getDaysUntil(dateStr) {
    const now = new Date();
    const target = new Date(dateStr);
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diff;
  }
  
  function getPetName(petId) {
    const pet = $pets.find(p => p.id === petId);
    return pet ? pet.name : '未知';
  }
  
  function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  $: pendingReminders = $reminders.filter(r => !r.completed);
  $: overdueReminders = pendingReminders.filter(r => getDaysUntil(r.date) < 0);
  $: todayReminders = pendingReminders.filter(r => {
    const now = new Date();
    const target = new Date(r.date);
    return now.toDateString() === target.toDateString();
  });
  $: upcomingReminders = pendingReminders.filter(r => getDaysUntil(r.date) > 0 && getDaysUntil(r.date) <= 3);
</script>

<div class="dashboard">
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon">🐾</div>
      <div class="stat-info">
        <div class="stat-value">{$pets.length}</div>
        <div class="stat-label">我的宠物</div>
      </div>
    </div>
    <div class="stat-card warning">
      <div class="stat-icon">⚠️</div>
      <div class="stat-info">
        <div class="stat-value">{overdueReminders.length}</div>
        <div class="stat-label">已逾期</div>
      </div>
    </div>
    <div class="stat-card urgent">
      <div class="stat-icon">📌</div>
      <div class="stat-info">
        <div class="stat-value">{todayReminders.length}</div>
        <div class="stat-label">今日待办</div>
      </div>
    </div>
    <div class="stat-card info">
      <div class="stat-icon">📅</div>
      <div class="stat-info">
        <div class="stat-value">{upcomingReminders.length}</div>
        <div class="stat-label">即将到来</div>
      </div>
    </div>
  </div>
  
  {#if todayReminders.length > 0}
    <div class="today-section">
      <h3>🔔 今日提醒</h3>
      <div class="reminder-mini-list">
        {#each todayReminders as reminder}
          <div class="reminder-mini">
            <span class="mini-icon">{$reminderTypes[reminder.type]?.icon || '📋'}</span>
            <span class="mini-text">{$reminderTypes[reminder.type]?.label || reminder.type} - {getPetName(reminder.petId)} {formatDateTime(reminder.date)}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}
  
  {#if overdueReminders.length > 0}
    <div class="overdue-section">
      <h3>🚨 逾期提醒</h3>
      <div class="reminder-mini-list">
        {#each overdueReminders as reminder}
          <div class="reminder-mini overdue">
            <span class="mini-icon">{$reminderTypes[reminder.type]?.icon || '📋'}</span>
            <span class="mini-text">{$reminderTypes[reminder.type]?.label || reminder.type} - {getPetName(reminder.petId)}</span>
            <span class="mini-days">逾期 {Math.abs(getDaysUntil(reminder.date))} 天</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .dashboard {
    margin-bottom: 24px;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
  }
  
  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .stat-card.warning {
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  }
  
  .stat-card.urgent {
    background: linear-gradient(135deg, #fff8e6 0%, #fef3c7 100%);
  }
  
  .stat-card.info {
    background: linear-gradient(135deg, #e8f4fd 0%, #dbeafe 100%);
  }
  
  .stat-icon {
    font-size: 32px;
  }
  
  .stat-info {
    flex: 1;
  }
  
  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    line-height: 1;
  }
  
  .stat-label {
    font-size: 13px;
    color: #666;
    margin-top: 4px;
  }
  
  .today-section,
  .overdue-section {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .overdue-section {
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  }
  
  .today-section h3,
  .overdue-section h3 {
    margin: 0 0 12px 0;
    font-size: 16px;
    color: #333;
  }
  
  .reminder-mini-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .reminder-mini {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    background: #f8f9fa;
    border-radius: 8px;
    font-size: 14px;
  }
  
  .reminder-mini.overdue {
    background: white;
    border-left: 3px solid #e74c3c;
  }
  
  .mini-icon {
    font-size: 18px;
  }
  
  .mini-text {
    flex: 1;
    color: #444;
  }
  
  .mini-days {
    font-size: 12px;
    color: #e74c3c;
    font-weight: 500;
  }
</style>
