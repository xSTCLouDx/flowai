import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { CompleteHabitDto } from './dto/complete-habit.dto';
export declare class HabitsController {
    private habitsService;
    constructor(habitsService: HabitsService);
    create(user: any, createHabitDto: CreateHabitDto): Promise<{
        id: any;
        name: any;
        description: any;
        frequency: any;
        currentStreak: number;
        longestStreak: number;
        completedToday: boolean;
        createdAt: any;
    }>;
    findAll(user: any): Promise<{
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
    getCompletions(user: any, from?: string, to?: string): Promise<{
        completions: {
            habitId: string;
            date: string;
            completedAt: string;
        }[];
    }>;
    findOne(user: any, id: string): Promise<{
        id: any;
        name: any;
        description: any;
        frequency: any;
        currentStreak: number;
        longestStreak: number;
        completedToday: boolean;
        createdAt: any;
    }>;
    update(user: any, id: string, updateHabitDto: UpdateHabitDto): Promise<{
        id: any;
        name: any;
        description: any;
        frequency: any;
        currentStreak: number;
        longestStreak: number;
        completedToday: boolean;
        createdAt: any;
    }>;
    delete(user: any, id: string): Promise<{
        success: boolean;
    }>;
    complete(user: any, id: string, completeHabitDto: CompleteHabitDto): Promise<{
        habitId: string;
        completedAt: string;
        currentStreak: number;
    }>;
    uncomplete(user: any, id: string, date?: string): Promise<{
        success: boolean;
    }>;
}
