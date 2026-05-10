'use client';

import { useState, useEffect } from 'react';
import { BudgetRecord } from '@/types';
import {
  checkServerHealth,
  fetchBackup,
  uploadBackup,
  deleteBackup,
  BackupData,
} from '@/utils/api';
import { saveRecords } from '@/utils/localStorage';

interface SyncPanelProps {
  records: BudgetRecord[];
  onRecordsLoaded: (records: BudgetRecord[]) => void;
}

export default function SyncPanel({ records, onRecordsLoaded }: SyncPanelProps) {
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [backupData, setBackupData] = useState<BackupData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [confirmRestore, setConfirmRestore] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    const online = await checkServerHealth();
    setServerOnline(online);

    if (online) {
      const backup = await fetchBackup();
      setBackupData(backup);
    } else {
      setBackupData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleBackup = async () => {
    setLoading(true);
    const result = await uploadBackup(records);

    if (result.success) {
      showMessage(
        'success',
        `备份成功！共 ${result.recordCount} 条记录，时间：${new Date().toLocaleString('zh-CN')}`
      );
      await checkStatus();
    } else {
      showMessage('error', '备份失败，请检查服务端是否运行');
    }
    setLoading(false);
  };

  const handleRestore = async () => {
    if (!confirmRestore) {
      setConfirmRestore(true);
      setTimeout(() => setConfirmRestore(false), 5000);
      return;
    }

    setLoading(true);
    const backup = await fetchBackup();

    if (backup && backup.records) {
      saveRecords(backup.records);
      onRecordsLoaded(backup.records);
      showMessage(
        'success',
        `恢复成功！共 ${backup.records.length} 条记录`
      );
    } else {
      showMessage('error', '恢复失败，未找到备份数据');
    }

    setConfirmRestore(false);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 5000);
      return;
    }

    setLoading(true);
    const success = await deleteBackup();

    if (success) {
      showMessage('success', '备份已删除');
      await checkStatus();
    } else {
      showMessage('error', '删除失败');
    }

    setConfirmDelete(false);
    setLoading(false);
  };

  const formatSyncTime = (time: string | null) => {
    if (!time) return '无';
    return new Date(time).toLocaleString('zh-CN');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-gray-900">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">数据同步</h2>

      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : message.type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-blue-50 border border-blue-200 text-blue-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-700 mb-1">服务端状态</div>
          <div className="flex items-center">
            <span
              className={`w-3 h-3 rounded-full mr-2 ${
                serverOnline === null
                  ? 'bg-gray-400'
                  : serverOnline
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            />
            <span className="font-medium text-gray-900">
              {serverOnline === null
                ? '检查中...'
                : serverOnline
                ? '在线'
                : '离线'}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-700 mb-1">本地记录数</div>
          <div className="text-2xl font-bold text-indigo-600">{records.length}</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-700 mb-1">服务端备份</div>
          <div className="font-medium text-gray-900">
            {backupData ? (
              <div>
                <div>{backupData.records?.length || 0} 条记录</div>
                <div className="text-xs text-gray-600">
                  上次同步：{formatSyncTime(backupData.lastSync)}
                </div>
              </div>
            ) : (
              '无备份'
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={checkStatus}
          disabled={loading}
          className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          刷新状态
        </button>

        <button
          onClick={handleBackup}
          disabled={loading || !serverOnline || records.length === 0}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '处理中...' : '备份到服务端'}
        </button>

        <button
          onClick={handleRestore}
          disabled={loading || !serverOnline || !backupData?.records?.length}
          className={`px-4 py-2 rounded-lg transition-colors ${
            confirmRestore
              ? 'bg-orange-500 text-white hover:bg-orange-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {confirmRestore ? '确认恢复（将覆盖本地数据）' : '从服务端恢复'}
        </button>

        <button
          onClick={handleDelete}
          disabled={loading || !serverOnline || !backupData?.records?.length}
          className={`px-4 py-2 rounded-lg transition-colors ${
            confirmDelete
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-red-100 text-red-600 hover:bg-red-200'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {confirmDelete ? '确认删除备份' : '删除服务端备份'}
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        💡 提示：数据主要存储在浏览器本地，服务端仅作为临时备份使用。请确保在清除浏览器数据前进行备份。
      </p>
    </div>
  );
}
