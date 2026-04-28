import {
  Controller,
  Get,
  Post,
  Patch,
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
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { CompleteHabitDto } from './dto/complete-habit.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Habits')
@Controller('api/habits')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class HabitsController {
  constructor(private habitsService: HabitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new habit' })
  @ApiResponse({ status: 201, description: 'Habit created successfully' })
  @ApiResponse({
    status: 403,
    description: 'Free users can only create 3 habits',
  })
  async create(
    @CurrentUser() user: any,
    @Body() createHabitDto: CreateHabitDto,
  ) {
    return this.habitsService.create(user.userId, createHabitDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all habits' })
  @ApiResponse({ status: 200, description: 'Habits retrieved successfully' })
  async findAll(@CurrentUser() user: any) {
    return this.habitsService.findAll(user.userId);
  }

  @Get('completions')
  @ApiOperation({ summary: 'Get habit completions' })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  @ApiResponse({ status: 200, description: 'Completions retrieved successfully' })
  async getCompletions(
    @CurrentUser() user: any,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.habitsService.getCompletions(user.userId, from, to);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get habit by ID' })
  @ApiResponse({ status: 200, description: 'Habit retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.habitsService.findOne(user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update habit' })
  @ApiResponse({ status: 200, description: 'Habit updated successfully' })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateHabitDto: UpdateHabitDto,
  ) {
    return this.habitsService.update(user.userId, id, updateHabitDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete habit' })
  @ApiResponse({ status: 200, description: 'Habit deleted successfully' })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.habitsService.delete(user.userId, id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark habit as completed' })
  @ApiResponse({ status: 200, description: 'Habit marked as completed' })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  async complete(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() completeHabitDto: CompleteHabitDto,
  ) {
    return this.habitsService.complete(user.userId, id, completeHabitDto);
  }

  @Delete(':id/complete')
  @ApiOperation({ summary: 'Uncomplete habit' })
  @ApiQuery({ name: 'date', required: false })
  @ApiResponse({ status: 200, description: 'Habit uncompleted' })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  async uncomplete(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Query('date') date?: string,
  ) {
    return this.habitsService.uncomplete(user.userId, id, date);
  }
}
