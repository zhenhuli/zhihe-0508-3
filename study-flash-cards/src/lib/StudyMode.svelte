<script>
  import { cards } from '../store.js';

  let currentCard = $state(null);
  let isFlipped = $state(false);

  const masteryLabels = ['未学习', '学习中', '已掌握', '熟练'];
  const masteryColors = ['bg-gray-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-600'];

  function drawRandomCard() {
    if ($cards.length === 0) return;
    const randomIndex = Math.floor(Math.random() * $cards.length);
    currentCard = $cards[randomIndex];
    isFlipped = false;
  }

  function flipCard() {
    isFlipped = !isFlipped;
  }

  function setMastery(level) {
    if (currentCard) {
      cards.updateMastery(currentCard.id, level);
      drawRandomCard();
    }
  }

  function skipCard() {
    drawRandomCard();
  }

  $effect(() => {
    if ($cards.length > 0 && !currentCard) {
      drawRandomCard();
    }
  });
</script>

<div class="bg-white rounded-xl shadow-lg p-6">
  <div class="flex items-center justify-between mb-6">
    <h3 class="text-lg font-semibold text-gray-800">学习模式</h3>
    <span class="text-sm text-gray-500">剩余 {$cards.length} 张卡片</span>
  </div>

  {#if $cards.length === 0}
    <div class="text-center py-12 text-gray-500">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>
      <p>先添加一些卡片再来学习吧！</p>
    </div>
  {:else if currentCard}
    <div class="perspective-1000 mb-6">
      <div
        class="relative w-full h-64 cursor-pointer transition-transform duration-500 transform-style-preserve-3d"
        class:rotate-y-180={isFlipped}
        on:click={flipCard}
      >
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center p-8 card-face card-front">
          <div class="text-center">
            <p class="text-sm text-indigo-100 mb-2">点击翻转查看答案</p>
            <p class="text-2xl font-bold text-white">{currentCard.front}</p>
          </div>
        </div>
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center p-8 card-face card-back">
          <div class="text-center">
            <p class="text-sm text-emerald-100 mb-2">答案</p>
            <p class="text-2xl font-bold text-white">{currentCard.back}</p>
          </div>
        </div>
      </div>
    </div>

    {#if isFlipped}
      <div class="space-y-4">
        <p class="text-center text-sm text-gray-600 mb-2">你掌握得怎么样？</p>
        <div class="grid grid-cols-4 gap-2">
          {#each [0, 1, 2, 3] as level}
            <button
              on:click={() => setMastery(level)}
              class="py-3 px-4 rounded-lg text-white font-medium text-sm transition-all hover:scale-105 {masteryColors[level]}"
            >
              {masteryLabels[level]}
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <div class="mt-6 flex justify-center">
      <button
        on:click={skipCard}
        class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
      >
        跳过这张
      </button>
    </div>
  {/if}
</div>

<style>
  .perspective-1000 {
    perspective: 1000px;
  }
  .transform-style-preserve-3d {
    transform-style: preserve-3d;
  }
  .card-face {
    backface-visibility: hidden;
  }
  .card-back {
    transform: rotateY(180deg);
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
</style>
