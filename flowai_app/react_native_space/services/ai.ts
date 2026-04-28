import { api } from './api';
import { AiInsight } from '../types';

export const aiService = {
  async suggestPriority(taskId: string): Promise<{ suggestedPriority: string; reasoning: string }> {
    const response = await api.post<{ suggestedPriority: string; reasoning: string }>('/ai/suggest-priority', { taskId });
    return response?.data ?? { suggestedPriority: 'medium', reasoning: '' };
  },

  async getInsights(): Promise<{ insights: AiInsight[] }> {
    const response = await api.get<{ insights: AiInsight[] }>('/ai/insights');
    return response?.data ?? { insights: [] };
  },

  async generateInsights(): Promise<{ insights: AiInsight[] }> {
    const response = await api.post<{ insights: AiInsight[] }>('/ai/generate-insights');
    return response?.data ?? { insights: [] };
  },
};
