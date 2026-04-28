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
var CalendarService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CalendarService = CalendarService_1 = class CalendarService {
    prisma;
    logger = new common_1.Logger(CalendarService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getEvents(userId, from, to) {
        const fromDate = from ? new Date(from) : new Date();
        const toDate = to
            ? new Date(to)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
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
    async createEvent(userId, createEventDto) {
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
    async deleteEvent(userId, eventId) {
        await this.prisma.calendarevent.deleteMany({
            where: {
                id: eventId,
                userid: userId,
                source: 'local',
            },
        });
        this.logger.log(`Calendar event deleted: ${eventId}`);
        return { success: true };
    }
};
exports.CalendarService = CalendarService;
exports.CalendarService = CalendarService = CalendarService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CalendarService);
//# sourceMappingURL=calendar.service.js.map