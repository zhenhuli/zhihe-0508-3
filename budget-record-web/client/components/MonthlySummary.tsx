'use client';

import { MonthlySummary as MonthlySummaryType } from '@/types';
import { formatAmount } from '@/utils/summary';

interface MonthlySummaryProps {
  summary: MonthlySummaryType;
  months: string[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export default function MonthlySummary({
  summary,
  months,
  selectedMonth,
  onMonthChange,
}: MonthlySummaryProps) {
  const formatMonth = (month: string) => {
    const [year, m] = month.split('-');
    return `${year}年${m}月`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-gray-900">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">
          月度收支汇总
        </h2>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-800">选择月份：</label>
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900"
          >
            {months.length === 0 ? (
              <option value={new Date().toISOString().slice(0, 7)}>
                {formatMonth(new Date().toISOString().slice(0, 7))}
              </option>
            ) : (
              months.map((month) => (
                <option key={month} value={month} className="text-gray-900">
                  {formatMonth(month)}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <div className="text-sm text-green-700 font-medium mb-2">本月总收入</div>
          <div className="text-3xl font-bold text-green-600">
            ¥{formatAmount(summary.totalIncome)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6">
          <div className="text-sm text-red-700 font-medium mb-2">本月总支出</div>
          <div className="text-3xl font-bold text-red-600">
            ¥{formatAmount(summary.totalExpense)}
          </div>
        </div>

        <div
          className={`rounded-lg p-6 ${
            summary.balance >= 0
              ? 'bg-gradient-to-br from-blue-50 to-blue-100'
              : 'bg-gradient-to-br from-orange-50 to-orange-100'
          }`}
        >
          <div
            className={`text-sm font-medium mb-2 ${
              summary.balance >= 0 ? 'text-blue-700' : 'text-orange-700'
            }`}
          >
            本月结余
          </div>
          <div
            className={`text-3xl font-bold ${
              summary.balance >= 0 ? 'text-blue-600' : 'text-orange-600'
            }`}
          >
            {summary.balance >= 0 ? '+' : ''}¥{formatAmount(summary.balance)}
          </div>
        </div>
      </div>

      {(Object.keys(summary.incomeByCategory).length > 0 ||
        Object.keys(summary.expenseByCategory).length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {Object.keys(summary.incomeByCategory).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">收入分类明细</h3>
              <div className="space-y-2">
                {Object.entries(summary.incomeByCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-800">{category}</span>
                      <span className="font-semibold text-green-600">
                        ¥{formatAmount(amount)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {Object.keys(summary.expenseByCategory).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">支出分类明细</h3>
              <div className="space-y-2">
                {Object.entries(summary.expenseByCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-gray-800">{category}</span>
                      <span className="font-semibold text-red-600">
                        ¥{formatAmount(amount)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
