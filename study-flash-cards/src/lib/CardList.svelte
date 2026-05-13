<script>
  import { cards } from '../store.js';

  export let onEdit;

  const masteryLabels = ['未学习', '学习中', '已掌握', '熟练'];
  const masteryColors = ['bg-gray-200 text-gray-600', 'bg-yellow-100 text-yellow-700', 'bg-green-100 text-green-700', 'bg-emerald-200 text-emerald-800'];
</script>

<div class="bg-white rounded-xl shadow-lg p-6">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold text-gray-800">卡片列表 ({$cards.length})</h3>
    {#if $cards.length > 0}
      <button
        on:click={() => cards.reset()}
        class="text-sm text-red-600 hover:text-red-700 font-medium"
      >
        清空全部
      </button>
    {/if}
  </div>

  {#if $cards.length === 0}
    <div class="text-center py-12 text-gray-500">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
      </svg>
      <p>还没有卡片，添加你的第一张闪卡吧！</p>
    </div>
  {:else}
    <div class="space-y-3 max-h-96 overflow-y-auto">
      {#each $cards as card (card.id)}
        <div class="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-800 truncate">{card.front}</p>
              <p class="text-sm text-gray-500 truncate mt-1">{card.back}</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-1 text-xs font-medium rounded-full {masteryColors[card.mastery]}">
                {masteryLabels[card.mastery]}
              </span>
              <button
                on:click={() => onEdit(card)}
                class="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button
                on:click={() => cards.deleteCard(card.id)}
                class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
