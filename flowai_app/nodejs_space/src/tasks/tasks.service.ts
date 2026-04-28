import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ParseNaturalLanguageDto } from './dto/parse-natural-language.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTaskDto: CreateTaskDto) {
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
    } catch (error) {
      this.logger.error(`Failed to create task: ${error.message}`);
      throw error;
    }
  }

  async findAll(
    userId: string,
    filters: {
      status?: string;
      priority?: string;
      category?: string;
      search?: string;
      dueDateFrom?: string;
      dueDateTo?: string;
      page?: number;
      limit?: number;
    },
  ) {
    const { status, priority, category, search, dueDateFrom, dueDateTo, page = 1, limit = 50 } = filters;

    const where: any = { userid: userId };

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

  async findOne(userId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userid: userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.formatTask(task);
  }

  async update(userId: string, id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.prisma.task.findFirst({
      where: { id, userid: userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
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
        completedat:
          updateTaskDto.status === 'completed' ? new Date() : undefined,
      },
    });

    this.logger.log(`Task updated: ${id}`);
    return this.formatTask(updated);
  }

  async delete(userId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userid: userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.prisma.task.delete({ where: { id } });
    this.logger.log(`Task deleted: ${id}`);

    return { success: true };
  }

  async complete(userId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userid: userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
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

  async parseNaturalLanguage(userId: string, parseDto: ParseNaturalLanguageDto) {
    try {
      // Call AI service to parse natural language
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
    } catch (error) {
      this.logger.error(`Failed to parse natural language: ${error.message}`);
      // Return a fallback response
      return {
        title: parseDto.text.substring(0, 100),
        description: null,
        dueDate: null,
        priority: 'medium',
        category: null,
      };
    }
  }

  private formatTask(task: any) {
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
}
