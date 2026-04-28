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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ParseNaturalLanguageDto } from './dto/parse-natural-language.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Tasks')
@Controller('api/tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  async create(
    @CurrentUser() user: any,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(user.userId, createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'dueDateFrom', required: false })
  @ApiQuery({ name: 'dueDateTo', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  async findAll(
    @CurrentUser() user: any,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('dueDateFrom') dueDateFrom?: string,
    @Query('dueDateTo') dueDateTo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.tasksService.findAll(user.userId, {
      status,
      priority,
      category,
      search,
      dueDateFrom,
      dueDateTo,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.tasksService.findOne(user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(user.userId, id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.tasksService.delete(user.userId, id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark task as completed' })
  @ApiResponse({ status: 200, description: 'Task marked as completed' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async complete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.tasksService.complete(user.userId, id);
  }

  @Post('parse-natural-language')
  @ApiOperation({ summary: 'Parse natural language to extract task details' })
  @ApiResponse({
    status: 200,
    description: 'Natural language parsed successfully',
  })
  async parseNaturalLanguage(
    @CurrentUser() user: any,
    @Body() parseDto: ParseNaturalLanguageDto,
  ) {
    return this.tasksService.parseNaturalLanguage(user.userId, parseDto);
  }
}
