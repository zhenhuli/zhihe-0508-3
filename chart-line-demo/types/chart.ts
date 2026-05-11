export type ChartType = 'line' | 'bar' | 'pie'

export type ThemeType = 'light' | 'dark'

export interface ChartSeries {
  name: string
  data: number[]
  color?: string
}

export interface ChartData {
  categories: string[]
  series: ChartSeries[]
}

export interface LegendConfig {
  [key: string]: boolean
}

export interface DateRange {
  start: string
  end: string
}

export interface ChartConfig {
  type: ChartType
  theme: ThemeType
  data: ChartData
  legend: LegendConfig
  dateRange: DateRange
  showTooltip: boolean
}

export const CHART_COLORS = [
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc',
]
