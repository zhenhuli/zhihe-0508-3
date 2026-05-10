'use client';

import { useState, useEffect } from 'react';
import { planApi } from '@/utils/api';
import PlanModal from './PlanModal';
import type { Plan } from '@/types';

function formatDuration(duration: number, type: string) {
  const unitMap: Record<string, string> = { day: '天', month: '月', year: '年' };
  return `${duration} ${unitMap[type] || type}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-CN');
}

export default function PlansView() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await planApi.list();
      setPlans(data);
    } catch (error) {
      console.error('加载套餐失败:', error);
      alert('加载套餐失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleSave = async (data: Omit<Plan, 'id' | 'createdAt'>) => {
    try {
      if (editingPlan) {
        await planApi.update(editingPlan.id, data);
        alert('套餐更新成功');
      } else {
        await planApi.create(data);
        alert('套餐创建成功');
      }
      setModalVisible(false);
      setEditingPlan(null);
      loadPlans();
    } catch (error: any) {
      console.error('保存套餐失败:', error);
      alert(error.response?.data?.error || '保存失败，请稍后重试');
    }
  };

  const handleDelete = async (plan: Plan) => {
    if (!confirm(`确定要删除套餐"${plan.name}"吗？`)) return;
    
    try {
      await planApi.delete(plan.id);
      alert('套餐删除成功');
      loadPlans();
    } catch (error: any) {
      console.error('删除套餐失败:', error);
      alert(error.response?.data?.error || '删除失败，请稍后重试');
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setModalVisible(true);
  };

  const handleCreate = () => {
    setEditingPlan(null);
    setModalVisible(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">套餐管理</h2>
        <button
          onClick={handleCreate}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <span>+</span>
          <span>创建套餐</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">加载中...</div>
      ) : plans.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <p className="text-6xl mb-4">📦</p>
          <p className="text-gray-500 mb-4">暂无套餐数据</p>
          <button
            onClick={handleCreate}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            创建第一个套餐
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDuration(plan.duration, plan.durationType)}
                  </p>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  ¥{plan.price}
                </span>
              </div>
              
              {plan.description && (
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
              )}
              
              <div className="text-xs text-gray-400 mb-4">
                创建于 {formatDate(plan.createdAt)}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEdit(plan)}
                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(plan)}
                  className="flex-1 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <PlanModal
        visible={modalVisible}
        plan={editingPlan}
        onClose={() => {
          setModalVisible(false);
          setEditingPlan(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
