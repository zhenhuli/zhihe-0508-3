'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { MonthlySummary } from '@/types';
import { formatAmount } from '@/utils/summary';

interface ChartsProps {
  summary: MonthlySummary;
}

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16'];

export default function Charts({ summary }: ChartsProps) {
  const incomeData = Object.entries(summary.incomeByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const expenseData = Object.entries(summary.expenseByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const comparisonData = [
    { name: '收入', value: summary.totalIncome, color: '#10B981' },
    { name: '支出', value: summary.totalExpense, color: '#EF4444' },
    { name: '结余', value: Math.abs(summary.balance), color: '#3B82F6' },
  ];

  if (incomeData.length === 0 && expenseData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-900">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <p className="text-gray-700 text-lg">暂无数据可以展示</p>
        <p className="text-gray-500 text-sm mt-2">添加账单记录后将显示图表分析</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-gray-900">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">数据可视化</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">收支对比</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`¥${formatAmount(value)}`, '金额']}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {incomeData.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">收入构成</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {incomeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`¥${formatAmount(value)}`, '金额']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {expenseData.length > 0 && (
          <div className={`space-y-4 ${incomeData.length === 0 ? 'lg:col-span-2' : ''}`}>
            <h3 className="text-lg font-medium text-gray-800">支出构成</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {expenseData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`¥${formatAmount(value)}`, '金额']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
