<template>
  <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-white text-lg font-semibold">历史记录</h2>
      <button
        v-if="history.length > 0"
        @click="clearHistory"
        class="text-white/60 hover:text-white text-sm transition-colors"
      >
        清空
      </button>
    </div>

    <div v-if="history.length === 0" class="text-center py-8">
      <div class="text-white/40 text-sm">暂无历史记录</div>
      <div class="text-white/20 text-xs mt-2">选择颜色后会自动记录</div>
    </div>

    <div v-else class="grid grid-cols-5 gap-3">
      <div
        v-for="(color, index) in history"
        :key="index"
        class="group relative cursor-pointer"
      >
        <div
          class="w-full aspect-square rounded-xl shadow-lg transition-transform hover:scale-110"
          :style="{ backgroundColor: color }"
        ></div>
        <div class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 flex items-center justify-center">
          <span class="text-white text-xs font-mono">{{ color.toUpperCase() }}</span>
        </div>
        <button
          @click.stop="selectColor(color)"
          class="absolute -top-1 -right-1 w-5 h-5 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-colors"
        >
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  color: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['select'])

const history = ref([])

watch(() => props.color, (newColor) => {
  if (newColor && !history.value.includes(newColor)) {
    history.value.unshift(newColor)
    if (history.value.length > 10) {
      history.value.pop()
    }
  }
})

function selectColor(color) {
  emit('select', color)
}

function clearHistory() {
  history.value = []
}
</script>
