import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's tasks
    const todayTasks = await this.prisma.task.findMany({
      where: {
        userid: userId,
        duedate: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const completedToday = todayTasks.filter(
      (t) => t.status === 'completed',
    ).length;
    const totalToday = todayTasks.length;

    // Get habits streak
    const habits = await this.prisma.habit.findMany({
      where: { userid: userId },
    });

    let totalStreak = 0;
    for (const habit of habits) {
      const completions = await this.prisma.habitcompletion.findMany({
        where: { habitid: habit.id },
        orderBy: { date: 'desc' },
      });

      const streak = this.calculateCurrentStreak(completions);
      totalStreak += streak;
    }

    const habitStreak = habits.length > 0 ? Math.round(totalStreak / habits.length) : 0;

    // Weekly completion rate
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekTasks = await this.prisma.task.findMany({
      where: {
        userid: userId,
        createdat: {
          gte: weekAgo,
        },
      },
    });

    const weekCompleted = weekTasks.filter((t) => t.status === 'completed').length;
    const weeklyCompletionRate =
      weekTasks.length > 0 ? weekCompleted / weekTasks.length : 0;

    // Priority tasks
    const priorityTasks = await this.prisma.task.findMany({
      where: {
        userid: userId,
        status: 'pending',
        priority: 'high',
      },
      orderBy: { duedate: 'asc' },
      take: 5,
    });

    // Upcoming events
    const upcomingEvents = await this.prisma.calendarevent.findMany({
      where: {
        userid: userId,
        startdate: {
          gte: new Date(),
        },
      },
      orderBy: { startdate: 'asc' },
      take: 5,
    });

    // Latest insight
    const latestInsight = await this.prisma.aiinsight.findFirst({
      where: {
        userid: userId,
        dismissed: false,
      },
      orderBy: { createdat: 'desc' },
    });

    this.logger.log(`Dashboard data retrieved for user ${userId}`);

    return {
      todayStats: {
        completedToday,
        totalToday,
        habitStreak,
        weeklyCompletionRate: Math.round(weeklyCompletionRate * 100) / 100,
      },
      priorityTasks: priorityTasks.map((task) => ({
        id: task.id,
        title: task.title,
        dueDate: task.duedate?.toISOString() || null,
        priority: task.priority,
        category: task.category,
      })),
      upcomingEvents: upcomingEvents.map((event) => ({
        id: event.id,
        title: event.title,
        startDate: event.startdate.toISOString(),
        endDate: event.enddate.toISOString(),
        allDay: event.allday,
        source: event.source,
      })),
      latestInsight: latestInsight
        ? {
            id: latestInsight.id,
            type: latestInsight.type,
            content: latestInsight.content,
            createdAt: latestInsight.createdat.toISOString(),
          }
        : null,
    };
  }

  private calculateCurrentStreak(completions: any[]): number {
    if (completions.length === 0) return 0;

    const dates = completions.map((c) => c.date).sort();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split('T')[0];

    const latestDate = dates[dates.length - 1];
    if (latestDate !== today && latestDate !== yesterday) {
      return 0;
    }

    let currentStreak = 1;
    let checkDate = new Date(latestDate);

    for (let i = dates.length - 2; i >= 0; i--) {
      const prevDate = new Date(dates[i]);
      const expectedDate = new Date(checkDate);
      expectedDate.setDate(expectedDate.getDate() - 1);

      if (
        prevDate.toISOString().split('T')[0] ===
        expectedDate.toISOString().split('T')[0]
      ) {
        currentStreak++;
        checkDate = prevDate;
      } else {
        break;
      }
    }

    return currentStreak;
  }
}
