import { api } from './api';
import { DashboardData } from '../types';

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    const response = await api.get<DashboardData>('/dashboard');
    return response?.data ?? {
      todayStats: {
        completedToday: 0,
        totalToday: 0,
        habitStreak: 0,
        weeklyCompletionRate: 0,
      },
      priorityTasks: [],
      upcomingEvents: [],
      latestInsight: null,
    };
  },
};
