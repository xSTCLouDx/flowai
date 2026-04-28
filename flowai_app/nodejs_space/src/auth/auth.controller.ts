import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GoogleAuthGuard } from '../common/guards/google-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    return this.authService.login((req as any).user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@CurrentUser() user: any) {
    return this.authService.getMe(user.userId);
  }

  @Get('auth/google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiResponse({ status: 302, description: 'Redirects to Google' })
  async googleAuth(@Query('redirect_uri') redirectUri: string) {
    // Guard will handle the redirect
  }

  @Get('auth/google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ status: 302, description: 'Redirects to client with JWT' })
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = (req as any).user;
    const token = this.authService['generateToken'](
      user.id,
      user.email,
    );

    // Redirect to client app with token
    // In production, this should redirect to the mobile app deep link
    const redirectUrl = `${process.env.APP_ORIGIN || 'http://localhost:3000'}?token=${token}`;
    res.redirect(redirectUrl);
  }
}
