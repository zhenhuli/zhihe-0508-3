<script>
  import { cards } from '../store.js';

  export let editingCard = null;

  let front = '';
  let back = '';

  $: if (editingCard) {
    front = editingCard.front;
    back = editingCard.back;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;

    if (editingCard) {
      cards.updateCard(editingCard.id, front, back);
    } else {
      cards.addCard(front, back);
    }
    front = '';
    back = '';
    editingCard = null;
  }

  function cancelEdit() {
    front = '';
    back = '';
    editingCard = null;
  }
</script>

<form on:submit={handleSubmit} class="bg-white rounded-xl shadow-lg p-6 mb-6">
  <h3 class="text-lg font-semibold text-gray-800 mb-4">
    {editingCard ? '编辑卡片' : '添加新卡片'}
  </h3>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">正面（问题）</label>
      <textarea
        bind:value={front}
        placeholder="输入问题或概念..."
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-24"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">背面（答案）</label>
      <textarea
        bind:value={back}
        placeholder="输入答案或解释..."
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-24"
      />
    </div>
    <div class="flex gap-3">
      <button
        type="submit"
        class="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        {editingCard ? '保存修改' : '添加卡片'}
      </button>
      {#if editingCard}
        <button
          type="button"
          on:click={cancelEdit}
          class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
      {/if}
    </div>
  </div>
</form>
