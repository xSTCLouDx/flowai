import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getProductivity(userId: string, period?: string): Promise<{
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
