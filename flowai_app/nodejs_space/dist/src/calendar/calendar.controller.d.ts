import { CalendarService } from './calendar.service';
import { CreateEventDto } from './dto/create-event.dto';
export declare class CalendarController {
    private calendarService;
    constructor(calendarService: CalendarService);
    getEvents(user: any, from?: string, to?: string): Promise<{
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
    createEvent(user: any, createEventDto: CreateEventDto): Promise<{
        id: string;
        title: string;
        startDate: string;
        endDate: string;
        allDay: boolean;
        source: string;
    }>;
    deleteEvent(user: any, eventId: string): Promise<{
        success: boolean;
    }>;
}
