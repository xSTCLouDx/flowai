"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AiService = AiService_1 = class AiService {
    prisma;
    logger = new common_1.Logger(AiService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async suggestPriority(userId, suggestPriorityDto) {
        const task = await this.prisma.task.findFirst({
            where: {
                id: suggestPriorityDto.taskId,
                userid: userId,
            },
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { ispremium: true },
            });
            const prompt = `Analyze this task and suggest a priority level (high, medium, or low).
      
      Task Title: ${task.title}
      Description: ${task.description || 'N/A'}
      Due Date: ${task.duedate ? task.duedate.toISOString() : 'N/A'}
      Current Priority: ${task.priority}
      
      Consider:
      - Urgency (how soon is the due date)
      - Keywords suggesting importance
      - Context and description
      
      Respond in JSON format with: {"suggestedPriority": "high|medium|low", "reasoning": "brief explanation"}`;
            const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
                },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: prompt }],
                    response_format: { type: 'json_object' },
                    stream: false,
                }),
            });
            const data = await response.json();
            const result = JSON.parse(data.choices[0].message.content);
            this.logger.log(`Priority suggested for task ${task.id}: ${result.suggestedPriority}`);
            return {
                suggestedPriority: result.suggestedPriority,
                reasoning: result.reasoning,
            };
        }
        catch (error) {
            this.logger.error(`Failed to suggest priority: ${error.message}`);
            return {
                suggestedPriority: 'medium',
                reasoning: 'AI analysis unavailable, defaulting to medium priority',
            };
        }
    }
    async getInsights(userId) {
        const insights = await this.prisma.aiinsight.findMany({
            where: {
                userid: userId,
                dismissed: false,
            },
            orderBy: { createdat: 'desc' },
            take: 10,
        });
        return {
            insights: insights.map((insight) => ({
                id: insight.id,
                type: insight.type,
                content: insight.content,
                createdAt: insight.createdat.toISOString(),
            })),
        };
    }
    async generateInsights(userId) {
        try {
            const tasks = await this.prisma.task.findMany({
                where: { userid: userId },
                orderBy: { createdat: 'desc' },
                take: 50,
            });
            const completedTasks = tasks.filter((t) => t.status === 'completed');
            const pendingTasks = tasks.filter((t) => t.status === 'pending');
            const overdueTasks = pendingTasks.filter((t) => t.duedate && new Date(t.duedate) < new Date());
            const insights = [];
            if (completedTasks.length > 0) {
                const recentCompleted = completedTasks.filter((t) => t.completedat &&
                    new Date(t.completedat) >
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
                insights.push(await this.prisma.aiinsight.create({
                    data: {
                        userid: userId,
                        type: 'productivity',
                        content: `You completed ${recentCompleted} tasks this week. Great progress!`,
                    },
                }));
            }
            if (overdueTasks.length > 0) {
                insights.push(await this.prisma.aiinsight.create({
                    data: {
                        userid: userId,
                        type: 'suggestion',
                        content: `You have ${overdueTasks.length} overdue tasks. Consider reviewing and rescheduling them.`,
                    },
                }));
            }
            const categoryCount = {};
            completedTasks.forEach((task) => {
                if (task.category) {
                    categoryCount[task.category] =
                        (categoryCount[task.category] || 0) + 1;
                }
            });
            const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
            if (topCategory && topCategory[1] > 5) {
                insights.push(await this.prisma.aiinsight.create({
                    data: {
                        userid: userId,
                        type: 'pattern',
                        content: `You're most productive in the "${topCategory[0]}" category with ${topCategory[1]} completed tasks.`,
                    },
                }));
            }
            this.logger.log(`Generated ${insights.length} insights for user ${userId}`);
            return {
                insights: insights.map((insight) => ({
                    id: insight.id,
                    type: insight.type,
                    content: insight.content,
                    createdAt: insight.createdat.toISOString(),
                })),
            };
        }
        catch (error) {
            this.logger.error(`Failed to generate insights: ${error.message}`);
            return { insights: [] };
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AiService);
//# sourceMappingURL=ai.service.js.map