import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    getProductivity(user: any, period?: string): Promise<{
        completedByDay: {
            date: string;
            count: number;
        }[];
        completionRate: number;
        totalCompleted: number;
        totalCreated: number;
        avgCompletionTimeHours: number | null;
        byCategory: {
            category: string;
            count: number;
        }[];
    }>;
}
