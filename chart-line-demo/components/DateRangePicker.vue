<template>
  <div class="date-range-picker p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
    <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">时间区间</h3>
    <div class="flex flex-wrap gap-2 mb-3">
      <button
        v-for="preset in presets"
        :key="preset.days"
        @click="selectPreset(preset.days)"
        class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
        :class="[
          isPresetActive(preset.days)
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
        ]"
      >
        {{ preset.label }}
      </button>
    </div>
    <div class="flex items-center gap-3">
      <div class="flex-1">
        <label class="text-xs text-gray-500 dark:text-gray-400 mb-1 block">开始日期</label>
        <input
          type="date"
          :value="modelValue.start"
          @input="handleStartChange(($event.target as HTMLInputElement).value)"
          class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <span class="text-gray-400 mt-5">至</span>
      <div class="flex-1">
        <label class="text-xs text-gray-500 dark:text-gray-400 mb-1 block">结束日期</label>
        <input
          type="date"
          :value="modelValue.end"
          @input="handleEndChange(($event.target as HTMLInputElement).value)"
          class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DateRange } from '~/types/chart'
import { getDaysFromDateRange } from '~/utils/mockData'

const props = defineProps<{
  modelValue: DateRange
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: DateRange): void
}>()

const presets = [
  { days: 7, label: '近7天' },
  { days: 14, label: '近14天' },
  { days: 30, label: '近30天' },
  { days: 90, label: '近90天' },
]

const selectPreset = (days: number) => {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - (days - 1))
  
  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  emit('update:modelValue', {
    start: formatDate(start),
    end: formatDate(end),
  })
}

const isPresetActive = (days: number): boolean => {
  const currentDays = getDaysFromDateRange(props.modelValue)
  return currentDays === days
}

const handleStartChange = (value: string) => {
  emit('update:modelValue', {
    ...props.modelValue,
    start: value,
  })
}

const handleEndChange = (value: string) => {
  emit('update:modelValue', {
    ...props.modelValue,
    end: value,
  })
}
</script>
