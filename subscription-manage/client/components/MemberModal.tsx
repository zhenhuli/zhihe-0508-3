'use client';

import { useState, useEffect } from 'react';
import type { Plan, Member } from '@/types';

interface MemberModalProps {
  visible: boolean;
  mode: 'new' | 'renew';
  member: Member | null;
  plans: Plan[];
  onClose: () => void;
  onSave: (data: { name: string; phone: string; planId: string }) => void;
}

export default function MemberModal({ 
  visible, 
  mode, 
  member, 
  plans, 
  onClose, 
  onSave 
}: MemberModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    planId: '',
  });

  useEffect(() => {
    if (mode === 'renew' && member) {
      setFormData({
        name: member.name,
        phone: member.phone,
        planId: member.planId,
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        planId: plans.length > 0 ? plans[0].id : '',
      });
    }
  }, [member, plans, mode, visible]);

  if (!visible) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const title = mode === 'renew' ? '会员续费' : '开通会员';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'new' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入姓名"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  手机号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{11}"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入11位手机号"
                />
              </div>
            </>
          )}
          
          {mode === 'renew' && member && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">会员编号</span>
                <span className="font-medium">{member.memberNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">姓名</span>
                <span className="font-medium">{member.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">手机号</span>
                <span className="font-medium">{member.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">当前套餐</span>
                <span className="font-medium">{member.plan?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">到期时间</span>
                <span className="font-medium">
                  {new Date(member.expireDate).toLocaleDateString('zh-CN')}
                </span>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              选择套餐 <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.planId}
              onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {plans.length === 0 ? (
                <option value="">暂无套餐，请先创建</option>
              ) : (
                plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - ¥{plan.price}（{plan.duration} {plan.durationType === 'day' ? '天' : plan.durationType === 'month' ? '月' : '年'}）
                  </option>
                ))
              )}
            </select>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={plans.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode === 'renew' ? '确认续费' : '确认开通'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
