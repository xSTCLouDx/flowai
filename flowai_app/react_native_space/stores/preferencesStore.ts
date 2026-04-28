import { create } from 'zustand';
import { UserPreferences } from '../types';
import { userService } from '../services/user';

interface PreferencesState {
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
  fetchPreferences: () => Promise<void>;
  updatePreferences: (data: Partial<UserPreferences>) => Promise<void>;
  clearError: () => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  preferences: null,
  isLoading: false,
  error: null,

  fetchPreferences: async () => {
    try {
      set({ isLoading: true, error: null });
      const preferences = await userService.getPreferences();
      set({ preferences, isLoading: false });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Erro ao carregar preferências', isLoading: false });
    }
  },

  updatePreferences: async (data: Partial<UserPreferences>) => {
    try {
      const preferences = await userService.updatePreferences(data);
      set({ preferences });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Erro ao atualizar preferências' });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
