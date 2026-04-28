import { api } from './api';
import { Habit, HabitCompletion } from '../types';

interface HabitsResponse {
  items: Habit[];
  maxFreeHabits: number;
  isPremium: boolean;
}

export const habitsService = {
  async getHabits(): Promise<HabitsResponse> {
    const response = await api.get<HabitsResponse>('/habits');
    return response?.data ?? { items: [], maxFreeHabits: 3, isPremium: false };
  },

  async createHabit(data: { name: string; description?: string; frequency: string }): Promise<Habit> {
    const response = await api.post<Habit>('/habits', data);
    return response?.data ?? ({} as Habit);
  },

  async updateHabit(id: string, data: Partial<Habit>): Promise<Habit> {
    const response = await api.patch<Habit>(`/habits/${id}`, data);
    return response?.data ?? ({} as Habit);
  },

  async deleteHabit(id: string): Promise<void> {
    await api.delete(`/habits/${id}`);
  },

  async completeHabit(id: string, date?: string): Promise<{ habitId: string; completedAt: string; currentStreak: number }> {
    const response = await api.post<{ habitId: string; completedAt: string; currentStreak: number }>(
      `/habits/${id}/complete`,
      date ? { date } : {}
    );
    return response?.data ?? { habitId: id, completedAt: new Date().toISOString(), currentStreak: 0 };
  },

  async uncompleteHabit(id: string, date?: string): Promise<void> {
    const params = date ? `?date=${date}` : '';
    await api.delete(`/habits/${id}/complete${params}`);
  },

  async getCompletions(from?: string, to?: string): Promise<{ completions: HabitCompletion[] }> {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const response = await api.get<{ completions: HabitCompletion[] }>(`/habits/completions?${params.toString()}`);
    return response?.data ?? { completions: [] };
  },
};
