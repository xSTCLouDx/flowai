import { AiService } from './ai.service';
import { SuggestPriorityDto } from './dto/suggest-priority.dto';
export declare class AiController {
    private aiService;
    constructor(aiService: AiService);
    suggestPriority(user: any, suggestPriorityDto: SuggestPriorityDto): Promise<{
        suggestedPriority: any;
        reasoning: any;
    }>;
    getInsights(user: any): Promise<{
        insights: {
            id: string;
            type: string;
            content: string;
            createdAt: string;
        }[];
    }>;
    generateInsights(user: any): Promise<{
        insights: {
            id: string;
            type: string;
            content: string;
            createdAt: string;
        }[];
    }>;
}
