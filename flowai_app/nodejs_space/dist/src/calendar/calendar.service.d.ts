import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
export declare class CalendarService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getEvents(userId: string, from?: string, to?: string): Promise<{
        events: {
            id: string;
            title: string;
            startDate: string;
            endDate: string;
            allDay: boolean;
            source: string;
        }[];
        tasks: {
            id: string;
            title: string;
            dueDate: string | undefined;
            priority: string;
            category: string | null;
        }[];
    }>;
    createEvent(userId: string, createEventDto: CreateEventDto): Promise<{
        id: string;
        title: string;
        startDate: string;
        endDate: string;
        allDay: boolean;
        source: string;
    }>;
    deleteEvent(userId: string, eventId: string): Promise<{
        success: boolean;
    }>;
}
