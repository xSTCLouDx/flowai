import { api } from './api';
import { Task, TasksResponse } from '../types';

interface TaskFilters {
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  page?: number;
  limit?: number;
}

export const tasksService = {
  async getTasks(filters?: TaskFilters): Promise<TasksResponse> {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.priority) params.set('priority', filters.priority);
    if (filters?.category) params.set('category', filters.category);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.dueDateFrom) params.set('dueDateFrom', filters.dueDateFrom);
    if (filters?.dueDateTo) params.set('dueDateTo', filters.dueDateTo);
    if (filters?.page) params.set('page', filters.page.toString());
    if (filters?.limit) params.set('limit', filters.limit.toString());

    const response = await api.get<TasksResponse>(`/tasks?${params.toString()}`);
    return response?.data ?? { items: [], total: 0, page: 1, totalPages: 0 };
  },

  async getTask(id: string): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response?.data ?? ({} as Task);
  },

  async createTask(data: Partial<Task>): Promise<Task> {
    const response = await api.post<Task>('/tasks', data);
    return response?.data ?? ({} as Task);
  },

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${id}`, data);
    return response?.data ?? ({} as Task);
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async completeTask(id: string): Promise<Task> {
    const response = await api.post<Task>(`/tasks/${id}/complete`);
    return response?.data ?? ({} as Task);
  },

  async parseNaturalLanguage(text: string): Promise<Partial<Task>> {
    const response = await api.post<Partial<Task>>('/tasks/parse-natural-language', { text });
    return response?.data ?? {};
  },
};
