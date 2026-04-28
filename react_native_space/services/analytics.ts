import { api } from './api';
import { ProductivityAnalytics } from '../types';

export const analyticsService = {
  async getProductivity(period: 'week' | 'month' | '3months'): Promise<ProductivityAnalytics> {
    const response = await api.get<ProductivityAnalytics>(`/analytics/productivity?period=${period}`);
    return response?.data ?? {
      completedByDay: [],
      completionRate: 0,
      totalCompleted: 0,
      totalCreated: 0,
      avgCompletionTimeHours: null,
      byCategory: [],
    };
  },
};
