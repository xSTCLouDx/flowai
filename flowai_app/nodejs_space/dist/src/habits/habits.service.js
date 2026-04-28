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
var HabitsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HabitsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HabitsService = HabitsService_1 = class HabitsService {
    prisma;
    logger = new common_1.Logger(HabitsService_1.name);
    MAX_FREE_HABITS = 3;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createHabitDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { ispremium: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (!user.ispremium) {
            const habitCount = await this.prisma.habit.count({
                where: { userid: userId },
            });
            if (habitCount >= this.MAX_FREE_HABITS) {
                throw new common_1.ForbiddenException(`Free users can only create ${this.MAX_FREE_HABITS} habits. Upgrade to premium for unlimited habits.`);
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
    async findAll(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { ispremium: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const habits = await this.prisma.habit.findMany({
            where: { userid: userId },
            orderBy: { createdat: 'desc' },
        });
        const today = new Date().toISOString().split('T')[0];
        const habitsWithStreaks = await Promise.all(habits.map(async (habit) => {
            const completions = await this.prisma.habitcompletion.findMany({
                where: { habitid: habit.id },
                orderBy: { date: 'desc' },
            });
            const completedToday = completions.some((c) => c.date === today);
            const { currentStreak, longestStreak } = this.calculateStreaks(completions);
            return this.formatHabit(habit, completedToday, currentStreak, longestStreak);
        }));
        return {
            items: habitsWithStreaks,
            maxFreeHabits: this.MAX_FREE_HABITS,
            isPremium: user.ispremium,
        };
    }
    async findOne(userId, id) {
        const habit = await this.prisma.habit.findFirst({
            where: { id, userid: userId },
        });
        if (!habit) {
            throw new common_1.NotFoundException('Habit not found');
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
    async update(userId, id, updateHabitDto) {
        const habit = await this.prisma.habit.findFirst({
            where: { id, userid: userId },
        });
        if (!habit) {
            throw new common_1.NotFoundException('Habit not found');
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
    async delete(userId, id) {
        const habit = await this.prisma.habit.findFirst({
            where: { id, userid: userId },
        });
        if (!habit) {
            throw new common_1.NotFoundException('Habit not found');
        }
        await this.prisma.habit.delete({ where: { id } });
        this.logger.log(`Habit deleted: ${id}`);
        return { success: true };
    }
    async complete(userId, id, completeHabitDto) {
        const habit = await this.prisma.habit.findFirst({
            where: { id, userid: userId },
        });
        if (!habit) {
            throw new common_1.NotFoundException('Habit not found');
        }
        const date = completeHabitDto.date
            ? new Date(completeHabitDto.date).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0];
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
    async uncomplete(userId, id, date) {
        const habit = await this.prisma.habit.findFirst({
            where: { id, userid: userId },
        });
        if (!habit) {
            throw new common_1.NotFoundException('Habit not found');
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
    async getCompletions(userId, from, to) {
        const where = { userid: userId };
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
    calculateStreaks(completions) {
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
                }
                else {
                    break;
                }
            }
        }
        for (let i = 0; i < dates.length; i++) {
            if (i === 0) {
                tempStreak = 1;
            }
            else {
                const currentDate = new Date(dates[i]);
                const prevDate = new Date(dates[i - 1]);
                const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / 86400000);
                if (dayDiff === 1) {
                    tempStreak++;
                }
                else {
                    longestStreak = Math.max(longestStreak, tempStreak);
                    tempStreak = 1;
                }
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
        return { currentStreak, longestStreak };
    }
    formatHabit(habit, completedToday, currentStreak, longestStreak) {
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
};
exports.HabitsService = HabitsService;
exports.HabitsService = HabitsService = HabitsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HabitsService);
//# sourceMappingURL=habits.service.js.map