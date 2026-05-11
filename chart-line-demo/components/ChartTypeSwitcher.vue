<template>
  <div class="chart-type-switcher flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md">
    <span class="text-sm font-medium text-gray-600 dark:text-gray-300 mr-2">图表类型:</span>
    <button
      v-for="type in chartTypes"
      :key="type.value"
      @click="$emit('update:modelValue', type.value)"
      class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
      :class="[
        modelValue === type.value
          ? 'bg-blue-500 text-white shadow-md'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
      ]"
    >
      <component :is="type.icon" class="w-4 h-4" />
      {{ type.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ChartType } from '~/types/chart'
import { h } from 'vue'

const LineIcon = {
  render() {
    return h(
      'svg',
      { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
      [
        h('path', { d: 'M3 3v18h18' }),
        h('path', { d: 'm19 9-5 5-4-4-3 3' }),
      ]
    )
  },
}

const BarIcon = {
  render() {
    return h(
      'svg',
      { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
      [
        h('line', { x1: '12', x2: '12', y1: '20', y2: '10' }),
        h('line', { x1: '18', x2: '18', y1: '20', y2: '4' }),
        h('line', { x1: '6', x2: '6', y1: '20', y2: '16' }),
      ]
    )
  },
}

const PieIcon = {
  render() {
    return h(
      'svg',
      { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
      [
        h('path', { d: 'M21.21 15.89A10 10 0 1 1 8 2.83' }),
        h('path', { d: 'M22 12A10 10 0 0 0 12 2v10z' }),
      ]
    )
  },
}

const chartTypes = [
  { value: 'line' as ChartType, label: '折线图', icon: LineIcon },
  { value: 'bar' as ChartType, label: '柱状图', icon: BarIcon },
  { value: 'pie' as ChartType, label: '饼图', icon: PieIcon },
]

defineProps<{
  modelValue: ChartType
}>()

defineEmits<{
  (e: 'update:modelValue', value: ChartType): void
}>()
</script>
