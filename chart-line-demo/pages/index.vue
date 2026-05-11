<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <header class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">数据可视化展示</h1>
            <p class="mt-2 text-gray-600 dark:text-gray-400">支持折线图、柱状图、饼图一键切换，强大的筛选和配置功能</p>
          </div>
          <div class="flex items-center gap-4">
            <button
              @click="refreshData"
              class="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              刷新数据
            </button>
            <ThemeToggle :theme="theme" @toggle="toggleTheme" />
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:col-span-3 space-y-6">
          <div class="flex flex-wrap gap-4 items-start">
            <ChartTypeSwitcher v-model="chartType" />
            <label class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-md cursor-pointer">
              <input
                type="checkbox"
                :checked="showTooltip"
                @change="toggleTooltip"
                class="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
              />
              <span class="text-sm font-medium text-gray-600 dark:text-gray-300">悬浮提示</span>
            </label>
          </div>

          <ChartContainer
            :type="chartType"
            :theme="theme"
            :data="chartData"
            :legend-config="legendConfig"
            :show-tooltip="showTooltip"
          />

          <DateRangePicker v-model="dateRange" @update:model-value="handleDateRangeUpdate" />
        </div>

        <div class="lg:col-span-1 space-y-6">
          <LegendConfig
            :series-list="chartData.series"
            :legend-config="legendConfig"
            @toggle="toggleLegend"
            @toggle-all="toggleAllLegends"
          />

          <div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">数据统计</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500 dark:text-gray-400">时间周期</span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ dateRange.start }} ~ {{ dateRange.end }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500 dark:text-gray-400">数据点数</span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ chartData.categories.length }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500 dark:text-gray-400">显示系列</span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ visibleSeriesCount }} / {{ chartData.series.length }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500 dark:text-gray-400">当前主题</span>
                <span class="text-sm font-medium" :class="theme === 'dark' ? 'text-blue-400' : 'text-yellow-600'">
                  {{ theme === 'dark' ? '深色' : '浅色' }}
                </span>
              </div>
            </div>
          </div>

          <div class="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md text-white">
            <h3 class="text-sm font-semibold mb-2">使用提示</h3>
            <ul class="text-xs space-y-1 text-blue-100">
              <li>• 点击图表类型按钮切换显示</li>
              <li>• 使用图例配置控制数据系列</li>
              <li>• 选择时间区间筛选数据</li>
              <li>• 切换主题获得不同视觉体验</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const {
  chartType,
  theme,
  chartData,
  legendConfig,
  dateRange,
  showTooltip,
  updateChartType,
  toggleTheme,
  updateDateRange,
  toggleLegend,
  toggleAllLegends,
  toggleTooltip,
  refreshData,
} = useChart()

const visibleSeriesCount = computed(() => {
  return Object.values(legendConfig.value).filter(Boolean).length
})

const handleDateRangeUpdate = (newRange: typeof dateRange.value) => {
  updateDateRange(newRange)
}

watch(chartType, (newType) => {
  updateChartType(newType)
})
</script>
