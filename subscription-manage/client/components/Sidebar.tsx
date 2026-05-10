'use client';

import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', name: '数据看板', icon: '📊' },
  { id: 'plans', name: '套餐管理', icon: '📦' },
  { id: 'members', name: '会员管理', icon: '👥' },
  { id: 'records', name: '续费记录', icon: '📋' },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💳</span>
            <h1 className="text-lg font-bold text-gray-800">订阅管理</h1>
          </div>
        )}
        {collapsed && <span className="text-2xl mx-auto">💳</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === item.id
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span>{item.name}</span>}
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        {!collapsed && (
          <p className="text-xs text-gray-400 text-center">
            会员订阅管理系统 v1.0
          </p>
        )}
      </div>
    </aside>
  );
}
