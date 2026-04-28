import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboard(user: any): Promise<{
        todayStats: {
            completedToday: number;
            totalToday: number;
            habitStreak: number;
            weeklyCompletionRate: number;
        };
        priorityTasks: {
            id: string;
            title: string;
            dueDate: string | null;
            priority: string;
            category: string | null;
        }[];
        upcomingEvents: {
            id: string;
            title: string;
            startDate: string;
            endDate: string;
            allDay: boolean;
            source: string;
        }[];
        latestInsight: {
            id: string;
            type: string;
            content: string;
            createdAt: string;
        } | null;
    }>;
}
