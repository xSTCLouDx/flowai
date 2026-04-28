import { create } from 'zustand';
import { Habit, HabitCompletion } from '../types';
import { habitsService } from '../services/habits';

interface HabitsState {
  habits: Habit[];
  completions: HabitCompletion[];
  maxFreeHabits: number;
  isPremium: boolean;
  isLoading: boolean;
  error: string | null;
  fetchHabits: () => Promise<void>;
  fetchCompletions: (from?: string, to?: string) => Promise<void>;
  createHabit: (data: { name: string; description?: string; frequency: string }) => Promise<Habit>;
  updateHabit: (id: string, data: Partial<Habit>) => Promise<Habit>;
  deleteHabit: (id: string) => Promise<void>;
  completeHabit: (id: string, date?: string) => Promise<void>;
  uncompleteHabit: (id: string, date?: string) => Promise<void>;
  clearError: () => void;
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  completions: [],
  maxFreeHabits: 3,
  isPremium: false,
  isLoading: false,
  error: null,

  fetchHabits: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await habitsService.getHabits();
      set({
        habits: response?.items ?? [],
        maxFreeHabits: response?.maxFreeHabits ?? 3,
        isPremium: response?.isPremium ?? false,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Erro ao carregar hábitos', isLoading: false });
    }
  },

  fetchCompletions: async (from?: string, to?: string) => {
    try {
      const response = await habitsService.getCompletions(from, to);
      set({ completions: response?.completions ?? [] });
    } catch (error: any) {
      console.error('Error fetching completions:', error);
    }
  },

  createHabit: async (data) => {
    try {
      const habit = await habitsService.createHabit(data);
      set((state) => ({ habits: [...(state?.habits ?? []), habit] }));
      return habit;
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Erro ao criar hábito' });
      throw error;
    }
  },

  updateHabit: async (id: string, data: Partial<Habit>) => {
    try {
      const habit = await habitsService.updateHabit(id, data);
      set((state) => ({
        habits: (state?.habits ?? []).map((h) => (h?.id === id ? habit : h)),
      }));
      return habit;
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Erro ao atualizar hábito' });
      throw error;
    }
  },

  deleteHabit: async (id: string) => {
    try {
      await habitsService.deleteHabit(id);
      set((state) => ({
        habits: (state?.habits ?? []).filter((h) => h?.id !== id),
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Erro ao deletar hábito' });
      throw error;
    }
  },

  completeHabit: async (id: string, date?: string) => {
    try {
      const response = await habitsService.completeHabit(id, date);
      // Refresh habits to get updated streak
      await get().fetchHabits();
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Erro ao completar hábito' });
      throw error;
    }
  },

  uncompleteHabit: async (id: string, date?: string) => {
    try {
      await habitsService.uncompleteHabit(id, date);
      await get().fetchHabits();
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Erro ao desmarcar hábito' });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
