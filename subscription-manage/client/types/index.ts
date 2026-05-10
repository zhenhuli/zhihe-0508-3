export interface Plan {
  id: string;
  name: string;
  duration: number;
  durationType: 'day' | 'month' | 'year';
  price: number;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Member {
  id: string;
  memberNo: string;
  name: string;
  phone: string;
  planId: string;
  status: 'active' | 'expired';
  startDate: string;
  expireDate: string;
  createdAt: string;
  updatedAt?: string;
  plan?: Plan;
}

export interface Record {
  id: string;
  memberId: string;
  memberName: string;
  memberNo: string;
  planId: string;
  planName: string;
  type: 'new' | 'renew';
  amount: number;
  startDate: string;
  expireDate: string;
  createdAt: string;
}

export interface DailyStats {
  date: string;
  newCount: number;
  expireCount: number;
}

export interface SummaryStats {
  activeCount: number;
  expiredCount: number;
  expiringCount: number;
  totalRevenue: number;
  todayRevenue: number;
  totalPlans: number;
  totalMembers: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
