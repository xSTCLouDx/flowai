import { create } from 'zustand';
import { Task } from '../types';
import { tasksService } from '../services/tasks';

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (filters?: any) => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<Task>;
  updateTask: (id: string, data: Partial<Task>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (filters?: any) => {
    try {
      set({ isLoading: true, error: null });
      const response = await tasksService.getTasks(filters);
      set({ tasks: response?.items ?? [], isLoading: false });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Erro ao carregar tarefas', isLoading: false });
    }
  },

  createTask: async (data: Partial<Task>) => {
    try {
      const task = await tasksService.createTask(data);
      set((state) => ({ tasks: [task, ...(state?.tasks ?? [])] }));
      return task;
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Erro ao criar tarefa' });
      throw error;
    }
  },

  updateTask: async (id: string, data: Partial<Task>) => {
    try {
      const task = await tasksService.updateTask(id, data);
      set((state) => ({
        tasks: (state?.tasks ?? []).map((t) => (t?.id === id ? task : t)),
      }));
      return task;
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Erro ao atualizar tarefa' });
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    try {
      await tasksService.deleteTask(id);
      set((state) => ({
        tasks: (state?.tasks ?? []).filter((t) => t?.id !== id),
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Erro ao deletar tarefa' });
      throw error;
    }
  },

  completeTask: async (id: string) => {
    try {
      const task = await tasksService.completeTask(id);
      set((state) => ({
        tasks: (state?.tasks ?? []).map((t) => (t?.id === id ? task : t)),
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Erro ao completar tarefa' });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
