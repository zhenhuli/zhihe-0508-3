<script>
  import CardForm from './lib/CardForm.svelte';
  import CardList from './lib/CardList.svelte';
  import StudyMode from './lib/StudyMode.svelte';
  import Stats from './lib/Stats.svelte';

  let editingCard = null;
  let activeTab = 'manage';

  function handleEdit(card) {
    editingCard = card;
    activeTab = 'manage';
  }

  function handleTabChange(tab) {
    activeTab = tab;
    if (tab === 'manage') {
      editingCard = null;
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-8 px-4">
  <div class="max-w-4xl mx-auto">
    <header class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">📚 学习闪卡</h1>
      <p class="text-gray-600">高效记忆，轻松学习</p>
    </header>

    <div class="flex gap-2 mb-6 bg-white rounded-xl p-2 shadow-md">
      <button
        on:click={() => handleTabChange('manage')}
        class="flex-1 py-2.5 px-4 rounded-lg font-medium transition-all {activeTab === 'manage' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}"
      >
        管理卡片
      </button>
      <button
        on:click={() => handleTabChange('study')}
        class="flex-1 py-2.5 px-4 rounded-lg font-medium transition-all {activeTab === 'study' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}"
      >
        学习模式
      </button>
    </div>

    {#if activeTab === 'manage'}
      <CardForm bind:editingCard />
      <div class="grid md:grid-cols-2 gap-6">
        <CardList onEdit={handleEdit} />
        <Stats />
      </div>
    {:else}
      <div class="grid md:grid-cols-2 gap-6">
        <StudyMode />
        <Stats />
      </div>
    {/if}
  </div>
</div>
