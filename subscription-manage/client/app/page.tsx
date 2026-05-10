'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import StatsCards from '@/components/StatsCards';
import DailyChart from '@/components/DailyChart';
import ExpiringList from '@/components/ExpiringList';
import PlansView from '@/components/PlansView';
import MembersView from '@/components/MembersView';
import RecordsView from '@/components/RecordsView';
import MemberModal from '@/components/MemberModal';
import { statsApi, memberApi, planApi } from '@/utils/api';
import type { SummaryStats, DailyStats, Member, Plan } from '@/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [expiringMembers, setExpiringMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [renewModalVisible, setRenewModalVisible] = useState(false);
  const [renewMember, setRenewMember] = useState<Member | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [summary, daily, expiring] = await Promise.all([
        statsApi.summary(),
        statsApi.daily(30),
        memberApi.expiring(7),
      ]);
      setSummaryStats(summary);
      setDailyStats(daily);
      setExpiringMembers(expiring);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPlans = async () => {
    try {
      const data = await planApi.list();
      setPlans(data);
    } catch (error) {
      console.error('加载套餐失败:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadDashboard();
    }
    if (activeTab === 'members' || renewModalVisible) {
      loadPlans();
    }
  }, [activeTab, renewModalVisible, loadDashboard]);

  const handleRenew = (member: Member) => {
    setRenewMember(member);
    setRenewModalVisible(true);
  };

  const handleRenewSubmit = async (data: { name: string; phone: string; planId: string }) => {
    if (!renewMember) return;
    
    try {
      await memberApi.renew(renewMember.id, data.planId);
      alert('续费成功');
      setRenewModalVisible(false);
      setRenewMember(null);
      loadDashboard();
    } catch (error: any) {
      console.error('续费失败:', error);
      alert(error.response?.data?.error || '续费失败，请稍后重试');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">数据看板</h2>
            
            {loading ? (
              <div className="text-center py-12 text-gray-500">加载中...</div>
            ) : summaryStats ? (
              <>
                <StatsCards stats={summaryStats} />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DailyChart data={dailyStats} />
                  <ExpiringList members={expiringMembers} onRenew={handleRenew} />
                </div>
              </>
            ) : null}
          </div>
        );
      
      case 'plans':
        return <PlansView />;
      
      case 'members':
        return <MembersView />;
      
      case 'records':
        return <RecordsView />;
      
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {renderContent()}
      </main>

      <MemberModal
        visible={renewModalVisible}
        mode="renew"
        member={renewMember}
        plans={plans}
        onClose={() => {
          setRenewModalVisible(false);
          setRenewMember(null);
        }}
        onSave={handleRenewSubmit}
      />
    </div>
  );
}
