import { api } from './api';
import { User, UserPreferences } from '../types';

export const userService = {
  async updateProfile(data: { name?: string; avatarUrl?: string }): Promise<User> {
    const response = await api.patch<User>('/user/profile', data);
    return response?.data ?? ({} as User);
  },

  async getPreferences(): Promise<UserPreferences> {
    const response = await api.get<UserPreferences>('/user/preferences');
    return response?.data ?? ({} as UserPreferences);
  },

  async updatePreferences(data: Partial<UserPreferences>): Promise<UserPreferences> {
    const response = await api.patch<UserPreferences>('/user/preferences', data);
    return response?.data ?? ({} as UserPreferences);
  },

  async upgradeToPremium(): Promise<{ isPremium: boolean }> {
    const response = await api.post<{ isPremium: boolean }>('/user/upgrade');
    return response?.data ?? { isPremium: false };
  },
};
