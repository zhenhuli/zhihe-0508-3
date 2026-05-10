import axios from 'axios';
import type { Plan, Member, Record, DailyStats, SummaryStats, PaginatedResponse } from '@/types';

const API_PORT = process.env.NEXT_PUBLIC_API_PORT || process.env.API_PORT || '3003';
const API_BASE = `http://localhost:${API_PORT}/api`;

const api = axios.create({
  baseURL: API_BASE,
});

export const planApi = {
  list: () => api.get<Plan[]>('/plans').then(r => r.data),
  create: (data: Omit<Plan, 'id' | 'createdAt'>) => 
    api.post<Plan>('/plans', data).then(r => r.data),
  update: (id: string, data: Partial<Plan>) => 
    api.put<Plan>(`/plans/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/plans/${id}`).then(r => r.data),
};

export const memberApi = {
  list: (params?: { page?: number; pageSize?: number; status?: string; keyword?: string }) =>
    api.get<PaginatedResponse<Member>>('/members', { params }).then(r => r.data),
  get: (id: string) => api.get<Member>(`/members/${id}`).then(r => r.data),
  create: (data: { name: string; phone: string; planId: string }) =>
    api.post<Member>('/members', data).then(r => r.data),
  renew: (id: string, planId?: string) =>
    api.post<Member>(`/members/${id}/renew`, { planId }).then(r => r.data),
  expiring: (days?: number) =>
    api.get<Member[]>(`/members/expiring`, { params: { days } }).then(r => r.data),
};

export const recordApi = {
  list: (params?: { 
    page?: number; 
    pageSize?: number; 
    type?: string; 
    keyword?: string;
    startDate?: string;
    endDate?: string;
  }) =>
    api.get<PaginatedResponse<Record>>('/records', { params }).then(r => r.data),
};

export const statsApi = {
  daily: (days?: number) =>
    api.get<DailyStats[]>('/stats/daily', { params: { days } }).then(r => r.data),
  summary: () =>
    api.get<SummaryStats>('/stats/summary').then(r => r.data),
};
