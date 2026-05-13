<script>
  import { cards } from '../store.js';

  const masteryLabels = ['未学习', '学习中', '已掌握', '熟练'];
  const masteryColors = ['bg-gray-400', 'bg-yellow-400', 'bg-green-500', 'bg-emerald-600'];

  let masteryCounts = $state([0, 0, 0, 0]);

  $effect(() => {
    const counts = [0, 0, 0, 0];
    $cards.forEach(card => {
      counts[card.mastery] = (counts[card.mastery] || 0) + 1;
    });
    masteryCounts = counts;
  });

  let totalCards = $derived($cards.length);
  let masteredCards = $derived(masteryCounts[2] + masteryCounts[3]);
  let progressPercent = $derived(totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0);
</script>

<div class="bg-white rounded-xl shadow-lg p-6">
  <h3 class="text-lg font-semibold text-gray-800 mb-4">学习统计</h3>

  {#if totalCards === 0}
    <div class="text-center py-8 text-gray-500">
      <p>添加卡片后开始统计学习进度</p>
    </div>
  {:else}
    <div class="mb-6">
      <div class="flex justify-between text-sm mb-2">
        <span class="text-gray-600">总体进度</span>
        <span class="font-medium text-gray-800">{progressPercent}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3">
        <div
          class="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
          style="width: {progressPercent}%"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      {#each [0, 1, 2, 3] as level}
        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div class="w-3 h-3 rounded-full {masteryColors[level]}"></div>
          <div>
            <p class="text-sm text-gray-600">{masteryLabels[level]}</p>
            <p class="text-lg font-bold text-gray-800">{masteryCounts[level]}</p>
          </div>
        </div>
      {/each}
    </div>

    <div class="mt-6 pt-4 border-t border-gray-200">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">总卡片数</span>
        <span class="font-semibold text-gray-800">{totalCards} 张</span>
      </div>
    </div>
  {/if}
</div>
