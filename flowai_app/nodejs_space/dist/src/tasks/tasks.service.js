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
var TasksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TasksService = TasksService_1 = class TasksService {
    prisma;
    logger = new common_1.Logger(TasksService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createTaskDto) {
        try {
            const task = await this.prisma.task.create({
                data: {
                    userid: userId,
                    title: createTaskDto.title,
                    description: createTaskDto.description,
                    duedate: createTaskDto.dueDate
                        ? new Date(createTaskDto.dueDate)
                        : undefined,
                    priority: createTaskDto.priority || 'medium',
                    category: createTaskDto.category,
                    reminderminutesbefore: createTaskDto.reminderMinutesBefore,
                },
            });
            this.logger.log(`Task created: ${task.id} for user ${userId}`);
            return this.formatTask(task);
        }
        catch (error) {
            this.logger.error(`Failed to create task: ${error.message}`);
            throw error;
        }
    }
    async findAll(userId, filters) {
        const { status, priority, category, search, dueDateFrom, dueDateTo, page = 1, limit = 50 } = filters;
        const where = { userid: userId };
        if (status) {
            where.status = status;
        }
        if (priority) {
            where.priority = priority;
        }
        if (category) {
            where.category = category;
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (dueDateFrom || dueDateTo) {
            where.duedate = {};
            if (dueDateFrom) {
                where.duedate.gte = new Date(dueDateFrom);
            }
            if (dueDateTo) {
                where.duedate.lte = new Date(dueDateTo);
            }
        }
        const [tasks, total] = await Promise.all([
            this.prisma.task.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: [
                    { status: 'asc' },
                    { duedate: 'asc' },
                    { priority: 'desc' },
                ],
            }),
            this.prisma.task.count({ where }),
        ]);
        return {
            items: tasks.map((task) => this.formatTask(task)),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(userId, id) {
        const task = await this.prisma.task.findFirst({
            where: { id, userid: userId },
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        return this.formatTask(task);
    }
    async update(userId, id, updateTaskDto) {
        const task = await this.prisma.task.findFirst({
            where: { id, userid: userId },
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        const updated = await this.prisma.task.update({
            where: { id },
            data: {
                title: updateTaskDto.title,
                description: updateTaskDto.description,
                duedate: updateTaskDto.dueDate
                    ? new Date(updateTaskDto.dueDate)
                    : undefined,
                priority: updateTaskDto.priority,
                category: updateTaskDto.category,
                status: updateTaskDto.status,
                reminderminutesbefore: updateTaskDto.reminderMinutesBefore,
                completedat: updateTaskDto.status === 'completed' ? new Date() : undefined,
            },
        });
        this.logger.log(`Task updated: ${id}`);
        return this.formatTask(updated);
    }
    async delete(userId, id) {
        const task = await this.prisma.task.findFirst({
            where: { id, userid: userId },
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        await this.prisma.task.delete({ where: { id } });
        this.logger.log(`Task deleted: ${id}`);
        return { success: true };
    }
    async complete(userId, id) {
        const task = await this.prisma.task.findFirst({
            where: { id, userid: userId },
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        const updated = await this.prisma.task.update({
            where: { id },
            data: {
                status: 'completed',
                completedat: new Date(),
            },
        });
        this.logger.log(`Task completed: ${id}`);
        return this.formatTask(updated);
    }
    async parseNaturalLanguage(userId, parseDto) {
        try {
            const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'user',
                            content: `Parse this task description and extract: title, description, dueDate (ISO8601 format), priority (high/medium/low), category. Return only JSON format with these exact fields: {"title": string, "description": string | null, "dueDate": string | null, "priority": string | null, "category": string | null}. Task: "${parseDto.text}"`,
                        },
                    ],
                    response_format: { type: 'json_object' },
                    stream: false,
                }),
            });
            const data = await response.json();
            const parsedData = JSON.parse(data.choices[0].message.content);
            this.logger.log(`Natural language parsed for user ${userId}`);
            return parsedData;
        }
        catch (error) {
            this.logger.error(`Failed to parse natural language: ${error.message}`);
            return {
                title: parseDto.text.substring(0, 100),
                description: null,
                dueDate: null,
                priority: 'medium',
                category: null,
            };
        }
    }
    formatTask(task) {
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            dueDate: task.duedate?.toISOString() || null,
            priority: task.priority,
            category: task.category,
            status: task.status,
            isRecurring: task.isrecurring,
            recurrencePattern: task.recurrencepattern,
            reminderMinutesBefore: task.reminderminutesbefore,
            completedAt: task.completedat?.toISOString() || null,
            createdAt: task.createdat.toISOString(),
            updatedAt: task.updatedat.toISOString(),
        };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = TasksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map