'use client';

import { useState } from 'react';
import { BudgetRecord, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types';

interface RecordFormProps {
  onSubmit: (record: Omit<BudgetRecord, 'id' | 'createdAt'>) => void;
}

export default function RecordForm({ onSubmit }: RecordFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string>('');

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!category) {
      setError('请选择分类');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('请输入有效的金额');
      return;
    }

    if (!date) {
      setError('请选择日期');
      return;
    }

    onSubmit({
      type,
      category,
      amount: amountNum,
      note,
      date,
    });

    setCategory('');
    setAmount('');
    setNote('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-gray-900">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">添加账单记录</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => {
              setType('expense');
              setCategory('');
            }}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              type === 'expense'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            支出
          </button>
          <button
            type="button"
            onClick={() => {
              setType('income');
              setCategory('');
            }}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              type === 'income'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            收入
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              分类
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900"
              required
            >
              <option value="">请选择分类</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="text-gray-900">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              金额 (元)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="请输入金额"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              日期
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              备注/消费场景
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="例如：午餐、网购、打车等"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all ${
            type === 'income'
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          添加{type === 'income' ? '收入' : '支出'}记录
        </button>
      </form>
    </div>
  );
}
