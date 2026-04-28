import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Calendar')
@Controller('api/calendar')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Get('events')
  @ApiOperation({ summary: 'Get calendar events and tasks' })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  @ApiResponse({ status: 200, description: 'Events retrieved successfully' })
  async getEvents(
    @CurrentUser() user: any,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.calendarService.getEvents(user.userId, from, to);
  }

  @Post('events')
  @ApiOperation({ summary: 'Create a calendar event' })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  async createEvent(
    @CurrentUser() user: any,
    @Body() createEventDto: CreateEventDto,
  ) {
    return this.calendarService.createEvent(user.userId, createEventDto);
  }

  @Delete('events/:id')
  @ApiOperation({ summary: 'Delete a calendar event' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  async deleteEvent(@CurrentUser() user: any, @Param('id') eventId: string) {
    return this.calendarService.deleteEvent(user.userId, eventId);
  }
}
