import { api } from './api';
import { CalendarEvent, Task } from '../types';

interface CalendarResponse {
  events: CalendarEvent[];
  tasks: Task[];
}

export const calendarService = {
  async getEvents(from?: string, to?: string): Promise<CalendarResponse> {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const response = await api.get<CalendarResponse>(`/calendar/events?${params.toString()}`);
    return response?.data ?? { events: [], tasks: [] };
  },

  async createEvent(data: { title: string; startDate: string; endDate: string; allDay?: boolean }): Promise<CalendarEvent> {
    const response = await api.post<CalendarEvent>('/calendar/events', data);
    return response?.data ?? ({} as CalendarEvent);
  },

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/calendar/events/${id}`);
  },
};
