import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Stats {
  total_downloads: number;
  total_transcriptions: number;
  storage_used: string;
  recent_downloads: any[];
}

export interface Activity {
  id: string;
  type: string;
  status: string;
  timestamp: string;
  details: string;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  timestamp: string;
}

export const dashboardApi = {
  getStats: async (): Promise<Stats> => {
    const response = await api.get('/stats');
    return response.data;
  },

  getActivity: async (): Promise<{ activities: Activity[] }> => {
    const response = await api.get('/activity');
    return response.data;
  },

  getNotifications: async (): Promise<{ notifications: Notification[] }> => {
    const response = await api.get('/notifications');
    return response.data;
  },
}; 