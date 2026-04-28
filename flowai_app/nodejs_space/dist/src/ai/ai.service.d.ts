import { PrismaService } from '../prisma/prisma.service';
import { SuggestPriorityDto } from './dto/suggest-priority.dto';
export declare class AiService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    suggestPriority(userId: string, suggestPriorityDto: SuggestPriorityDto): Promise<{
        suggestedPriority: any;
        reasoning: any;
    }>;
    getInsights(userId: string): Promise<{
        insights: {
            id: string;
            type: string;
            content: string;
            createdAt: string;
        }[];
    }>;
    generateInsights(userId: string): Promise<{
        insights: {
            id: string;
            type: string;
            content: string;
            createdAt: string;
        }[];
    }>;
}
