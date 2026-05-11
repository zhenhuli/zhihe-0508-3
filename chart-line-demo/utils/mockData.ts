import type { ChartData, DateRange } from '~/types/chart'
import { CHART_COLORS } from '~/types/chart'

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}-${day}`
}

function generateDateLabels(count: number, endDate?: Date): string[] {
  const labels: string[] = []
  const end = endDate || new Date()
  
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(end)
    date.setDate(date.getDate() - i)
    labels.push(formatDate(date))
  }
  
  return labels
}

export function generateMockData(days: number = 7): ChartData {
  const categories = generateDateLabels(days)
  
  const seriesNames = [
    '访问量',
    '转化率',
    '点击率',
    '新增用户',
    '活跃用户',
  ]
  
  const series = seriesNames.map((name, index) => ({
    name,
    data: categories.map(() => randomInt(100, 1000)),
    color: CHART_COLORS[index % CHART_COLORS.length],
  }))
  
  return {
    categories,
    series,
  }
}

export function generateDateRange(days: number = 7): DateRange {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - (days - 1))
  
  const formatFullDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  return {
    start: formatFullDate(start),
    end: formatFullDate(end),
  }
}

export function getDaysFromDateRange(range: DateRange): number {
  const start = new Date(range.start)
  const end = new Date(range.end)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1
}
