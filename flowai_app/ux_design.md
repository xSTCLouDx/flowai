# FlowAI - UX Specification

<screens>

## 1. Welcome Screen
- **Purpose**: Entry point for unauthenticated users
- **Layout**: Full-screen gradient background (blue #3B82F6 → purple #8B5CF6), centered app logo/name "FlowAI", tagline "Sua produtividade potencializada por IA"
- **UI Elements**:
  - App logo (animated fade-in)
  - "Entrar com Email" button (white filled)
  - "Entrar com Google" button (outlined with Google icon)
  - "Criar Conta" text link below
- **Actions**: Navigate to Login, Signup, or trigger Google SSO

## 2. Login Screen
- **Purpose**: Email/password authentication
- **Layout**: Stack layout with back arrow top-left
- **UI Elements**:
  - Heading "Bem-vindo de volta"
  - Email input (floating label, keyboard type email)
  - Password input (floating label, secure entry, show/hide toggle)
  - "Entrar" gradient button [#3B82F6, #8B5CF6]
  - "Entrar com Google" outlined button with Google icon
  - "Não tem conta? Criar conta" link at bottom
- **Validation**: Email format, password min 6 chars, error shake animation
- **Actions**: Submit login, navigate to Signup, trigger Google SSO

## 3. Signup Screen
- **Purpose**: New user registration
- **Layout**: Same structure as Login
- **UI Elements**:
  - Heading "Criar Conta"
  - Name input (floating label)
  - Email input (floating label)
  - Password input (floating label, strength indicator)
  - "Criar Conta" gradient button
  - "Entrar com Google" outlined button
  - "Já tem conta? Entrar" link
- **Validation**: Name required, email format, password min 6 chars
- **Actions**: Submit signup → redirect to Home (authenticated)

## 4. Auth Callback Screen (app/auth/callback.tsx)
- **Purpose**: Handle Google SSO redirect
- **Layout**: Centered loading spinner with "Autenticando..." text
- **Actions**: Extract token from query params, store, redirect to Home

## 5. Home / Dashboard Screen (Tab: Home)
- **Purpose**: Daily overview with key metrics and AI insights
- **Layout**: Scrollable vertical layout with collapsing header
- **UI Elements**:
  - **Header**: Greeting "Olá, {name}" with user avatar, current date
  - **Quick Stats Row**: 3 glass cards in horizontal scroll:
    - Tarefas concluídas hoje (count/total)
    - Streak de hábitos (flame icon + days)
    - Taxa semanal (percentage with mini ring chart)
  - **AI Insight Card**: Glass card with sparkle icon, personalized insight text from AI, dismiss button
  - **Tarefas Prioritárias Section**: Header "Prioridades do Dia", list of up to 5 high-priority/near-deadline tasks as compact cards (checkbox, title, due time, priority dot). Tap → Task Detail. Checkbox → mark complete with haptic.
  - **Próximos Eventos Section**: Header "Próximos Eventos", up to 3 upcoming calendar events (time, title, colored left border by calendar)
  - **FAB** (Floating Action Button): Bottom-right, gradient circle with "+" icon → opens Add Task modal
- **Loading**: Skeleton shimmer for each section
- **Empty State**: Friendly illustration + "Nenhuma tarefa para hoje. Que tal criar uma?"

## 6. Tasks List Screen (Tab: Tarefas)
- **Purpose**: Full task management with filters and search
- **Layout**: Top search bar, filter chips, scrollable task list
- **UI Elements**:
  - **Search Bar**: Magnifying glass icon, placeholder "Buscar tarefas...", clear button
  - **Filter Chips Row**: Horizontal scroll: "Todas", "Pendentes", "Concluídas", "Alta", "Média", "Baixa" + category tags. Active chip uses gradient fill.
  - **Natural Language Input Bar**: Text input with sparkle icon, placeholder "Descreva sua tarefa..." (e.g., "reunião amanhã às 14h"). Submit sends to AI parse endpoint → shows parsed task preview for confirmation.
  - **Task List** (@shopify/flash-list): Each item is a card with:
    - Circular checkbox (left)
    - Title (strikethrough if completed)
    - Due date/time subtitle
    - Priority indicator (colored dot: red=alta, yellow=média, green=baixa)
    - Category tag chip
    - Swipe right → complete, swipe left → delete with confirmation
  - **FAB**: "+" button → opens Add/Edit Task screen
- **Staggered entry animation** on list items
- **Empty State**: "Nenhuma tarefa encontrada" with illustration

## 7. Add/Edit Task Screen (Modal)
- **Purpose**: Create or edit a task
- **Layout**: Modal bottom sheet (multi-snap: half, full) with form
- **UI Elements**:
  - **Title Input**: Large text, floating label "Título"
  - **Description Input**: Multiline, floating label "Descrição (opcional)"
  - **Due Date/Time Picker**: Tap to open date picker, then time picker
  - **Priority Selector**: 3 toggle buttons (Alta/Média/Baixa) with color coding
  - **Category Input**: Text input with autocomplete from existing categories, or chip selector
  - **AI Suggestions Section** (if available): "IA sugere prioridade: Alta" with accept/reject buttons
  - **Save Button**: Gradient filled "Salvar Tarefa"
  - **Delete Button** (edit mode only): Red text "Excluir Tarefa" with confirmation dialog
- **Actions**: Save → POST/PATCH task, Delete → DELETE task, Close modal

## 8. Task Detail Screen (Stack)
- **Purpose**: View full task details
- **Layout**: Full screen with back navigation
- **UI Elements**:
  - Title (large), description, due date/time, priority badge, category chip, status badge
  - "Marcar como Concluída" / "Reabrir" button
  - "Editar" button → opens Add/Edit Task modal
  - AI suggestion card if available (e.g., "Esta tarefa parece recorrente. Deseja configurar repetição?")
- **Actions**: Toggle status, edit, delete

## 9. Calendar Screen (Tab: Calendário)
- **Purpose**: Unified calendar view of tasks and events
- **Layout**: View mode toggle at top, calendar below
- **UI Elements**:
  - **View Toggle**: Segmented control: Mês / Semana / Dia
  - **Monthly View**: Calendar grid with dot indicators for tasks/events. Tap date → shows day's items below.
  - **Weekly View**: 7-column layout with time slots, events/tasks as colored blocks
  - **Daily View**: Timeline (hour slots) with task/event cards positioned by time
  - **Day Items List**: Below calendar in month view, scrollable list of tasks + events for selected day
  - **Color Coding**: Tasks in blue, calendar events in purple, completed tasks in green (muted)
  - **FAB**: "+" → Add Task modal
- **Loading**: Skeleton shimmer for calendar grid

## 10. Habits Screen (Tab: Hábitos - replaces Análise in bottom tabs)
- **Purpose**: Habit tracking with streaks and progress
- **Layout**: Scrollable list with heat map at top
- **UI Elements**:
  - **Header**: "Meus Hábitos" with count (e.g., "2/3 gratuitos")
  - **Heat Map Calendar**: GitHub-style contribution grid showing completion density for last 3 months. Colors: empty=#1A1A1A, low=#3B82F6 20%, med=#3B82F6 50%, high=#3B82F6 100%
  - **Habits List**: Each habit card:
    - Name, description subtitle
    - Frequency badge ("Diário", "Semanal")
    - Streak counter with flame icon
    - Today's completion toggle (circular checkbox with animation)
    - Tap → Habit Detail
  - **Add Habit Button**: If under limit, gradient button "+ Novo Hábito". If at free limit, shows lock icon + "Upgrade para Premium"
- **Empty State**: "Comece a rastrear seus hábitos!"

## 11. Add/Edit Habit Screen (Modal)
- **Purpose**: Create or edit a habit
- **Layout**: Bottom sheet modal
- **UI Elements**:
  - Name input (floating label)
  - Description input (optional)
  - Frequency selector: "Diário" / "Semanal" / "Personalizado" toggle
  - Save button (gradient)
  - Delete button (edit mode, red text)

## 12. Analytics Screen (Stack from Home or Settings)
- **Purpose**: Productivity analysis with charts
- **Layout**: Scrollable with chart sections
- **UI Elements**:
  - **Period Selector**: Segmented control: Semana / Mês / 3 Meses
  - **Tasks Completed Chart**: Bar chart (daily bars for week, weekly bars for month)
  - **Completion Rate**: Large percentage with trend arrow (up/down vs previous period)
  - **Category Breakdown**: Horizontal bar chart or pie chart by category
  - **AI Insights Section**: List of insight cards with sparkle icon, each with a text insight (e.g., "Você é mais produtivo às terças-feiras")
  - **Premium Banner** (free users): Glass card "Desbloqueie análises avançadas" → Paywall
- **Loading**: Skeleton shimmer for charts

## 13. Settings Screen (Tab: Config)
- **Purpose**: App configuration and account management
- **Layout**: Grouped list sections
- **UI Elements**:
  - **Profile Section**: Avatar + name + email, tap → Edit Profile
  - **Premium Section**: Current plan badge, "Upgrade" button if free → Paywall
  - **Preferences Group**:
    - Dark Mode toggle (default on)
    - Idioma selector (PT-BR / EN)
    - Notificações toggle
  - **AI Preferences Group**:
    - Sugestões de prioridade toggle
    - Entrada em linguagem natural toggle
  - **Integrations Group**:
    - Google Calendar: Connect/Disconnect button with status indicator
  - **Account Group**:
    - "Análise de Produtividade" → Analytics screen
    - "Sair" (logout) button in red
  - App version at bottom

## 14. Edit Profile Screen (Stack)
- **Purpose**: Edit user profile
- **Layout**: Form with avatar at top
- **UI Elements**:
  - Avatar with camera icon overlay (tap to change via file upload)
  - Name input (pre-filled)
  - Email input (pre-filled, read-only or editable)
  - "Salvar" gradient button

## 15. Paywall / Premium Screen (Modal)
- **Purpose**: Show premium features and upgrade option
- **Layout**: Full-screen modal with gradient header
- **UI Elements**:
  - "FlowAI Premium" heading with crown icon
  - Feature comparison list (free vs premium) with checkmarks
  - Price display
  - "Assinar Premium" gradient button
  - "Restaurar Compra" text link
  - Close (X) button top-right
- **Note**: Actual payment integration is out of scope. Button toggles isPremium flag via API for demo purposes.

</screens>

<navigation>

## Unauthenticated Flow (Stack)
1. Welcome Screen (index)
2. Login Screen
3. Signup Screen
4. Auth Callback Screen (Google SSO)

## Authenticated Flow (Bottom Tabs + Stacks)
**Bottom Tabs** (5 tabs):
1. **Home** (house icon) → Dashboard Screen
2. **Tarefas** (checklist icon) → Tasks List Screen
3. **Calendário** (calendar icon) → Calendar Screen
4. **Hábitos** (target icon) → Habits Screen
5. **Config** (gear icon) → Settings Screen

**Stack Screens** (pushed from tabs):
- Task Detail (from Tasks List or Home)
- Edit Profile (from Settings)
- Analytics (from Settings or Home)
- Paywall (modal, from Settings or Habits)

**Modals**:
- Add/Edit Task (bottom sheet, from FAB on Home/Tasks/Calendar)
- Add/Edit Habit (bottom sheet, from Habits)

**Auth Guard**: All tab screens and stacks require valid JWT. If token missing/expired, redirect to Welcome.

**Deep Linking**: app/auth/callback for Google SSO

</navigation>

<design_direction>

- **Theme**: Dark mode default. Background: #0A0A0A (main), #111111 (cards base), #1A1A1A (elevated surfaces)
- **Primary Color Pair**: Blue #3B82F6 + Purple #8B5CF6 (gradient pair for buttons, accents)
- **Semantic Colors**: Green #10B981 (success/completed), Red #EF4444 (delete/high priority), Yellow #F59E0B (medium priority/warnings), Blue #3B82F6 (low priority/info)
- **Color Application**:
  - Gradient buttons: linear-gradient(#3B82F6, #8B5CF6)
  - Glass cards: rgba(255,255,255,0.05) with blur backdrop
  - Tab bar: frosted glass with blur, active tab icon uses gradient
  - Text: #F9FAFB (primary), #9CA3AF (secondary), #6B7280 (tertiary)
  - Accent usage: priority dots, streak flames, AI sparkle icons, chart colors
- **Typography**: Use "Poppins" for headings (semibold/bold) and "Inter" for body text (regular/medium)
  - Display: 32px Poppins Bold
  - Heading: 22px Poppins SemiBold
  - Subheading: 18px Poppins Medium
  - Body: 16px Inter Regular
  - Caption: 13px Inter Regular
- **Backgrounds**: Main screen bg is solid #0A0A0A. Header areas use subtle gradient overlay (blue→purple at 5% opacity). Cards use glass effect.
- **Light Mode** (toggle): Off-white #F9FAFB bg, #FFFFFF cards, #111827 text. Same accent colors.

</design_direction>

<animation_and_motion>

- **Screen Transitions**: Fade + slide-right for stack push, slide-down for modal dismiss
- **Button Press**: scale(0.97) with spring config (damping: 15, stiffness: 150) + light haptic
- **Task Completion**: Checkbox fills with gradient animation, title gets strikethrough with 300ms ease, confetti particles on first completion of day
- **Habit Completion**: Circular fill animation + streak counter increment animation + medium haptic
- **List Items**: Staggered fade-in (50ms delay per item), swipe actions with spring bounce
- **FAB**: Scale-in on screen mount, press scale(0.9) with haptic
- **Charts**: Animated bar/line drawing on mount (1s ease-out)
- **Heat Map**: Cells fade in with stagger from top-left
- **Loading**: Skeleton shimmer (gradient sweep left-to-right, 1.5s loop)
- **Bottom Sheets**: Spring-based snap points with backdrop blur fade
- **Tab Switching**: Cross-fade content (200ms)
- **Respect reduced motion**: Check AccessibilityInfo, disable animations if enabled

</animation_and_motion>

<component_standards>

- **Buttons**: Gradient fill (primary), outlined (secondary), text (tertiary). All have press animation, loading spinner state, disabled opacity 0.5
- **Inputs**: Floating labels, border highlight on focus (#3B82F6), error state with red border + shake + error message below, 48px min height
- **Cards**: Rounded 16px, glass effect (rgba(255,255,255,0.05) + backdrop blur), subtle border rgba(255,255,255,0.1), press animation for interactive cards
- **Task Cards**: 12px radius, left border 3px colored by priority, checkbox left, content center, swipeable
- **Images/Avatars**: Circular with blurhash placeholder, 44px for list items, 80px for profile
- **Lists**: @shopify/flash-list for tasks and habits, pull-to-refresh, staggered entry
- **Empty States**: Centered illustration (simple SVG), heading, subtitle, optional CTA button
- **Error States**: Red-tinted card with retry button
- **Spacing**: 8pt grid (4, 8, 12, 16, 24, 32, 48). Consistent 16px horizontal padding.
- **Border Radius**: sm:8, md:12, lg:16, xl:24
- **Accessibility**: Contrast ≥ 4.5:1, touch targets 44pt minimum, all interactive elements have accessibilityLabel, screen reader announcements for state changes

</component_standards>