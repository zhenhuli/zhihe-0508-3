<template>
  <div class="legend-config p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-200">图例配置</h3>
      <button
        @click="$emit('toggle-all')"
        class="text-xs text-blue-500 hover:text-blue-600 font-medium"
      >
        {{ allVisible ? '全部隐藏' : '全部显示' }}
      </button>
    </div>
    <div class="space-y-2">
      <div
        v-for="series in seriesList"
        :key="series.name"
        class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
        @click="$emit('toggle', series.name)"
      >
        <div
          class="w-4 h-4 rounded-sm flex-shrink-0"
          :style="{ backgroundColor: series.color }"
        ></div>
        <span class="text-sm text-gray-600 dark:text-gray-300 flex-1">{{ series.name }}</span>
        <div
          class="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
          :class="[
            legendConfig[series.name]
              ? 'bg-blue-500 border-blue-500'
              : 'border-gray-300 dark:border-gray-600',
          ]"
        >
          <svg
            v-if="legendConfig[series.name]"
            class="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChartSeries, LegendConfig } from '~/types/chart'
import { computed } from 'vue'

const props = defineProps<{
  seriesList: ChartSeries[]
  legendConfig: LegendConfig
}>()

defineEmits<{
  (e: 'toggle', name: string): void
  (e: 'toggle-all'): void
}>()

const allVisible = computed(() => {
  return Object.values(props.legendConfig).every((v) => v)
})
</script>
