'use client';

import { useState, useEffect, useCallback } from 'react';
import { memberApi, planApi } from '@/utils/api';
import MemberModal from './MemberModal';
import type { Member, Plan } from '@/types';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-CN');
}

function getStatusText(status: string) {
  return status === 'active' ? '活跃' : '已过期';
}

function getStatusClass(status: string) {
  return status === 'active' ? 'status-active' : 'status-expired';
}

export default function MembersView() {
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);
  const [status, setStatus] = useState<string>('');
  const [keyword, setKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'new' | 'renew'>('new');
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, pageSize };
      if (status) params.status = status;
      if (keyword) params.keyword = keyword;
      
      const result = await memberApi.list(params);
      setMembers(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error('加载会员失败:', error);
      alert('加载会员列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, status, keyword]);

  const loadPlans = async () => {
    try {
      const data = await planApi.list();
      setPlans(data);
    } catch (error) {
      console.error('加载套餐失败:', error);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleSearch = () => {
    setPage(1);
    loadMembers();
  };

  const handleNewMember = () => {
    if (plans.length === 0) {
      alert('请先创建套餐');
      return;
    }
    setModalMode('new');
    setEditingMember(null);
    setModalVisible(true);
  };

  const handleRenew = (member: Member) => {
    setModalMode('renew');
    setEditingMember(member);
    setModalVisible(true);
  };

  const handleSave = async (data: { name: string; phone: string; planId: string }) => {
    try {
      if (modalMode === 'new') {
        await memberApi.create(data);
        alert('会员开通成功');
      } else if (editingMember) {
        await memberApi.renew(editingMember.id, data.planId);
        alert('续费成功');
      }
      setModalVisible(false);
      setEditingMember(null);
      loadMembers();
    } catch (error: any) {
      console.error('操作失败:', error);
      alert(error.response?.data?.error || '操作失败，请稍后重试');
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">会员管理</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleNewMember}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <span>+</span>
            <span>开通会员</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">状态:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">全部</option>
              <option value="active">活跃</option>
              <option value="expired">已过期</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2 flex-1">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索会员编号、姓名、手机号..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              搜索
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">加载中...</div>
      ) : members.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <p className="text-6xl mb-4">👥</p>
          <p className="text-gray-500 mb-4">暂无会员数据</p>
          <button
            onClick={handleNewMember}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            开通第一个会员
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      会员编号
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      姓名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      手机号
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      套餐
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      开始时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      到期时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {member.memberNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.plan?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(member.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(member.expireDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(member.status)}`}>
                          {getStatusText(member.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleRenew(member)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          续费
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                共 {total} 条记录，第 {page} / {totalPages} 页
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  上一页
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <MemberModal
        visible={modalVisible}
        mode={modalMode}
        member={editingMember}
        plans={plans}
        onClose={() => {
          setModalVisible(false);
          setEditingMember(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
