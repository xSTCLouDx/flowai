import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, password, name } = signupDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Create default preferences
    await this.prisma.userpreference.create({
      data: {
        userid: user.id,
      },
    });

    // Generate JWT token
    const token = this.generateToken(user.id, user.email);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(user: any) {
    const token = this.generateToken(user.id, user.email);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async validateGoogleUser(profile: {
    googleId: string;
    email: string;
    name: string;
    avatarUrl?: string;
  }) {
    let user = await this.prisma.user.findUnique({
      where: { googleid: profile.googleId },
    });

    if (!user) {
      // Check if user with same email exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: profile.email },
      });

      if (existingUser) {
        // Link Google account to existing user
        user = await this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            googleid: profile.googleId,
            avatarurl: profile.avatarUrl || existingUser.avatarurl,
          },
        });
      } else {
        // Create new user
        user = await this.prisma.user.create({
          data: {
            googleid: profile.googleId,
            email: profile.email,
            name: profile.name,
            avatarurl: profile.avatarUrl,
          },
        });

        // Create default preferences
        await this.prisma.userpreference.create({
          data: {
            userid: user.id,
          },
        });
      }
    }

    return user;
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarurl: true,
        ispremium: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  private generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }
}
