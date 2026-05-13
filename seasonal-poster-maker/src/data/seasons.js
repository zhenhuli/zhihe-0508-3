export const seasons = [
  {
    id: 'spring',
    name: '春季',
    icon: '🌸',
    festivals: [
      { id: 'lichun', name: '立春', date: '2月4日' },
      { id: 'yushui', name: '雨水', date: '2月19日' },
      { id: 'jingzhe', name: '惊蛰', date: '3月6日' },
      { id: 'chunfen', name: '春分', date: '3月21日' },
      { id: 'qingming', name: '清明', date: '4月5日' },
      { id: 'guyu', name: '谷雨', date: '4月20日' },
      { id: 'chunjie', name: '春节', date: '农历正月初一' },
      { id: 'yuanxiao', name: '元宵节', date: '农历正月十五' },
    ]
  },
  {
    id: 'summer',
    name: '夏季',
    icon: '☀️',
    festivals: [
      { id: 'lixia', name: '立夏', date: '5月6日' },
      { id: 'xiaoman', name: '小满', date: '5月21日' },
      { id: 'mangzhong', name: '芒种', date: '6月6日' },
      { id: 'xiazhi', name: '夏至', date: '6月21日' },
      { id: 'xiaoshu', name: '小暑', date: '7月7日' },
      { id: 'dashu', name: '大暑', date: '7月23日' },
      { id: 'duanwu', name: '端午节', date: '农历五月初五' },
      { id: 'qixi', name: '七夕节', date: '农历七月初七' },
    ]
  },
  {
    id: 'autumn',
    name: '秋季',
    icon: '🍂',
    festivals: [
      { id: 'liqiu', name: '立秋', date: '8月8日' },
      { id: 'chushu', name: '处暑', date: '8月23日' },
      { id: 'bailu', name: '白露', date: '9月8日' },
      { id: 'qiufen', name: '秋分', date: '9月23日' },
      { id: 'hanlu', name: '寒露', date: '10月8日' },
      { id: 'shuangjiang', name: '霜降', date: '10月24日' },
      { id: 'zhongqiu', name: '中秋节', date: '农历八月十五' },
      { id: 'chongyang', name: '重阳节', date: '农历九月初九' },
    ]
  },
  {
    id: 'winter',
    name: '冬季',
    icon: '❄️',
    festivals: [
      { id: 'lidong', name: '立冬', date: '11月7日' },
      { id: 'xiaoxue', name: '小雪', date: '11月22日' },
      { id: 'daxue', name: '大雪', date: '12月7日' },
      { id: 'dongzhi', name: '冬至', date: '12月22日' },
      { id: 'xiaohan', name: '小寒', date: '1月6日' },
      { id: 'dahan', name: '大寒', date: '1月20日' },
      { id: 'labajie', name: '腊八节', date: '农历腊月初八' },
      { id: 'chuxi', name: '除夕', date: '农历腊月三十' },
    ]
  }
]

export const colorPalettes = {
  spring: [
    { id: 'spring1', name: '桃红柳绿', colors: ['#FFB7C5', '#98D8C8', '#F7DC6F', '#BB8FCE'] },
    { id: 'spring2', name: '樱花漫舞', colors: ['#FFD1DC', '#FF69B4', '#FFB6C1', '#FFF0F5'] },
    { id: 'spring3', name: '春风和煦', colors: ['#87CEEB', '#98FB98', '#F0E68C', '#FFA07A'] },
  ],
  summer: [
    { id: 'summer1', name: '烈日炎炎', colors: ['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1'] },
    { id: 'summer2', name: '清凉一夏', colors: ['#00CED1', '#20B2AA', '#48D1CC', '#40E0D0'] },
    { id: 'summer3', name: '荷塘月色', colors: ['#90EE90', '#98FB98', '#00FA9A', '#3CB371'] },
  ],
  autumn: [
    { id: 'autumn1', name: '金秋送爽', colors: ['#D2691E', '#CD853F', '#DEB887', '#F4A460'] },
    { id: 'autumn2', name: '枫叶如丹', colors: ['#8B4513', '#A0522D', '#CD5C5C', '#DC143C'] },
    { id: 'autumn3', name: '秋高气爽', colors: ['#4682B4', '#5F9EA0', '#708090', '#778899'] },
  ],
  winter: [
    { id: 'winter1', name: '银装素裹', colors: ['#E0FFFF', '#B0E0E6', '#ADD8E6', '#87CEEB'] },
    { id: 'winter2', name: '暖冬暖阳', colors: ['#FF6347', '#FF4500', '#FFD700', '#FFA500'] },
    { id: 'winter3', name: '傲雪凌霜', colors: ['#DC143C', '#B22222', '#8B0000', '#FFFFFF'] },
  ]
}

export const templates = [
  { id: 'simple', name: '简约风格', preview: '简洁大方' },
  { id: 'elegant', name: '优雅风格', preview: '典雅精致' },
  { id: 'festive', name: '喜庆风格', preview: '热闹欢快' },
  { id: 'minimalist', name: '极简风格', preview: '极简主义' },
]
