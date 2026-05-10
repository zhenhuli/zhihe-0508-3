import axios from 'axios';
import { BudgetRecord } from '@/types';

const API_BASE_URL = 'http://localhost:8888/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

export interface BackupData {
  records: BudgetRecord[];
  lastSync: string | null;
}

export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health');
    return response.data?.success === true;
  } catch {
    return false;
  }
};

export const fetchBackup = async (): Promise<BackupData | null> => {
  try {
    const response = await apiClient.get('/backup');
    if (response.data?.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch backup:', error);
    return null;
  }
};

export const uploadBackup = async (records: BudgetRecord[]): Promise<{
  success: boolean;
  syncTime?: string;
  recordCount?: number;
}> => {
  try {
    const response = await apiClient.post('/backup', { records });
    if (response.data?.success) {
      return {
        success: true,
        syncTime: response.data.syncTime,
        recordCount: response.data.recordCount,
      };
    }
    return { success: false };
  } catch (error) {
    console.error('Failed to upload backup:', error);
    return { success: false };
  }
};

export const deleteBackup = async (): Promise<boolean> => {
  try {
    const response = await apiClient.delete('/backup');
    return response.data?.success === true;
  } catch (error) {
    console.error('Failed to delete backup:', error);
    return false;
  }
};
