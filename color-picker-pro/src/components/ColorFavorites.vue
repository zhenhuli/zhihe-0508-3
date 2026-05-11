<template>
  <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-white text-lg font-semibold">配色收藏</h2>
      <button
        @click="toggleAddFavorite"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
        :class="isFavorite ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-white/10 text-white/80 hover:bg-white/20'"
      >
        {{ isFavorite ? '取消收藏' : '添加收藏' }}
      </button>
    </div>

    <div v-if="favorites.length === 0" class="text-center py-8">
      <div class="text-white/40 text-sm">暂无收藏配色</div>
      <div class="text-white/20 text-xs mt-2">点击上方按钮收藏当前颜色</div>
    </div>

    <div v-else class="grid grid-cols-5 gap-3">
      <div
        v-for="(item, index) in favorites"
        :key="index"
        class="group relative cursor-pointer"
      >
        <div
          class="w-full aspect-square rounded-xl shadow-lg transition-transform hover:scale-110"
          :style="{ backgroundColor: item.color }"
        ></div>
        <div class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 flex flex-col items-center justify-center gap-1">
          <span class="text-white text-xs font-mono">{{ item.color.toUpperCase() }}</span>
          <span v-if="item.name" class="text-white/70 text-xs">{{ item.name }}</span>
        </div>
        <div class="absolute top-1 right-1 flex gap-1">
          <button
            @click.stop="selectColor(item.color)"
            class="w-5 h-5 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-colors"
          >
            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
          <button
            @click.stop="removeFavorite(index)"
            class="w-5 h-5 bg-red-500/50 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
          >
            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  color: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['select'])

const favorites = ref([])

const isFavorite = computed(() => {
  return favorites.value.some(item => item.color === props.color)
})

watch(() => props.color, () => {})

function toggleAddFavorite() {
  if (isFavorite.value) {
    favorites.value = favorites.value.filter(item => item.color !== props.color)
  } else {
    favorites.value.push({ color: props.color, name: '' })
  }
}

function selectColor(color) {
  emit('select', color)
}

function removeFavorite(index) {
  favorites.value.splice(index, 1)
}
</script>
