import { PrismaService } from '../prisma/prisma.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { CompleteHabitDto } from './dto/complete-habit.dto';
export declare class HabitsService {
    private prisma;
    private readonly logger;
    private readonly MAX_FREE_HABITS;
    constructor(prisma: PrismaService);
    create(userId: string, createHabitDto: CreateHabitDto): Promise<{
        id: any;
        name: any;
        description: any;
        frequency: any;
        currentStreak: number;
        longestStreak: number;
        completedToday: boolean;
        createdAt: any;
    }>;
    findAll(userId: string): Promise<{
        items: {
            id: any;
            name: any;
            description: any;
            frequency: any;
            currentStreak: number;
            longestStreak: number;
            completedToday: boolean;
            createdAt: any;
        }[];
        maxFreeHabits: number;
        isPremium: boolean;
    }>;
    findOne(userId: string, id: string): Promise<{
        id: any;
        name: any;
        description: any;
        frequency: any;
        currentStreak: number;
        longestStreak: number;
        completedToday: boolean;
        createdAt: any;
    }>;
    update(userId: string, id: string, updateHabitDto: UpdateHabitDto): Promise<{
        id: any;
        name: any;
        description: any;
        frequency: any;
        currentStreak: number;
        longestStreak: number;
        completedToday: boolean;
        createdAt: any;
    }>;
    delete(userId: string, id: string): Promise<{
        success: boolean;
    }>;
    complete(userId: string, id: string, completeHabitDto: CompleteHabitDto): Promise<{
        habitId: string;
        completedAt: string;
        currentStreak: number;
    }>;
    uncomplete(userId: string, id: string, date?: string): Promise<{
        success: boolean;
    }>;
    getCompletions(userId: string, from?: string, to?: string): Promise<{
        completions: {
            habitId: string;
            date: string;
            completedAt: string;
        }[];
    }>;
    private calculateStreaks;
    private formatHabit;
}
