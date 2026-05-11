import type { ChartType, ThemeType, ChartData, LegendConfig, DateRange } from '~/types/chart'
import { generateMockData, generateDateRange, getDaysFromDateRange } from '~/utils/mockData'

export function useChart() {
  const chartType = ref<ChartType>('line')
  const theme = ref<ThemeType>('light')
  const chartData = ref<ChartData>(generateMockData(7))
  const legendConfig = ref<LegendConfig>({})
  const dateRange = ref<DateRange>(generateDateRange(7))
  const showTooltip = ref(true)

  const initLegendConfig = () => {
    legendConfig.value = {}
    chartData.value.series.forEach((series) => {
      legendConfig.value[series.name] = true
    })
  }

  initLegendConfig()

  const updateChartType = (type: ChartType) => {
    chartType.value = type
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const setTheme = (newTheme: ThemeType) => {
    theme.value = newTheme
  }

  const updateDateRange = (range: DateRange) => {
    dateRange.value = range
    const days = getDaysFromDateRange(range)
    chartData.value = generateMockData(days)
    initLegendConfig()
  }

  const toggleLegend = (name: string) => {
    if (legendConfig.value[name] !== undefined) {
      legendConfig.value[name] = !legendConfig.value[name]
    }
  }

  const toggleAllLegends = () => {
    const allVisible = Object.values(legendConfig.value).every((v) => v)
    Object.keys(legendConfig.value).forEach((key) => {
      legendConfig.value[key] = !allVisible
    })
  }

  const toggleTooltip = () => {
    showTooltip.value = !showTooltip.value
  }

  const refreshData = () => {
    const days = getDaysFromDateRange(dateRange.value)
    chartData.value = generateMockData(days)
  }

  return {
    chartType,
    theme,
    chartData,
    legendConfig,
    dateRange,
    showTooltip,
    updateChartType,
    toggleTheme,
    setTheme,
    updateDateRange,
    toggleLegend,
    toggleAllLegends,
    toggleTooltip,
    refreshData,
    initLegendConfig,
  }
}
