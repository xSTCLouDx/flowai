import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ParseNaturalLanguageDto } from './dto/parse-natural-language.dto';
export declare class TasksService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(userId: string, createTaskDto: CreateTaskDto): Promise<{
        id: any;
        title: any;
        description: any;
        dueDate: any;
        priority: any;
        category: any;
        status: any;
        isRecurring: any;
        recurrencePattern: any;
        reminderMinutesBefore: any;
        completedAt: any;
        createdAt: any;
        updatedAt: any;
    }>;
    findAll(userId: string, filters: {
        status?: string;
        priority?: string;
        category?: string;
        search?: string;
        dueDateFrom?: string;
        dueDateTo?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        items: {
            id: any;
            title: any;
            description: any;
            dueDate: any;
            priority: any;
            category: any;
            status: any;
            isRecurring: any;
            recurrencePattern: any;
            reminderMinutesBefore: any;
            completedAt: any;
            createdAt: any;
            updatedAt: any;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(userId: string, id: string): Promise<{
        id: any;
        title: any;
        description: any;
        dueDate: any;
        priority: any;
        category: any;
        status: any;
        isRecurring: any;
        recurrencePattern: any;
        reminderMinutesBefore: any;
        completedAt: any;
        createdAt: any;
        updatedAt: any;
    }>;
    update(userId: string, id: string, updateTaskDto: UpdateTaskDto): Promise<{
        id: any;
        title: any;
        description: any;
        dueDate: any;
        priority: any;
        category: any;
        status: any;
        isRecurring: any;
        recurrencePattern: any;
        reminderMinutesBefore: any;
        completedAt: any;
        createdAt: any;
        updatedAt: any;
    }>;
    delete(userId: string, id: string): Promise<{
        success: boolean;
    }>;
    complete(userId: string, id: string): Promise<{
        id: any;
        title: any;
        description: any;
        dueDate: any;
        priority: any;
        category: any;
        status: any;
        isRecurring: any;
        recurrencePattern: any;
        reminderMinutesBefore: any;
        completedAt: any;
        createdAt: any;
        updatedAt: any;
    }>;
    parseNaturalLanguage(userId: string, parseDto: ParseNaturalLanguageDto): Promise<any>;
    private formatTask;
}
