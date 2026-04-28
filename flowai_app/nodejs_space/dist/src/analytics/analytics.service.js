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
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    prisma;
    logger = new common_1.Logger(AnalyticsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProductivity(userId, period = 'week') {
        const now = new Date();
        let startDate;
        switch (period) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '3months':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }
        const tasks = await this.prisma.task.findMany({
            where: {
                userid: userId,
                createdat: {
                    gte: startDate,
                },
            },
        });
        const completedTasks = tasks.filter((t) => t.status === 'completed' && t.completedat);
        const completedByDay = {};
        completedTasks.forEach((task) => {
            if (task.completedat) {
                const date = task.completedat.toISOString().split('T')[0];
                completedByDay[date] = (completedByDay[date] || 0) + 1;
            }
        });
        let avgCompletionTimeHours = null;
        const tasksWithCompletionTime = completedTasks.filter((t) => t.completedat && t.createdat);
        if (tasksWithCompletionTime.length > 0) {
            const totalMs = tasksWithCompletionTime.reduce((sum, task) => {
                const completionTime = new Date(task.completedat).getTime() -
                    new Date(task.createdat).getTime();
                return sum + completionTime;
            }, 0);
            avgCompletionTimeHours =
                totalMs / tasksWithCompletionTime.length / (1000 * 60 * 60);
        }
        const byCategory = {};
        completedTasks.forEach((task) => {
            const category = task.category || 'Uncategorized';
            byCategory[category] = (byCategory[category] || 0) + 1;
        });
        const completionRate = tasks.length > 0 ? completedTasks.length / tasks.length : 0;
        this.logger.log(`Productivity data retrieved for user ${userId}, period: ${period}`);
        return {
            completedByDay: Object.entries(completedByDay)
                .map(([date, count]) => ({ date, count }))
                .sort((a, b) => a.date.localeCompare(b.date)),
            completionRate: Math.round(completionRate * 100) / 100,
            totalCompleted: completedTasks.length,
            totalCreated: tasks.length,
            avgCompletionTimeHours: avgCompletionTimeHours !== null
                ? Math.round(avgCompletionTimeHours * 100) / 100
                : null,
            byCategory: Object.entries(byCategory)
                .map(([category, count]) => ({ category, count }))
                .sort((a, b) => b.count - a.count),
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map