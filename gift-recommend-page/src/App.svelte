<script>
  import { gifts } from './data/gifts.js';
  import { favorites } from './stores/favorites.js';
  import GiftCard from './components/GiftCard.svelte';
  import FilterSection from './components/FilterSection.svelte';
  
  let selectedPeople = 'all';
  let selectedBudget = 'all';
  let selectedHoliday = 'all';
  let showFavoritesOnly = false;
  
  $: filteredGifts = gifts.filter(gift => {
    const matchPeople = selectedPeople === 'all' || gift.category === selectedPeople;
    const matchBudget = selectedBudget === 'all' || gift.budget === selectedBudget;
    const matchHoliday = selectedHoliday === 'all' || gift.holiday === selectedHoliday;
    const matchFavorite = !showFavoritesOnly || $favorites.includes(gift.id);
    return matchPeople && matchBudget && matchHoliday && matchFavorite;
  });
  
  function resetFilters() {
    selectedPeople = 'all';
    selectedBudget = 'all';
    selectedHoliday = 'all';
    showFavoritesOnly = false;
  }
</script>

<div class="app">
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 12V8H6a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2h12v4"></path>
          <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
          <path d="M18 12h.01"></path>
          <path d="M12 12h.01"></path>
          <path d="M6 12h.01"></path>
        </svg>
        <h1>节日礼物推荐</h1>
      </div>
      <div class="header-actions">
        <button 
          class="favorites-toggle" 
          class:active={showFavoritesOnly}
          on:click={() => showFavoritesOnly = !showFavoritesOnly}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          我的收藏
          <span class="badge">{$favorites.length}</span>
        </button>
      </div>
    </div>
  </header>

  <main class="main">
    <div class="hero-banner">
      <h2>🎁 精选好礼，传递心意</h2>
      <p>为每一个重要的时刻挑选最合适的礼物</p>
    </div>
    
    <FilterSection 
      bind:selectedPeople 
      bind:selectedBudget 
      bind:selectedHoliday 
      on:reset={resetFilters}
    />
    
    <div class="results-info">
      {#if showFavoritesOnly}
        <span class="favorites-label">❤️ 收藏的礼物</span>
      {/if}
      <span>共找到 <strong>{filteredGifts.length}</strong> 件推荐礼物</span>
    </div>
    
    {#if filteredGifts.length > 0}
      <div class="gifts-grid">
        {#each filteredGifts as gift}
          <GiftCard {gift} />
        {/each}
      </div>
    {:else}
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9.17 16a3 3 0 1 0 5.66 0"></path>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
          <path d="M12 8v4"></path>
        </svg>
        <h3>没有找到符合条件的礼物</h3>
        <p>试试调整筛选条件吧</p>
        <button class="reset-btn-large" on:click={resetFilters}>重置所有筛选</button>
      </div>
    {/if}
  </main>

  <footer class="footer">
    <p>© 2024 节日礼物推荐 | 用心挑选每一份礼物</p>
  </footer>
</div>

<style>
  .app {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }
  
  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px 0;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  }
  
  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    color: white;
  }
  
  .logo svg {
    width: 36px;
    height: 36px;
  }
  
  .logo h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
  }
  
  .header-actions {
    display: flex;
    gap: 12px;
  }
  
  .favorites-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
    color: white;
    border-radius: 25px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s;
  }
  
  .favorites-toggle:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  .favorites-toggle.active {
    background: white;
    color: #667eea;
  }
  
  .favorites-toggle svg {
    width: 18px;
    height: 18px;
  }
  
  .favorites-toggle.active svg {
    fill: #ff6b6b;
    stroke: #ff6b6b;
  }
  
  .badge {
    background: #ff6b6b;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 700;
  }
  
  .main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 20px;
  }
  
  .hero-banner {
    text-align: center;
    padding: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    color: white;
    margin-bottom: 32px;
  }
  
  .hero-banner h2 {
    margin: 0 0 12px 0;
    font-size: 28px;
    font-weight: 700;
  }
  
  .hero-banner p {
    margin: 0;
    font-size: 16px;
    opacity: 0.9;
  }
  
  .results-info {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    font-size: 16px;
    color: #555;
  }
  
  .favorites-label {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
    color: white;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
  }
  
  .results-info strong {
    color: #667eea;
    font-size: 20px;
  }
  
  .gifts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }
  
  .empty-state {
    text-align: center;
    padding: 80px 20px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
  
  .empty-state svg {
    width: 80px;
    height: 80px;
    color: #ccc;
    margin-bottom: 20px;
  }
  
  .empty-state h3 {
    margin: 0 0 12px 0;
    font-size: 20px;
    color: #333;
  }
  
  .empty-state p {
    margin: 0 0 24px 0;
    color: #666;
  }
  
  .reset-btn-large {
    padding: 12px 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .reset-btn-large:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }
  
  .footer {
    text-align: center;
    padding: 32px 20px;
    color: #666;
    font-size: 14px;
  }
  
  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      gap: 16px;
    }
    
    .hero-banner h2 {
      font-size: 22px;
    }
    
    .gifts-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
    }
  }
</style>
