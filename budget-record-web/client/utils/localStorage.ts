import { BudgetRecord } from '@/types';

const STORAGE_KEY = 'budget_records';

export const loadRecords = (): BudgetRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveRecords = (records: BudgetRecord[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    console.error('Failed to save records to localStorage');
  }
};

export const addRecord = (record: Omit<BudgetRecord, 'id' | 'createdAt'>): BudgetRecord => {
  const records = loadRecords();
  const newRecord: BudgetRecord = {
    ...record,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  const updated = [newRecord, ...records];
  saveRecords(updated);
  return newRecord;
};

export const updateRecord = (id: string, updates: Partial<BudgetRecord>): BudgetRecord | null => {
  const records = loadRecords();
  const index = records.findIndex(r => r.id === id);
  if (index === -1) return null;
  records[index] = { ...records[index], ...updates };
  saveRecords(records);
  return records[index];
};

export const deleteRecord = (id: string): boolean => {
  const records = loadRecords();
  const filtered = records.filter(r => r.id !== id);
  if (filtered.length === records.length) return false;
  saveRecords(filtered);
  return true;
};
