export interface BudgetRecord {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  note: string;
  date: string;
  createdAt: string;
}

export interface MonthlySummary {
  month: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  incomeByCategory: Record<string, number>;
  expenseByCategory: Record<string, number>;
}

export const INCOME_CATEGORIES = [
  '工资',
  '奖金',
  '投资收益',
  '兼职',
  '其他收入'
];

export const EXPENSE_CATEGORIES = [
  '餐饮',
  '交通',
  '购物',
  '娱乐',
  '医疗',
  '教育',
  '住房',
  '其他支出'
];
