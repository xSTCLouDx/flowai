import {
  Controller,
  Get,
  Patch,
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
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('User')
@Controller('api/user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(user.userId, updateProfileDto);
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get user preferences' })
  @ApiResponse({ status: 200, description: 'Preferences retrieved' })
  async getPreferences(@CurrentUser() user: any) {
    return this.userService.getPreferences(user.userId);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Update user preferences' })
  @ApiResponse({ status: 200, description: 'Preferences updated successfully' })
  async updatePreferences(
    @CurrentUser() user: any,
    @Body() updatePreferencesDto: UpdatePreferencesDto,
  ) {
    return this.userService.updatePreferences(user.userId, updatePreferencesDto);
  }

  @Post('upgrade')
  @ApiOperation({ summary: 'Upgrade to premium' })
  @ApiResponse({ status: 200, description: 'Upgraded to premium' })
  async upgradeToPremium(@CurrentUser() user: any) {
    return this.userService.upgradeToPremium(user.userId);
  }
}
