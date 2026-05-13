<script>
  import { createEventDispatcher } from 'svelte';
  import { categories } from '../data/gifts.js';
  
  const dispatch = createEventDispatcher();
  
  export let selectedPeople = 'all';
  export let selectedBudget = 'all';
  export let selectedHoliday = 'all';
  
  function resetFilters() {
    selectedPeople = 'all';
    selectedBudget = 'all';
    selectedHoliday = 'all';
    dispatch('reset');
  }
</script>

<div class="filter-section">
  <div class="filter-header">
    <h3>筛选条件</h3>
    <button class="reset-btn" on:click={resetFilters}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
        <path d="M3 3v5h5"></path>
      </svg>
      重置筛选
    </button>
  </div>
  
  <div class="filter-group">
    <label class="filter-label">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
      送礼对象
    </label>
    <div class="filter-buttons">
      {#each categories.people as option}
        <button 
          class="filter-btn" 
          class:active={selectedPeople === option.value}
          on:click={() => selectedPeople = option.value}
        >
          {option.label}
        </button>
      {/each}
    </div>
  </div>
  
  <div class="filter-group">
    <label class="filter-label">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
      预算范围
    </label>
    <div class="filter-buttons">
      {#each categories.budget as option}
        <button 
          class="filter-btn" 
          class:active={selectedBudget === option.value}
          on:click={() => selectedBudget = option.value}
        >
          {option.label}
        </button>
      {/each}
    </div>
  </div>
  
  <div class="filter-group">
    <label class="filter-label">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
      节日场合
    </label>
    <div class="filter-buttons">
      {#each categories.holiday as option}
        <button 
          class="filter-btn" 
          class:active={selectedHoliday === option.value}
          on:click={() => selectedHoliday = option.value}
        >
          {option.label}
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  .filter-section {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 32px;
  }
  
  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #eee;
  }
  
  .filter-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
  
  .reset-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: transparent;
    border: 2px solid #e0e0e0;
    color: #666;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
  }
  
  .reset-btn:hover {
    border-color: #667eea;
    color: #667eea;
  }
  
  .reset-btn svg {
    width: 16px;
    height: 16px;
  }
  
  .filter-group {
    margin-bottom: 20px;
  }
  
  .filter-group:last-child {
    margin-bottom: 0;
  }
  
  .filter-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
  }
  
  .filter-label svg {
    width: 20px;
    height: 20px;
    color: #667eea;
  }
  
  .filter-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .filter-btn {
    padding: 10px 20px;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 25px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
    color: #666;
  }
  
  .filter-btn:hover {
    border-color: #667eea;
    color: #667eea;
  }
  
  .filter-btn.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: transparent;
    color: white;
  }
</style>
