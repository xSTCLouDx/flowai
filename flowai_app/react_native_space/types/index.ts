// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  isPremium: boolean;
}

export interface UserPreferences {
  id: string;
  darkMode: boolean;
  language: string;
  notificationsEnabled: boolean;
  aiSuggestPriority: boolean;
  aiNaturalLanguage: boolean;
}

// Task Types
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority: TaskPriority;
  category?: string | null;
  status: TaskStatus;
  isRecurring: boolean;
  recurrencePattern?: string | null;
  reminderMinutesBefore?: number | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TasksResponse {
  items: Task[];
  total: number;
  page: number;
  totalPages: number;
}

// Habit Types
export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export interface Habit {
  id: string;
  name: string;
  description?: string | null;
  frequency: HabitFrequency;
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  createdAt: string;
}

export interface HabitCompletion {
  habitId: string;
  date: string;
  completedAt: string;
}

// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  source: 'task' | 'local';
}

// AI Types
export type AiInsightType = 'productivity' | 'suggestion' | 'pattern';

export interface AiInsight {
  id: string;
  type: AiInsightType;
  content: string;
  createdAt: string;
}

// Analytics Types
export interface ProductivityAnalytics {
  completedByDay: Array<{ date: string; count: number }>;
  completionRate: number;
  totalCompleted: number;
  totalCreated: number;
  avgCompletionTimeHours?: number | null;
  byCategory: Array<{ category: string; count: number }>;
}

// Dashboard Types
export interface DashboardData {
  todayStats: {
    completedToday: number;
    totalToday: number;
    habitStreak: number;
    weeklyCompletionRate: number;
  };
  priorityTasks: Task[];
  upcomingEvents: CalendarEvent[];
  latestInsight: AiInsight | null;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Error Types
export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}
