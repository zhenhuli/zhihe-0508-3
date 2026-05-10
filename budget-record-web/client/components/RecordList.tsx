'use client';

import { useState } from 'react';
import { BudgetRecord } from '@/types';
import { formatAmount } from '@/utils/summary';

interface RecordListProps {
  records: BudgetRecord[];
  onDelete: (id: string) => void;
}

export default function RecordList({ records, onDelete }: RecordListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  };

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-900">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <p className="text-gray-700 text-lg">暂无账单记录</p>
        <p className="text-gray-500 text-sm mt-2">添加你的第一笔收支记录吧</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-gray-900">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        账单列表
        <span className="ml-2 text-sm font-normal text-gray-600">
          (共 {records.length} 条记录)
        </span>
      </h2>

      <div className="space-y-3">
        {records.map((record) => (
          <div
            key={record.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  record.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {record.type === 'income' ? '💰' : '💳'}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{record.category}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      record.type === 'income'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {record.type === 'income' ? '收入' : '支出'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {formatDate(record.date)}
                  {record.note && <span className="ml-2">· {record.note}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span
                className={`text-xl font-bold ${
                  record.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {record.type === 'income' ? '+' : '-'}¥{formatAmount(record.amount)}
              </span>
              <button
                onClick={() => handleDelete(record.id)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  deleteConfirm === record.id
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-900 hover:bg-red-100 hover:text-red-600'
                }`}
              >
                {deleteConfirm === record.id ? '确认删除' : '删除'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
