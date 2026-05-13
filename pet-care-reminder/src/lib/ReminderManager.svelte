<script>
  import { pets, reminders, reminderTypes as reminderTypesStore } from './store.js';
  
  let showForm = false;
  let selectedPetId = '';
  let selectedType = '';
  let reminderDate = '';
  let reminderNote = '';
  let intervalDays = 1;
  
  $: reminderTypes = Object.entries($reminderTypesStore).map(([key, value]) => ({
    value: key,
    ...value
  }));
  
  $: if (selectedType && $reminderTypesStore[selectedType]) {
    intervalDays = $reminderTypesStore[selectedType].defaultInterval;
  }
  
  function openForm() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    selectedPetId = $pets.length > 0 ? $pets[0].id : '';
    selectedType = reminderTypes.length > 0 ? reminderTypes[0].value : '';
    reminderDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    reminderNote = '';
    showForm = true;
  }
  
  function closeForm() {
    showForm = false;
  }
  
  function handleSubmit() {
    if (!selectedPetId || !reminderDate) return;
    
    const reminder = {
      petId: selectedPetId,
      type: selectedType,
      date: reminderDate,
      note: reminderNote.trim(),
      intervalDays: parseInt(intervalDays) || 0
    };
    
    reminders.add(reminder);
    closeForm();
  }
  
  function completeReminder(id) {
    reminders.complete(id);
  }
  
  function deleteReminder(id) {
    if (confirm('确定要删除这个提醒吗？')) {
      reminders.delete(id);
    }
  }
  
  function getPetName(petId) {
    const pet = $pets.find(p => p.id === petId);
    return pet ? pet.name : '未知宠物';
  }
  
  function getDaysUntil(dateStr) {
    const now = new Date();
    const target = new Date(dateStr);
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diff;
  }

  function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  function getStatusText(dateStr, completed) {
    if (completed) return '已完成';
    const days = getDaysUntil(dateStr);
    if (days < 0) return `逾期 ${Math.abs(days)} 天`;
    if (days === 0) {
      const now = new Date();
      const target = new Date(dateStr);
      const diffHours = Math.floor((target - now) / (1000 * 60 * 60));
      if (diffHours < 0) return `已过期`;
      if (diffHours < 1) return '即将到期';
      return `今天 ${String(target.getHours()).padStart(2, '0')}:${String(target.getMinutes()).padStart(2, '0')}`;
    }
    if (days === 1) return '明天';
    return `${days} 天后`;
  }
  
  function getStatusClass(dateStr, completed) {
    if (completed) return 'completed';
    const now = new Date();
    const target = new Date(dateStr);
    const diffHours = (target - now) / (1000 * 60 * 60);
    if (diffHours < 0) return 'overdue';
    if (diffHours < 2) return 'urgent';
    if (diffHours < 24) return 'soon';
    return 'normal';
  }
  
  $: pendingReminders = $reminders.filter(r => !r.completed).sort((a, b) => new Date(a.date) - new Date(b.date));
  $: completedReminders = $reminders.filter(r => r.completed).sort((a, b) => new Date(b.date) - new Date(a.date));
</script>

<div class="reminder-manager">
  <div class="header">
    <h2>📅 养护提醒</h2>
    {#if $pets.length > 0}
      <button class="btn btn-primary" on:click={openForm}>+ 添加提醒</button>
    {/if}
  </div>
  
  {#if $pets.length === 0}
    <div class="empty-state">
      <p>请先添加宠物</p>
      <p class="hint">添加宠物后才能创建养护提醒</p>
    </div>
  {:else if pendingReminders.length === 0}
    <div class="empty-state">
      <p>暂无待办提醒</p>
      <p class="hint">点击上方按钮添加新的提醒</p>
    </div>
  {:else}
    <div class="reminder-list">
      {#each pendingReminders as reminder}
        <div class="reminder-card {getStatusClass(reminder.date, reminder.completed)}">
          <div class="reminder-icon">{$reminderTypesStore[reminder.type]?.icon || '📋'}</div>
          <div class="reminder-info">
              <h4>{$reminderTypesStore[reminder.type]?.label || reminder.type}</h4>
              <p class="pet-name">{getPetName(reminder.petId)}</p>
              <p class="reminder-date">{formatDateTime(reminder.date)}</p>
              {#if reminder.note}<p class="reminder-note">{reminder.note}</p>{/if}
            </div>
          <div class="reminder-status">
            <span class="status-badge">{getStatusText(reminder.date, reminder.completed)}</span>
          </div>
          <div class="reminder-actions">
            <button class="btn-icon" on:click={() => completeReminder(reminder.id)} title="标记完成">✅</button>
            <button class="btn-icon" on:click={() => deleteReminder(reminder.id)} title="删除">🗑️</button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
  
  {#if completedReminders.length > 0}
    <div class="completed-section">
      <h3>✅ 已完成</h3>
      <div class="reminder-list completed">
        {#each completedReminders.slice(0, 5) as reminder}
          <div class="reminder-card completed">
            <div class="reminder-icon">{$reminderTypesStore[reminder.type]?.icon || '📋'}</div>
            <div class="reminder-info">
              <h4>{$reminderTypesStore[reminder.type]?.label || reminder.type}</h4>
              <p class="pet-name">{getPetName(reminder.petId)}</p>
              <p class="reminder-date">{formatDateTime(reminder.date)}</p>
            </div>
            <div class="reminder-actions">
              <button class="btn-icon" on:click={() => deleteReminder(reminder.id)} title="删除">🗑️</button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
  
  {#if showForm}
    <div class="modal-overlay" on:click={closeForm}>
      <div class="modal" on:click|stopPropagation>
        <h3>添加养护提醒</h3>
        <form on:submit|preventDefault={handleSubmit}>
          <div class="form-group">
            <label>选择宠物 *</label>
            <select bind:value={selectedPetId} required>
              {#each $pets as pet}
                <option value={pet.id}>{pet.name}</option>
              {/each}
            </select>
          </div>
          <div class="form-group">
            <label>提醒类型 *</label>
            <select bind:value={selectedType}>
              {#each reminderTypes as type}
                <option value={type.value}>{type.icon} {type.label}</option>
              {/each}
            </select>
          </div>
          <div class="form-group">
            <label>提醒日期时间 *</label>
            <input type="datetime-local" bind:value={reminderDate} required>
          </div>
          <div class="form-group">
            <label>重复间隔（天）</label>
            <input type="number" bind:value={intervalDays} min="0" placeholder="0 表示不重复">
          </div>
          <div class="form-group">
            <label>备注（可选）</label>
            <textarea bind:value={reminderNote} placeholder="添加备注信息..." rows="3"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" on:click={closeForm}>取消</button>
            <button type="submit" class="btn btn-primary" disabled={!selectedPetId || !reminderDate}>添加</button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</div>

<style>
  .reminder-manager {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .header h2 {
    margin: 0;
    font-size: 20px;
    color: #333;
  }
  
  .btn {
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  .btn-secondary {
    background: #f0f0f0;
    color: #666;
  }
  
  .btn-secondary:hover {
    background: #e0e0e0;
  }
  
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #999;
  }
  
  .empty-state p {
    margin: 8px 0;
  }
  
  .hint {
    font-size: 14px;
  }
  
  .reminder-list {
    display: grid;
    gap: 12px;
  }
  
  .reminder-list.completed {
    opacity: 0.7;
  }
  
  .reminder-card {
    display: flex;
    align-items: center;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 10px;
    gap: 12px;
    transition: all 0.2s;
    border-left: 4px solid #667eea;
  }
  
  .reminder-card:hover {
    background: #e9ecef;
  }
  
  .reminder-card.overdue {
    border-left-color: #e74c3c;
    background: #fef2f2;
  }
  
  .reminder-card.urgent {
    border-left-color: #f39c12;
    background: #fff8e6;
  }
  
  .reminder-card.soon {
    border-left-color: #3498db;
    background: #e8f4fd;
  }
  
  .reminder-card.completed {
    border-left-color: #27ae60;
    background: #e8f8f0;
    opacity: 0.8;
  }
  
  .reminder-icon {
    font-size: 32px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .reminder-info {
    flex: 1;
  }
  
  .reminder-info h4 {
    margin: 0 0 4px 0;
    font-size: 16px;
    color: #333;
  }
  
  .pet-name {
    margin: 0 0 2px 0;
    font-size: 14px;
    color: #666;
    font-weight: 500;
  }
  
  .reminder-date {
    margin: 0 0 2px 0;
    font-size: 13px;
    color: #888;
  }
  
  .reminder-note {
    margin: 4px 0 0 0;
    font-size: 12px;
    color: #999;
    font-style: italic;
  }
  
  .reminder-status {
    text-align: right;
  }
  
  .status-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    background: #e3e6ef;
    color: #666;
  }
  
  .overdue .status-badge {
    background: #fee2e2;
    color: #dc2626;
  }
  
  .urgent .status-badge {
    background: #fef3c7;
    color: #d97706;
  }
  
  .soon .status-badge {
    background: #dbeafe;
    color: #2563eb;
  }
  
  .completed .status-badge {
    background: #d1fae5;
    color: #059669;
  }
  
  .reminder-actions {
    display: flex;
    gap: 6px;
  }
  
  .btn-icon {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  }
  
  .btn-icon:hover {
    background: #e9ecef;
    transform: scale(1.1);
  }
  
  .completed-section {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #eee;
  }
  
  .completed-section h3 {
    margin: 0 0 12px 0;
    font-size: 16px;
    color: #666;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal {
    background: white;
    border-radius: 12px;
    padding: 24px;
    width: 90%;
    max-width: 400px;
    max-height: 80vh;
    overflow-y: auto;
  }
  
  .modal h3 {
    margin: 0 0 20px 0;
    font-size: 18px;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 16px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #555;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    box-sizing: border-box;
    font-family: inherit;
  }
  
  .form-group textarea {
    resize: vertical;
  }
  
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  .form-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
  }
  
  .form-actions button {
    flex: 1;
  }
</style>
