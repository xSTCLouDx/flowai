import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private prisma: PrismaService) {}

  async getProductivity(userId: string, period: string = 'week') {
    const now = new Date();
    let startDate: Date;

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

    const completedTasks = tasks.filter(
      (t) => t.status === 'completed' && t.completedat,
    );

    // Group completed tasks by day
    const completedByDay: Record<string, number> = {};
    completedTasks.forEach((task) => {
      if (task.completedat) {
        const date = task.completedat.toISOString().split('T')[0];
        completedByDay[date] = (completedByDay[date] || 0) + 1;
      }
    });

    // Calculate avg completion time
    let avgCompletionTimeHours: number | null = null;
    const tasksWithCompletionTime = completedTasks.filter(
      (t) => t.completedat && t.createdat,
    );

    if (tasksWithCompletionTime.length > 0) {
      const totalMs = tasksWithCompletionTime.reduce((sum, task) => {
        const completionTime =
          new Date(task.completedat!).getTime() -
          new Date(task.createdat).getTime();
        return sum + completionTime;
      }, 0);
      avgCompletionTimeHours =
        totalMs / tasksWithCompletionTime.length / (1000 * 60 * 60);
    }

    // Group by category
    const byCategory: Record<string, number> = {};
    completedTasks.forEach((task) => {
      const category = task.category || 'Uncategorized';
      byCategory[category] = (byCategory[category] || 0) + 1;
    });

    const completionRate =
      tasks.length > 0 ? completedTasks.length / tasks.length : 0;

    this.logger.log(`Productivity data retrieved for user ${userId}, period: ${period}`);

    return {
      completedByDay: Object.entries(completedByDay)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      completionRate: Math.round(completionRate * 100) / 100,
      totalCompleted: completedTasks.length,
      totalCreated: tasks.length,
      avgCompletionTimeHours:
        avgCompletionTimeHours !== null
          ? Math.round(avgCompletionTimeHours * 100) / 100
          : null,
      byCategory: Object.entries(byCategory)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count),
    };
  }
}
