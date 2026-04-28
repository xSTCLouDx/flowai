import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Analytics')
@Controller('api/analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('productivity')
  @ApiOperation({ summary: 'Get productivity analytics' })
  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['week', 'month', '3months'],
  })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  async getProductivity(
    @CurrentUser() user: any,
    @Query('period') period?: string,
  ) {
    return this.analyticsService.getProductivity(user.userId, period);
  }
}
