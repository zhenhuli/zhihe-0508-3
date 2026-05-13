<script>
  import Dashboard from './lib/Dashboard.svelte';
  import PetManager from './lib/PetManager.svelte';
  import ReminderManager from './lib/ReminderManager.svelte';
  import Settings from './lib/Settings.svelte';

  let showSettings = false;
</script>

<div class="app">
  <header class="app-header">
    <div class="header-content">
      <div class="header-text">
        <h1>🐾 宠物养护提醒</h1>
        <p class="subtitle">记录爱宠的每一个重要时刻</p>
      </div>
      <button class="settings-btn" on:click={() => showSettings = true} title="设置">
        ⚙️
      </button>
    </div>
  </header>
  
  <main class="app-main">
    <Dashboard />
    
    <div class="content-grid">
      <PetManager />
      <ReminderManager />
    </div>
  </main>
  
  <footer class="app-footer">
    <p>💝 用心呵护每一位毛孩子</p>
  </footer>

  {#if showSettings}
    <div class="modal-overlay" on:click={() => showSettings = false}>
      <div class="modal" on:click|stopPropagation>
        <div class="modal-header">
          <h3>设置</h3>
          <button class="close-btn" on:click={() => showSettings = false}>✕</button>
        </div>
        <Settings />
      </div>
    </div>
  {/if}
</div>

<style>
  .app {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
  }
  
  .app-header {
    color: white;
    margin-bottom: 30px;
  }
  
  .header-content {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header-text {
    text-align: center;
    flex: 1;
  }
  
  .app-header h1 {
    margin: 0 0 8px 0;
    font-size: 32px;
    font-weight: 700;
  }
  
  .subtitle {
    margin: 0;
    font-size: 16px;
    opacity: 0.9;
  }
  
  .settings-btn {
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.2s;
    backdrop-filter: blur(4px);
  }
  
  .settings-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(30deg);
  }
  
  .app-main {
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
  @media (max-width: 768px) {
    .content-grid {
      grid-template-columns: 1fr;
    }
    
    .app-header h1 {
      font-size: 24px;
    }
  }
  
  .app-footer {
    text-align: center;
    color: white;
    margin-top: 30px;
    opacity: 0.8;
  }
  
  .app-footer p {
    margin: 0;
    font-size: 14px;
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
    padding: 20px;
  }

  .modal {
    background: white;
    border-radius: 16px;
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow: hidden;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #eee;
  }

  .modal-header h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 8px;
    background: #f5f5f5;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
  }

  .close-btn:hover {
    background: #e8e8e8;
  }
</style>
