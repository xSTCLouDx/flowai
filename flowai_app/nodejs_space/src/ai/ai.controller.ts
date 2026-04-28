import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AiService } from './ai.service';
import { SuggestPriorityDto } from './dto/suggest-priority.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('AI')
@Controller('api/ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('suggest-priority')
  @ApiOperation({ summary: 'Suggest priority for a task using AI' })
  @ApiResponse({ status: 200, description: 'Priority suggestion generated' })
  async suggestPriority(
    @CurrentUser() user: any,
    @Body() suggestPriorityDto: SuggestPriorityDto,
  ) {
    return this.aiService.suggestPriority(user.userId, suggestPriorityDto);
  }

  @Get('insights')
  @ApiOperation({ summary: 'Get AI-generated insights' })
  @ApiResponse({ status: 200, description: 'Insights retrieved successfully' })
  async getInsights(@CurrentUser() user: any) {
    return this.aiService.getInsights(user.userId);
  }

  @Post('generate-insights')
  @ApiOperation({ summary: 'Generate new AI insights' })
  @ApiResponse({ status: 200, description: 'Insights generated successfully' })
  async generateInsights(@CurrentUser() user: any) {
    return this.aiService.generateInsights(user.userId);
  }
}
