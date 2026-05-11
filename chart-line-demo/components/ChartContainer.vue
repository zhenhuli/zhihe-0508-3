<template>
  <div
    class="chart-container w-full h-[500px] rounded-xl overflow-hidden shadow-lg"
    :class="[
      theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    ]"
  >
    <div ref="chartRef" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import type { ECharts, EChartsOption } from 'echarts'
import type { ChartType, ThemeType, ChartData, LegendConfig } from '~/types/chart'

const props = defineProps<{
  type: ChartType
  theme: ThemeType
  data: ChartData
  legendConfig: LegendConfig
  showTooltip: boolean
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: ECharts | null = null

const getOption = (): EChartsOption => {
  const visibleSeries = props.data.series.filter((s) => props.legendConfig[s.name])
  
  if (props.type === 'pie') {
    const firstSeries = visibleSeries[0]
    const pieData = firstSeries
      ? props.data.categories.map((cat, index) => ({
          name: cat,
          value: firstSeries.data[index],
        }))
      : []
    
    return {
      title: {
        text: firstSeries?.name || '数据分布',
        left: 'center',
        textStyle: {
          color: props.theme === 'dark' ? '#fff' : '#333',
        },
      },
      tooltip: props.showTooltip
        ? {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
          }
        : undefined,
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
          color: props.theme === 'dark' ? '#ccc' : '#333',
        },
      },
      series: [
        {
          name: firstSeries?.name || '数据',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: props.theme === 'dark' ? '#1f2937' : '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}: {c}',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: true,
          },
          data: pieData,
        },
      ],
    }
  }
  
  const baseOption: EChartsOption = {
    tooltip: props.showTooltip
      ? {
          trigger: 'axis',
          axisPointer: {
            type: props.type === 'line' ? 'cross' : 'shadow',
          },
        }
      : undefined,
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: props.type === 'bar',
      data: props.data.categories,
      axisLine: {
        lineStyle: {
          color: props.theme === 'dark' ? '#4b5563' : '#999',
        },
      },
      axisLabel: {
        color: props.theme === 'dark' ? '#ccc' : '#666',
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: props.theme === 'dark' ? '#4b5563' : '#999',
        },
      },
      axisLabel: {
        color: props.theme === 'dark' ? '#ccc' : '#666',
      },
      splitLine: {
        lineStyle: {
          color: props.theme === 'dark' ? '#374151' : '#eee',
        },
      },
    },
    legend: {
      data: visibleSeries.map((s) => s.name),
      textStyle: {
        color: props.theme === 'dark' ? '#ccc' : '#333',
      },
    },
    series: visibleSeries.map((series) => ({
      name: series.name,
      type: props.type,
      data: series.data,
      smooth: props.type === 'line',
      symbol: props.type === 'line' ? 'circle' : undefined,
      symbolSize: props.type === 'line' ? 6 : undefined,
      itemStyle: {
        color: series.color,
      },
      lineStyle: props.type === 'line'
        ? {
            width: 3,
          }
        : undefined,
      areaStyle: props.type === 'line'
        ? {
            opacity: 0.1,
            color: series.color,
          }
        : undefined,
    })),
  }
  
  return baseOption
}

const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chartInstance) return
  
  chartInstance.setOption(getOption(), true)
}

const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})

watch(
  () => [props.type, props.data, props.legendConfig, props.showTooltip],
  () => {
    updateChart()
  },
  { deep: true }
)

watch(
  () => props.theme,
  () => {
    if (chartRef.value && chartInstance) {
      chartInstance.dispose()
      initChart()
    }
  }
)
</script>
