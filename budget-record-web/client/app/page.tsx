'use client';

import { useState, useEffect } from 'react';
import { BudgetRecord } from '@/types';
import {
  loadRecords,
  addRecord,
  deleteRecord,
} from '@/utils/localStorage';
import {
  getAvailableMonths,
  getRecordsByMonth,
  calculateMonthlySummary,
} from '@/utils/summary';
import RecordForm from '@/components/RecordForm';
import MonthlySummary from '@/components/MonthlySummary';
import Charts from '@/components/Charts';
import RecordList from '@/components/RecordList';
import SyncPanel from '@/components/SyncPanel';

export default function Home() {
  const [records, setRecords] = useState<BudgetRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = loadRecords();
    setRecords(loaded);
    setIsLoaded(true);

    const now = new Date().toISOString().slice(0, 7);
    const months = getAvailableMonths(loaded);
    setSelectedMonth(months.includes(now) ? now : (months[0] || now));
  }, []);

  const months = getAvailableMonths(records);
  const currentMonth = selectedMonth || new Date().toISOString().slice(0, 7);
  const monthlyRecords = getRecordsByMonth(records, currentMonth);
  const summary = calculateMonthlySummary(records, currentMonth);

  const handleAddRecord = (recordData: Omit<BudgetRecord, 'id' | 'createdAt'>) => {
    const newRecord = addRecord(recordData);
    setRecords(prev => [newRecord, ...prev]);

    const newMonth = recordData.date.substring(0, 7);
    if (!months.includes(newMonth)) {
      setSelectedMonth(newMonth);
    }
  };

  const handleDeleteRecord = (id: string) => {
    deleteRecord(id);
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const handleRecordsLoaded = (loadedRecords: BudgetRecord[]) => {
    setRecords(loadedRecords);
    if (loadedRecords.length > 0) {
      const newMonths = getAvailableMonths(loadedRecords);
      const now = new Date().toISOString().slice(0, 7);
      setSelectedMonth(newMonths.includes(now) ? now : (newMonths[0] || now));
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-gray-800">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SyncPanel records={records} onRecordsLoaded={handleRecordsLoaded} />
      <RecordForm onSubmit={handleAddRecord} />
      <MonthlySummary
        summary={summary}
        months={months.length > 0 ? months : [currentMonth]}
        selectedMonth={currentMonth}
        onMonthChange={setSelectedMonth}
      />
      <Charts summary={summary} />
      <RecordList records={monthlyRecords} onDelete={handleDeleteRecord} />
    </div>
  );
}
