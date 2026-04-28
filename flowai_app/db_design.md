# FlowAI - Database Schema

## Entity: User
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| email | String | Unique, required |
| password | String | bcrypt hashed, nullable (null for Google SSO-only users) |
| name | String | Required |
| avatarUrl | String | Nullable |
| isPremium | Boolean | Default false |
| googleId | String | Nullable, unique |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

## Entity: UserPreference
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK → User.id, unique, onDelete CASCADE |
| darkMode | Boolean | Default true |
| language | String | Default "pt-BR" |
| notificationsEnabled | Boolean | Default true |
| aiSuggestPriority | Boolean | Default true |
| aiNaturalLanguage | Boolean | Default true |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

**Indexes**: userId (unique)

## Entity: Task
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK → User.id, onDelete CASCADE |
| title | String | Required |
| description | String | Nullable |
| dueDate | DateTime | Nullable |
| priority | String | Default "medium", enum: "high"/"medium"/"low" |
| category | String | Nullable |
| status | String | Default "pending", enum: "pending"/"completed" |
| isRecurring | Boolean | Default false |
| recurrencePattern | String | Nullable |
| reminderMinutesBefore | Integer | Nullable |
| completedAt | DateTime | Nullable |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

**Indexes**: userId, (userId, status), (userId, dueDate), (userId, priority), (userId, category)

## Entity: Habit
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK → User.id, onDelete CASCADE |
| name | String | Required |
| description | String | Nullable |
| frequency | String | Required, enum: "daily"/"weekly"/"custom" |
| currentStreak | Integer | Default 0 |
| longestStreak | Integer | Default 0 |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

**Indexes**: userId

## Entity: HabitCompletion
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| habitId | UUID | FK → Habit.id, onDelete CASCADE |
| date | String | Required (YYYY-MM-DD format for easy querying) |
| completedAt | DateTime | Auto |

**Indexes**: habitId, (habitId, date) unique

## Entity: CalendarEvent
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK → User.id, onDelete CASCADE |
| title | String | Required |
| startDate | DateTime | Required |
| endDate | DateTime | Required |
| allDay | Boolean | Default false |
| source | String | Default "local", enum: "task"/"local" |
| taskId | UUID | Nullable, FK → Task.id, onDelete SET NULL |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

**Indexes**: userId, (userId, startDate, endDate)

## Entity: AiInsight
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK → User.id, onDelete CASCADE |
| type | String | Required, enum: "productivity"/"suggestion"/"pattern" |
| content | String | Required (text content of the insight) |
| dismissed | Boolean | Default false |
| createdAt | DateTime | Auto |

**Indexes**: userId, (userId, createdAt DESC)

## Entity: File
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK → User.id, onDelete CASCADE |
| fileName | String | Required |
| cloud_storage_path | String | Required |
| isPublic | Boolean | Default false |
| contentType | String | Required |
| createdAt | DateTime | Auto |

**Indexes**: userId

## Relationships
- User 1:1 UserPreference (auto-created on signup)
- User 1:N Task
- User 1:N Habit
- Habit 1:N HabitCompletion
- User 1:N CalendarEvent
- User 1:N AiInsight
- User 1:N File
- Task 1:N CalendarEvent (optional link via taskId)