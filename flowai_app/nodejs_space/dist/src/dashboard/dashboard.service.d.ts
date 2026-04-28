import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getDashboard(userId: string): Promise<{
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
    private calculateCurrentStreak;
}
