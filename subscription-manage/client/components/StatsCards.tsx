import type { SummaryStats } from '@/types';

interface StatsCardsProps {
  stats: SummaryStats;
}

const cardConfig = [
  { 
    key: 'activeCount', 
    label: '活跃会员', 
    color: 'bg-green-50 border-green-200', 
    icon: '✅',
    valueFormat: (v: number) => v.toString()
  },
  { 
    key: 'expiringCount', 
    label: '即将到期', 
    color: 'bg-yellow-50 border-yellow-200', 
    icon: '⚠️',
    valueFormat: (v: number) => v.toString()
  },
  { 
    key: 'expiredCount', 
    label: '已过期', 
    color: 'bg-red-50 border-red-200', 
    icon: '❌',
    valueFormat: (v: number) => v.toString()
  },
  { 
    key: 'todayRevenue', 
    label: '今日收入', 
    color: 'bg-blue-50 border-blue-200', 
    icon: '💰',
    valueFormat: (v: number) => `¥${v.toFixed(2)}`
  },
  { 
    key: 'totalRevenue', 
    label: '累计收入', 
    color: 'bg-purple-50 border-purple-200', 
    icon: '📈',
    valueFormat: (v: number) => `¥${v.toFixed(2)}`
  },
  { 
    key: 'totalPlans', 
    label: '套餐数量', 
    color: 'bg-gray-50 border-gray-200', 
    icon: '📦',
    valueFormat: (v: number) => v.toString()
  },
];

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {cardConfig.map(({ key, label, color, icon, valueFormat }) => (
        <div 
          key={key} 
          className={`${color} border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{label}</p>
              <p className="text-3xl font-bold text-gray-800">
                {valueFormat((stats as any)[key])}
              </p>
            </div>
            <span className="text-4xl opacity-50">{icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
