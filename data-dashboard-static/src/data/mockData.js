const generateTrendData = (timeRange) => {
  const data = {
    day: {
      xAxis: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
      revenue: [1200, 800, 600, 900, 2500, 4200, 3800, 4500, 5200, 4800, 3600, 2800],
      orders: [12, 8, 6, 9, 25, 42, 38, 45, 52, 48, 36, 28],
      users: [50, 30, 20, 40, 100, 180, 160, 200, 220, 190, 150, 120]
    },
    week: {
      xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      revenue: [45000, 52000, 48000, 61000, 55000, 72000, 68000],
      orders: [450, 520, 480, 610, 550, 720, 680],
      users: [1800, 2100, 1950, 2400, 2200, 2900, 2700]
    },
    month: {
      xAxis: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      revenue: [1250000, 1180000, 1350000, 1420000, 1580000, 1650000, 1720000, 1890000, 1950000, 2100000, 2250000, 2400000],
      orders: [1250, 1180, 1350, 1420, 1580, 1650, 1720, 1890, 1950, 2100, 2250, 2400],
      users: [5000, 4800, 5400, 5700, 6300, 6600, 6900, 7500, 7800, 8400, 9000, 9600]
    },
    quarter: {
      xAxis: ['Q1', 'Q2', 'Q3', 'Q4'],
      revenue: [3780000, 4650000, 5560000, 6750000],
      orders: [3780, 4650, 5560, 6750],
      users: [15200, 18600, 22200, 27000]
    }
  };
  return data[timeRange] || data.month;
};

const getOverviewData = (timeRange) => {
  const multipliers = {
    day: 1,
    week: 7,
    month: 30,
    quarter: 90
  };
  const m = multipliers[timeRange] || 30;
  
  return {
    totalRevenue: 2400000 * m / 30,
    totalOrders: 2400 * m / 30,
    totalUsers: 9600 * m / 30,
    avgOrderValue: 860,
    revenueGrowth: 12.5,
    orderGrowth: 8.3,
    userGrowth: 15.2,
    avgOrderGrowth: 3.8
  };
};

const getChannelDistribution = () => [
  { name: '直接访问', value: 35 },
  { name: '搜索引擎', value: 28 },
  { name: '社交媒体', value: 18 },
  { name: '邮件营销', value: 12 },
  { name: '其他渠道', value: 7 }
];

const getProductDistribution = () => [
  { name: '电子产品', value: 42 },
  { name: '服装配饰', value: 25 },
  { name: '家居用品', value: 18 },
  { name: '食品饮料', value: 10 },
  { name: '其他品类', value: 5 }
];

const getRegionRanking = () => [
  { rank: 1, region: '华东地区', revenue: 2850000, growth: 18.5, orders: 2850 },
  { rank: 2, region: '华南地区', revenue: 2180000, growth: 12.3, orders: 2180 },
  { rank: 3, region: '华北地区', revenue: 1920000, growth: 15.7, orders: 1920 },
  { rank: 4, region: '西南地区', revenue: 1250000, growth: 9.8, orders: 1250 },
  { rank: 5, region: '华中地区', revenue: 980000, growth: 7.2, orders: 980 },
  { rank: 6, region: '西北地区', revenue: 650000, growth: 5.1, orders: 650 },
  { rank: 7, region: '东北地区', revenue: 520000, growth: 3.9, orders: 520 }
];

const getProductRanking = () => [
  { rank: 1, product: '智能旗舰手机', sales: 12580, revenue: 6290000, growth: 22.5 },
  { rank: 2, product: '无线降噪耳机', sales: 9850, revenue: 2462500, growth: 18.3 },
  { rank: 3, product: '轻薄笔记本', sales: 5420, revenue: 2710000, growth: 15.7 },
  { rank: 4, product: '智能手表', sales: 4890, revenue: 1467000, growth: 12.8 },
  { rank: 5, product: '智能家居套装', sales: 3250, revenue: 975000, growth: 8.6 },
  { rank: 6, product: '便携充电宝', sales: 2180, revenue: 327000, growth: 5.2 }
];

export {
  generateTrendData,
  getOverviewData,
  getChannelDistribution,
  getProductDistribution,
  getRegionRanking,
  getProductRanking
};
