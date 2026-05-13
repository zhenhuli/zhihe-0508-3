<script>
  import { pets, petTypes as petTypesStore } from './store.js';
  
  let showForm = false;
  let editingPet = null;
  let petName = '';
  let petType = '';
  let petBreed = '';
  let petAge = '';
  
  $: petTypes = Object.entries($petTypesStore).map(([key, value]) => ({
    value: key,
    label: `${value.icon} ${value.label}`,
    breeds: value.breeds
  }));
  
  $: currentBreeds = $petTypesStore[petType]?.breeds || [];
  
  function openAddForm() {
    editingPet = null;
    petName = '';
    petType = petTypes.length > 0 ? petTypes[0].value : '';
    petBreed = '';
    petAge = '';
    showForm = true;
  }
  
  function openEditForm(pet) {
    editingPet = pet;
    petName = pet.name;
    petType = pet.type;
    petBreed = pet.breed || '';
    petAge = pet.age || '';
    showForm = true;
  }
  
  function closeForm() {
    showForm = false;
    editingPet = null;
  }
  
  function handleSubmit() {
    if (!petName.trim()) return;
    
    const petData = {
      name: petName.trim(),
      type: petType,
      breed: petBreed.trim(),
      age: petAge.trim()
    };
    
    if (editingPet) {
      pets.update({ ...editingPet, ...petData });
    } else {
      pets.add(petData);
    }
    
    closeForm();
  }
  
  function deletePet(id) {
    if (confirm('确定要删除这个宠物吗？相关的提醒也会被删除。')) {
      pets.delete(id);
    }
  }
  
  function getTypeIcon(type) {
    const found = petTypes.find(t => t.value === type);
    return found ? found.label.split(' ')[0] : '🐾';
  }
</script>

<div class="pet-manager">
  <div class="header">
    <h2>🐾 我的宠物</h2>
    <button class="btn btn-primary" on:click={openAddForm}>+ 添加宠物</button>
  </div>
  
  {#if $pets.length === 0}
    <div class="empty-state">
      <p>还没有添加宠物</p>
      <p class="hint">点击上方按钮添加你的第一个宠物吧！</p>
    </div>
  {:else}
    <div class="pet-list">
      {#each $pets as pet}
        <div class="pet-card">
          <div class="pet-icon">{getTypeIcon(pet.type)}</div>
          <div class="pet-info">
            <h3>{pet.name}</h3>
            <p class="pet-type">{petTypes.find(t => t.value === pet.type)?.label}</p>
            {#if pet.breed}<p class="pet-detail">品种：{pet.breed}</p>{/if}
            {#if pet.age}<p class="pet-detail">年龄：{pet.age}</p>{/if}
          </div>
          <div class="pet-actions">
            <button class="btn-icon" on:click={() => openEditForm(pet)} title="编辑">✏️</button>
            <button class="btn-icon" on:click={() => deletePet(pet.id)} title="删除">🗑️</button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
  
  {#if showForm}
    <div class="modal-overlay" on:click={closeForm}>
      <div class="modal" on:click|stopPropagation>
        <h3>{editingPet ? '编辑宠物' : '添加宠物'}</h3>
        <form on:submit|preventDefault={handleSubmit}>
          <div class="form-group">
            <label>宠物名称 *</label>
            <input type="text" bind:value={petName} placeholder="请输入宠物名称" required>
          </div>
          <div class="form-group">
            <label>宠物类型</label>
            <select bind:value={petType}>
              {#each petTypes as type}
                <option value={type.value}>{type.label}</option>
              {/each}
            </select>
          </div>
          <div class="form-group">
            <label>品种（可选）</label>
            {#if currentBreeds.length > 0}
              <select bind:value={petBreed}>
                <option value="">请选择品种</option>
                {#each currentBreeds as breed}
                  <option value={breed}>{breed}</option>
                {/each}
              </select>
            {:else}
              <input type="text" bind:value={petBreed} placeholder="例如: 金毛、英短">
            {/if}
          </div>
          <div class="form-group">
            <label>年龄（可选）</label>
            <input type="text" bind:value={petAge} placeholder="例如：2岁">
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" on:click={closeForm}>取消</button>
            <button type="submit" class="btn btn-primary" disabled={!petName.trim()}>{editingPet ? '保存' : '添加'}</button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</div>

<style>
  .pet-manager {
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
  
  .pet-list {
    display: grid;
    gap: 16px;
  }
  
  .pet-card {
    display: flex;
    align-items: center;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 10px;
    gap: 16px;
    transition: all 0.2s;
  }
  
  .pet-card:hover {
    background: #e9ecef;
  }
  
  .pet-icon {
    font-size: 48px;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .pet-info {
    flex: 1;
  }
  
  .pet-info h3 {
    margin: 0 0 4px 0;
    font-size: 18px;
    color: #333;
  }
  
  .pet-type {
    margin: 0 0 4px 0;
    font-size: 14px;
    color: #666;
  }
  
  .pet-detail {
    margin: 2px 0;
    font-size: 13px;
    color: #888;
  }
  
  .pet-actions {
    display: flex;
    gap: 8px;
  }
  
  .btn-icon {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
  }
  
  .btn-icon:hover {
    background: #e9ecef;
    transform: scale(1.1);
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
  .form-group select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    box-sizing: border-box;
  }
  
  .form-group input:focus,
  .form-group select:focus {
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
