import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);

  constructor(private prisma: PrismaService) {}

  async getEvents(
    userId: string,
    from?: string,
    to?: string,
  ) {
    const fromDate = from ? new Date(from) : new Date();
    const toDate = to
      ? new Date(to)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days ahead

    // Get calendar events
    const events = await this.prisma.calendarevent.findMany({
      where: {
        userid: userId,
        startdate: {
          gte: fromDate,
          lte: toDate,
        },
      },
      orderBy: { startdate: 'asc' },
    });

    // Get tasks with due dates as events
    const tasks = await this.prisma.task.findMany({
      where: {
        userid: userId,
        duedate: {
          gte: fromDate,
          lte: toDate,
        },
        status: 'pending',
      },
      orderBy: { duedate: 'asc' },
    });

    return {
      events: events.map((event) => ({
        id: event.id,
        title: event.title,
        startDate: event.startdate.toISOString(),
        endDate: event.enddate.toISOString(),
        allDay: event.allday,
        source: event.source,
      })),
      tasks: tasks.map((task) => ({
        id: task.id,
        title: task.title,
        dueDate: task.duedate?.toISOString(),
        priority: task.priority,
        category: task.category,
      })),
    };
  }

  async createEvent(userId: string, createEventDto: CreateEventDto) {
    const event = await this.prisma.calendarevent.create({
      data: {
        userid: userId,
        title: createEventDto.title,
        startdate: new Date(createEventDto.startDate),
        enddate: new Date(createEventDto.endDate),
        allday: createEventDto.allDay || false,
        source: 'local',
      },
    });

    this.logger.log(`Calendar event created: ${event.id} for user ${userId}`);

    return {
      id: event.id,
      title: event.title,
      startDate: event.startdate.toISOString(),
      endDate: event.enddate.toISOString(),
      allDay: event.allday,
      source: event.source,
    };
  }

  async deleteEvent(userId: string, eventId: string) {
    await this.prisma.calendarevent.deleteMany({
      where: {
        id: eventId,
        userid: userId,
        source: 'local', // Only allow deleting local events
      },
    });

    this.logger.log(`Calendar event deleted: ${eventId}`);
    return { success: true };
  }
}
