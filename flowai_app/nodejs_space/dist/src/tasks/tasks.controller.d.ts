import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ParseNaturalLanguageDto } from './dto/parse-natural-language.dto';
export declare class TasksController {
    private tasksService;
    constructor(tasksService: TasksService);
    create(user: any, createTaskDto: CreateTaskDto): Promise<{
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
    findAll(user: any, status?: string, priority?: string, category?: string, search?: string, dueDateFrom?: string, dueDateTo?: string, page?: string, limit?: string): Promise<{
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
    findOne(user: any, id: string): Promise<{
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
    update(user: any, id: string, updateTaskDto: UpdateTaskDto): Promise<{
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
    delete(user: any, id: string): Promise<{
        success: boolean;
    }>;
    complete(user: any, id: string): Promise<{
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
    parseNaturalLanguage(user: any, parseDto: ParseNaturalLanguageDto): Promise<any>;
}
