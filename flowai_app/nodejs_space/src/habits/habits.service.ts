import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { CompleteHabitDto } from './dto/complete-habit.dto';

@Injectable()
export class HabitsService {
  private readonly logger = new Logger(HabitsService.name);
  private readonly MAX_FREE_HABITS = 3;

  constructor(private prisma: PrismaService) {}

  async create(userId: string, createHabitDto: CreateHabitDto) {
    // Check if user is premium
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { ispremium: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.ispremium) {
      // Check habit count for free users
      const habitCount = await this.prisma.habit.count({
        where: { userid: userId },
      });

      if (habitCount >= this.MAX_FREE_HABITS) {
        throw new ForbiddenException(
          `Free users can only create ${this.MAX_FREE_HABITS} habits. Upgrade to premium for unlimited habits.`,
        );
      }
    }

    const habit = await this.prisma.habit.create({
      data: {
        userid: userId,
        name: createHabitDto.name,
        description: createHabitDto.description,
        frequency: createHabitDto.frequency,
      },
    });

    this.logger.log(`Habit created: ${habit.id} for user ${userId}`);
    return this.formatHabit(habit, false, 0, 0);
  }

  async findAll(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { ispremium: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const habits = await this.prisma.habit.findMany({
      where: { userid: userId },
      orderBy: { createdat: 'desc' },
    });

    const today = new Date().toISOString().split('T')[0];

    const habitsWithStreaks = await Promise.all(
      habits.map(async (habit) => {
        const completions = await this.prisma.habitcompletion.findMany({
          where: { habitid: habit.id },
          orderBy: { date: 'desc' },
        });

        const completedToday = completions.some((c) => c.date === today);
        const { currentStreak, longestStreak } =
          this.calculateStreaks(completions);

        return this.formatHabit(
          habit,
          completedToday,
          currentStreak,
          longestStreak,
        );
      }),
    );

    return {
      items: habitsWithStreaks,
      maxFreeHabits: this.MAX_FREE_HABITS,
      isPremium: user.ispremium,
    };
  }

  async findOne(userId: string, id: string) {
    const habit = await this.prisma.habit.findFirst({
      where: { id, userid: userId },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    const today = new Date().toISOString().split('T')[0];
    const completions = await this.prisma.habitcompletion.findMany({
      where: { habitid: habit.id },
      orderBy: { date: 'desc' },
    });

    const completedToday = completions.some((c) => c.date === today);
    const { currentStreak, longestStreak } = this.calculateStreaks(completions);

    return this.formatHabit(habit, completedToday, currentStreak, longestStreak);
  }

  async update(userId: string, id: string, updateHabitDto: UpdateHabitDto) {
    const habit = await this.prisma.habit.findFirst({
      where: { id, userid: userId },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    const updated = await this.prisma.habit.update({
      where: { id },
      data: {
        name: updateHabitDto.name,
        description: updateHabitDto.description,
        frequency: updateHabitDto.frequency,
      },
    });

    this.logger.log(`Habit updated: ${id}`);

    const today = new Date().toISOString().split('T')[0];
    const completions = await this.prisma.habitcompletion.findMany({
      where: { habitid: updated.id },
      orderBy: { date: 'desc' },
    });

    const completedToday = completions.some((c) => c.date === today);
    const { currentStreak, longestStreak } = this.calculateStreaks(completions);

    return this.formatHabit(updated, completedToday, currentStreak, longestStreak);
  }

  async delete(userId: string, id: string) {
    const habit = await this.prisma.habit.findFirst({
      where: { id, userid: userId },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    await this.prisma.habit.delete({ where: { id } });
    this.logger.log(`Habit deleted: ${id}`);

    return { success: true };
  }

  async complete(
    userId: string,
    id: string,
    completeHabitDto: CompleteHabitDto,
  ) {
    const habit = await this.prisma.habit.findFirst({
      where: { id, userid: userId },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    const date = completeHabitDto.date
      ? new Date(completeHabitDto.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    // Upsert completion to avoid duplicates
    const completion = await this.prisma.habitcompletion.upsert({
      where: {
        habitid_date: {
          habitid: id,
          date,
        },
      },
      create: {
        habitid: id,
        userid: userId,
        date,
      },
      update: {},
    });

    // Calculate current streak
    const completions = await this.prisma.habitcompletion.findMany({
      where: { habitid: id },
      orderBy: { date: 'desc' },
    });

    const { currentStreak } = this.calculateStreaks(completions);

    this.logger.log(`Habit completed: ${id} for date ${date}`);

    return {
      habitId: id,
      completedAt: completion.completedat.toISOString(),
      currentStreak,
    };
  }

  async uncomplete(userId: string, id: string, date?: string) {
    const habit = await this.prisma.habit.findFirst({
      where: { id, userid: userId },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    const completionDate = date
      ? new Date(date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    const completion = await this.prisma.habitcompletion.findUnique({
      where: {
        habitid_date: {
          habitid: id,
          date: completionDate,
        },
      },
    });

    if (completion) {
      await this.prisma.habitcompletion.delete({
        where: { id: completion.id },
      });
      this.logger.log(`Habit uncompleted: ${id} for date ${completionDate}`);
    }

    return { success: true };
  }

  async getCompletions(
    userId: string,
    from?: string,
    to?: string,
  ) {
    const where: any = { userid: userId };

    if (from || to) {
      where.date = {};
      if (from) {
        where.date.gte = new Date(from).toISOString().split('T')[0];
      }
      if (to) {
        where.date.lte = new Date(to).toISOString().split('T')[0];
      }
    }

    const completions = await this.prisma.habitcompletion.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return {
      completions: completions.map((c) => ({
        habitId: c.habitid,
        date: c.date,
        completedAt: c.completedat.toISOString(),
      })),
    };
  }

  private calculateStreaks(completions: any[]) {
    if (completions.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const dates = completions.map((c) => c.date).sort();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split('T')[0];

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate current streak
    const latestDate = dates[dates.length - 1];
    if (latestDate === today || latestDate === yesterday) {
      currentStreak = 1;
      let checkDate = new Date(latestDate);

      for (let i = dates.length - 2; i >= 0; i--) {
        const prevDate = new Date(dates[i]);
        const expectedDate = new Date(checkDate);
        expectedDate.setDate(expectedDate.getDate() - 1);

        if (prevDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
          currentStreak++;
          checkDate = prevDate;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    for (let i = 0; i < dates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const currentDate = new Date(dates[i]);
        const prevDate = new Date(dates[i - 1]);
        const dayDiff = Math.floor(
          (currentDate.getTime() - prevDate.getTime()) / 86400000,
        );

        if (dayDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  }

  private formatHabit(
    habit: any,
    completedToday: boolean,
    currentStreak: number,
    longestStreak: number,
  ) {
    return {
      id: habit.id,
      name: habit.name,
      description: habit.description,
      frequency: habit.frequency,
      currentStreak,
      longestStreak,
      completedToday,
      createdAt: habit.createdat.toISOString(),
    };
  }
}
