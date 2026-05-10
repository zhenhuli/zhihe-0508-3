import { BudgetRecord, MonthlySummary } from '@/types';

export const getAvailableMonths = (records: BudgetRecord[]): string[] => {
  const months = new Set<string>();
  records.forEach(r => {
    const month = r.date.substring(0, 7);
    months.add(month);
  });
  return Array.from(months).sort().reverse();
};

export const sortRecordsByDateAndTime = (records: BudgetRecord[]): BudgetRecord[] => {
  return [...records].sort((a, b) => {
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateCompare !== 0) {
      return dateCompare;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export const getRecordsByMonth = (records: BudgetRecord[], month: string): BudgetRecord[] => {
  const filtered = records.filter(r => r.date.startsWith(month));
  return sortRecordsByDateAndTime(filtered);
};

export const calculateMonthlySummary = (records: BudgetRecord[], month: string): MonthlySummary => {
  const filtered = getRecordsByMonth(records, month);
  
  let totalIncome = 0;
  let totalExpense = 0;
  const incomeByCategory: Record<string, number> = {};
  const expenseByCategory: Record<string, number> = {};

  filtered.forEach(record => {
    if (record.type === 'income') {
      totalIncome += record.amount;
      incomeByCategory[record.category] = (incomeByCategory[record.category] || 0) + record.amount;
    } else {
      totalExpense += record.amount;
      expenseByCategory[record.category] = (expenseByCategory[record.category] || 0) + record.amount;
    }
  });

  return {
    month,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    incomeByCategory,
    expenseByCategory,
  };
};

export const formatAmount = (amount: number): string => {
  return amount.toFixed(2);
};
