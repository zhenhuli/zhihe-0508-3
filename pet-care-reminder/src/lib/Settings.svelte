<script>
  import { reminderTypes, petTypes } from './store.js';

  let activeTab = 'reminder';
  let editingReminderType = null;
  let editingPetType = null;
  let newReminderKey = '';
  let newReminderLabel = '';
  let newReminderIcon = '';
  let newReminderInterval = 1;
  let newPetKey = '';
  let newPetLabel = '';
  let newPetIcon = '';
  let newBreed = '';
  let selectedPetTypeForBreed = '';

  function openAddReminderType() {
    editingReminderType = null;
    newReminderKey = '';
    newReminderLabel = '';
    newReminderIcon = '';
    newReminderInterval = 1;
  }

  function openEditReminderType(key, type) {
    editingReminderType = key;
    newReminderKey = key;
    newReminderLabel = type.label;
    newReminderIcon = type.icon;
    newReminderInterval = type.defaultInterval;
  }

  function saveReminderType() {
    if (!newReminderKey.trim() || !newReminderLabel.trim()) return;
    
    const key = newReminderKey.trim().toUpperCase().replace(/\s+/g, '_');
    const type = {
      label: newReminderLabel.trim(),
      icon: newReminderIcon.trim() || '📋',
      defaultInterval: parseInt(newReminderInterval) || 1
    };

    if (editingReminderType) {
      if (editingReminderType !== key) {
        reminderTypes.delete(editingReminderType);
      }
      reminderTypes.update(key, type);
    } else {
      reminderTypes.add(key, type);
    }
    
    editingReminderType = null;
  }

  function deleteReminderType(key) {
    if (confirm(`确定要删除提醒类型"${$reminderTypes[key].label}"吗？`)) {
      reminderTypes.delete(key);
    }
  }

  function openAddPetType() {
    editingPetType = null;
    newPetKey = '';
    newPetLabel = '';
    newPetIcon = '';
  }

  function openEditPetType(key, type) {
    editingPetType = key;
    newPetKey = key;
    newPetLabel = type.label;
    newPetIcon = type.icon;
  }

  function savePetType() {
    if (!newPetKey.trim() || !newPetLabel.trim()) return;
    
    const key = newPetKey.trim().toLowerCase().replace(/\s+/g, '_');
    const type = {
      label: newPetLabel.trim(),
      icon: newPetIcon.trim() || '🐾',
      breeds: $petTypes[key]?.breeds || ['其他']
    };

    if (editingPetType) {
      if (editingPetType !== key) {
        petTypes.delete(editingPetType);
      }
      petTypes.update(key, type);
    } else {
      petTypes.add(key, type);
    }
    
    editingPetType = null;
  }

  function deletePetType(key) {
    if (confirm(`确定要删除宠物类型"${$petTypes[key].label}"吗？`)) {
      petTypes.delete(key);
    }
  }

  function addBreed() {
    if (!selectedPetTypeForBreed || !newBreed.trim()) return;
    petTypes.addBreed(selectedPetTypeForBreed, newBreed.trim());
    newBreed = '';
  }

  function deleteBreed(typeKey, breedIndex) {
    if (confirm('确定要删除这个品种吗？')) {
      petTypes.deleteBreed(typeKey, breedIndex);
    }
  }
</script>

<div class="settings">
  <div class="settings-header">
    <h2>⚙️ 设置</h2>
  </div>

  <div class="tabs">
    <button class="tab {activeTab === 'reminder' ? 'active' : ''}" on:click={() => activeTab = 'reminder'}>
      📋 提醒类型
    </button>
    <button class="tab {activeTab === 'pet' ? 'active' : ''}" on:click={() => activeTab = 'pet'}>
      🐾 宠物类型
    </button>
  </div>

  {#if activeTab === 'reminder'}
    <div class="tab-content">
      <div class="section-header">
        <h3>提醒类型管理</h3>
        <button class="btn btn-primary" on:click={openAddReminderType}>+ 添加类型</button>
      </div>

      <div class="type-list">
        {#each Object.entries($reminderTypes) as [key, type]}
          <div class="type-item">
            <span class="type-icon">{type.icon}</span>
            <div class="type-info">
              <div class="type-name">{type.label}</div>
              <div class="type-meta">默认间隔: {type.defaultInterval} 天</div>
            </div>
            <div class="type-actions">
              <button class="btn-icon" on:click={() => openEditReminderType(key, type)}>✏️</button>
              <button class="btn-icon" on:click={() => deleteReminderType(key)}>🗑️</button>
            </div>
          </div>
        {/each}
      </div>

      {#if editingReminderType !== null || newReminderKey}
        <div class="form-card">
          <h4>{editingReminderType ? '编辑提醒类型' : '添加提醒类型'}</h4>
          <div class="form-group">
            <label>类型键名（英文）</label>
            <input type="text" bind:value={newReminderKey} placeholder="例如: FEED">
          </div>
          <div class="form-group">
            <label>显示名称</label>
            <input type="text" bind:value={newReminderLabel} placeholder="例如: 喂食">
          </div>
          <div class="form-group">
            <label>图标（emoji）</label>
            <input type="text" bind:value={newReminderIcon} placeholder="例如: 🍖">
          </div>
          <div class="form-group">
            <label>默认间隔（天）</label>
            <input type="number" bind:value={newReminderInterval} min="0">
          </div>
          <div class="form-actions">
            <button class="btn btn-secondary" on:click={() => editingReminderType = null}>取消</button>
            <button class="btn btn-primary" on:click={saveReminderType}>保存</button>
          </div>
        </div>
      {/if}

      <button class="btn btn-secondary reset-btn" on:click={() => reminderTypes.reset()}>恢复默认提醒类型</button>
    </div>
  {/if}

  {#if activeTab === 'pet'}
    <div class="tab-content">
      <div class="section-header">
        <h3>宠物类型管理</h3>
        <button class="btn btn-primary" on:click={openAddPetType}>+ 添加类型</button>
      </div>

      <div class="type-list">
        {#each Object.entries($petTypes) as [key, type]}
          <div class="type-item">
            <span class="type-icon">{type.icon}</span>
            <div class="type-info">
              <div class="type-name">{type.label}</div>
              <div class="type-meta">{type.breeds.length} 个品种</div>
            </div>
            <div class="type-actions">
              <button class="btn-icon" on:click={() => openEditPetType(key, type)}>✏️</button>
              <button class="btn-icon" on:click={() => deletePetType(key)}>🗑️</button>
            </div>
          </div>
          
          {#if selectedPetTypeForBreed === key}
            <div class="breed-section">
              <div class="breed-header">
                <span>品种列表</span>
                <button class="btn-icon" on:click={() => selectedPetTypeForBreed = ''}>✕</button>
              </div>
              <div class="breed-list">
                {#each type.breeds as breed, index}
                  <div class="breed-item">
                    <span>{breed}</span>
                    <button class="btn-icon small" on:click={() => deleteBreed(key, index)}>✕</button>
                  </div>
                {/each}
              </div>
              <div class="add-breed">
                <input type="text" bind:value={newBreed} placeholder="添加新品种">
                <button class="btn btn-primary" on:click={addBreed}>添加</button>
              </div>
            </div>
          {:else}
            <button class="breed-toggle" on:click={() => selectedPetTypeForBreed = key}>管理品种 ▼</button>
          {/if}
        {/each}
      </div>

      {#if editingPetType !== null || newPetKey}
        <div class="form-card">
          <h4>{editingPetType ? '编辑宠物类型' : '添加宠物类型'}</h4>
          <div class="form-group">
            <label>类型键名（英文）</label>
            <input type="text" bind:value={newPetKey} placeholder="例如: dog">
          </div>
          <div class="form-group">
            <label>显示名称</label>
            <input type="text" bind:value={newPetLabel} placeholder="例如: 狗">
          </div>
          <div class="form-group">
            <label>图标（emoji）</label>
            <input type="text" bind:value={newPetIcon} placeholder="例如: 🐕">
          </div>
          <div class="form-actions">
            <button class="btn btn-secondary" on:click={() => editingPetType = null}>取消</button>
            <button class="btn btn-primary" on:click={savePetType}>保存</button>
          </div>
        </div>
      {/if}

      <button class="btn btn-secondary reset-btn" on:click={() => petTypes.reset()}>恢复默认宠物类型</button>
    </div>
  {/if}
</div>

<style>
  .settings {
    background: white;
    border-radius: 12px;
    padding: 24px;
    max-height: 70vh;
    overflow-y: auto;
  }

  .settings-header h2 {
    margin: 0 0 20px 0;
    font-size: 20px;
    color: #333;
  }

  .tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    padding-bottom: 12px;
  }

  .tab {
    padding: 10px 20px;
    border: none;
    background: #f5f5f5;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  }

  .tab:hover {
    background: #e8e8e8;
  }

  .tab.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .tab-content {
    min-height: 400px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .section-header h3 {
    margin: 0;
    font-size: 16px;
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

  .btn-secondary {
    background: #f0f0f0;
    color: #666;
  }

  .btn-secondary:hover {
    background: #e0e0e0;
  }

  .type-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }

  .type-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background: #f8f9fa;
    border-radius: 8px;
    gap: 12px;
  }

  .type-icon {
    font-size: 24px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 8px;
  }

  .type-info {
    flex: 1;
  }

  .type-name {
    font-weight: 600;
    color: #333;
  }

  .type-meta {
    font-size: 12px;
    color: #888;
  }

  .type-actions {
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

  .btn-icon.small {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }

  .breed-toggle {
    border: none;
    background: none;
    color: #667eea;
    cursor: pointer;
    font-size: 13px;
    padding: 4px 8px;
    margin-left: 64px;
    margin-bottom: 12px;
    border-radius: 4px;
  }

  .breed-toggle:hover {
    background: #f0f0f0;
  }

  .breed-section {
    margin-left: 64px;
    margin-bottom: 12px;
    padding: 12px;
    background: white;
    border-radius: 8px;
    border: 1px solid #eee;
  }

  .breed-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-weight: 500;
    font-size: 14px;
    color: #555;
  }

  .breed-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }

  .breed-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: #f0f0f0;
    border-radius: 16px;
    font-size: 13px;
  }

  .add-breed {
    display: flex;
    gap: 8px;
  }

  .add-breed input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
  }

  .form-card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
  }

  .form-card h4 {
    margin: 0 0 16px 0;
    font-size: 15px;
    color: #333;
  }

  .form-group {
    margin-bottom: 12px;
  }

  .form-group label {
    display: block;
    margin-bottom: 6px;
    font-size: 13px;
    font-weight: 500;
    color: #555;
  }

  .form-group input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
  }

  .form-actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }

  .reset-btn {
    width: 100%;
    margin-top: 16px;
  }
</style>
