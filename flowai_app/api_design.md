# FlowAI - API Specification

Base URL: `/api`

## Authentication

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/signup | {email: string (required), password: string (required), name: string (required)} | {token: string, user: {id: UUID, email: string, name: string}} | No |
| POST | /api/auth/login | {email: string (required), password: string (required)} | {token: string, user: {id: UUID, email: string, name: string}} | No |
| GET | /api/auth/me | — | {user: {id: UUID, email: string, name: string, avatarUrl: string | null, isPremium: boolean}} | Bearer |
| GET | /api/auth/google?redirect_uri=string | — | Redirect to Google | No |
| GET | /api/auth/google/callback | — | Redirect to client with JWT in query params | No |

## User Profile

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| PATCH | /api/user/profile | {name: string (optional), avatarUrl: string (optional)} | {id: UUID, name: string, email: string, avatarUrl: string | null, isPremium: boolean} | Bearer |
| GET | /api/user/preferences | — | {id: UUID, darkMode: boolean, language: string, notificationsEnabled: boolean, aiSuggestPriority: boolean, aiNaturalLanguage: boolean} | Bearer |
| PATCH | /api/user/preferences | {darkMode: boolean (optional), language: string (optional), notificationsEnabled: boolean (optional), aiSuggestPriority: boolean (optional), aiNaturalLanguage: boolean (optional)} | {id: UUID, darkMode: boolean, language: string, notificationsEnabled: boolean, aiSuggestPriority: boolean, aiNaturalLanguage: boolean} | Bearer |
| POST | /api/user/upgrade | — | {isPremium: boolean} | Bearer |

## File Upload (for avatar)

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /upload/presigned | {fileName: string (required), contentType: string (required), isPublic: boolean (required)} | {uploadUrl: string, cloud_storage_path: string} | Bearer |
| POST | /upload/complete | {cloud_storage_path: string (required)} | {id: UUID, cloud_storage_path: string} | Bearer |
| GET | /files/:id/url?mode=view | — | {url: string} | Bearer |

## Tasks

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/tasks | query: ?status=string&priority=string&category=string&search=string&dueDateFrom=ISO8601&dueDateTo=ISO8601&page=integer&limit=integer | {items: Task[], total: integer, page: integer, totalPages: integer} | Bearer |
| GET | /api/tasks/:id | — | Task | Bearer |
| POST | /api/tasks | {title: string (required), description: string (optional), dueDate: ISO8601 (optional), priority: string (optional, "high"/"medium"/"low"), category: string (optional), reminderMinutesBefore: integer (optional)} | Task | Bearer |
| PATCH | /api/tasks/:id | {title: string (optional), description: string (optional), dueDate: ISO8601 (optional), priority: string (optional), category: string (optional), status: string (optional, "pending"/"completed"), reminderMinutesBefore: integer | null (optional)} | Task | Bearer |
| DELETE | /api/tasks/:id | — | {success: boolean} | Bearer |
| POST | /api/tasks/:id/complete | — | Task | Bearer |
| POST | /api/tasks/parse-natural-language | {text: string (required)} | {title: string, description: string | null, dueDate: ISO8601 | null, priority: string | null, category: string | null} | Bearer |

**Task Type:**
```
{
  id: UUID,
  title: string,
  description: string | null,
  dueDate: ISO8601 | null,
  priority: "high" | "medium" | "low",
  category: string | null,
  status: "pending" | "completed",
  isRecurring: boolean,
  recurrencePattern: string | null,
  reminderMinutesBefore: integer | null,
  completedAt: ISO8601 | null,
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

## Habits

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/habits | — | {items: Habit[], maxFreeHabits: integer, isPremium: boolean} | Bearer |
| POST | /api/habits | {name: string (required), description: string (optional), frequency: string (required, "daily"/"weekly"/"custom")} | Habit | Bearer |
| PATCH | /api/habits/:id | {name: string (optional), description: string (optional), frequency: string (optional)} | Habit | Bearer |
| DELETE | /api/habits/:id | — | {success: boolean} | Bearer |
| POST | /api/habits/:id/complete | {date: ISO8601 (optional, defaults to today)} | {habitId: UUID, completedAt: ISO8601, currentStreak: integer} | Bearer |
| DELETE | /api/habits/:id/complete | query: ?date=ISO8601 | {success: boolean} | Bearer |
| GET | /api/habits/completions | query: ?from=ISO8601&to=ISO8601 | {completions: {habitId: UUID, date: string, completedAt: ISO8601}[]} | Bearer |

**Habit Type:**
```
{
  id: UUID,
  name: string,
  description: string | null,
  frequency: "daily" | "weekly" | "custom",
  currentStreak: integer,
  longestStreak: integer,
  completedToday: boolean,
  createdAt: ISO8601
}
```

## Calendar

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/calendar/events | query: ?from=ISO8601&to=ISO8601 | {events: CalendarEvent[], tasks: Task[]} | Bearer |

**CalendarEvent Type:**
```
{
  id: string,
  title: string,
  startDate: ISO8601,
  endDate: ISO8601,
  allDay: boolean,
  source: "task" | "local"
}
```

Note: Calendar events are derived from tasks with dueDate. Full Google/Apple Calendar sync is deferred to a future version. The calendar screen shows tasks as events plus any locally-created events.

| POST | /api/calendar/events | {title: string (required), startDate: ISO8601 (required), endDate: ISO8601 (required), allDay: boolean (optional)} | CalendarEvent | Bearer |
| DELETE | /api/calendar/events/:id | — | {success: boolean} | Bearer |

## AI Endpoints

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/ai/suggest-priority | {taskId: UUID (required)} | {suggestedPriority: string, reasoning: string} | Bearer |
| GET | /api/ai/insights | — | {insights: AiInsight[]} | Bearer |
| POST | /api/ai/generate-insights | — | {insights: AiInsight[]} | Bearer |

**AiInsight Type:**
```
{
  id: UUID,
  type: "productivity" | "suggestion" | "pattern",
  content: string,
  createdAt: ISO8601
}
```

Note: Natural language parsing is under `/api/tasks/parse-natural-language`. AI suggest-priority analyzes the task context and user patterns. Generate-insights creates new AI insights based on recent activity.

## Analytics

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/analytics/productivity | query: ?period=string ("week"/"month"/"3months") | {completedByDay: {date: string, count: integer}[], completionRate: number, totalCompleted: integer, totalCreated: integer, avgCompletionTimeHours: number | null, byCategory: {category: string, count: integer}[]} | Bearer |

## Dashboard

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/dashboard | — | {todayStats: {completedToday: integer, totalToday: integer, habitStreak: integer, weeklyCompletionRate: number}, priorityTasks: Task[], upcomingEvents: CalendarEvent[], latestInsight: AiInsight | null} | Bearer |

## Error Response Format

All errors return:
```
{
  statusCode: integer,
  message: string,
  error: string
}
```

Common codes: 400 (validation), 401 (unauthorized), 403 (premium required), 404 (not found), 429 (rate limited)