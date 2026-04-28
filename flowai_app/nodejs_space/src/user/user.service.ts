import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: updateProfileDto.name,
        avatarurl: updateProfileDto.avatarUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarurl: true,
        ispremium: true,
      },
    });

    return updatedUser;
  }

  async getPreferences(userId: string) {
    let preferences = await this.prisma.userpreference.findUnique({
      where: { userid: userId },
    });

    if (!preferences) {
      // Create default preferences if not exists
      preferences = await this.prisma.userpreference.create({
        data: {
          userid: userId,
        },
      });
    }

    return {
      id: preferences.id,
      darkMode: preferences.darkmode,
      language: preferences.language,
      notificationsEnabled: preferences.notificationsenabled,
      aiSuggestPriority: preferences.aisuggestpriority,
      aiNaturalLanguage: preferences.ainaturallanguage,
    };
  }

  async updatePreferences(
    userId: string,
    updatePreferencesDto: UpdatePreferencesDto,
  ) {
    const preferences = await this.prisma.userpreference.upsert({
      where: { userid: userId },
      update: {
        darkmode: updatePreferencesDto.darkMode,
        language: updatePreferencesDto.language,
        notificationsenabled: updatePreferencesDto.notificationsEnabled,
        aisuggestpriority: updatePreferencesDto.aiSuggestPriority,
        ainaturallanguage: updatePreferencesDto.aiNaturalLanguage,
      },
      create: {
        userid: userId,
        darkmode: updatePreferencesDto.darkMode,
        language: updatePreferencesDto.language,
        notificationsenabled: updatePreferencesDto.notificationsEnabled,
        aisuggestpriority: updatePreferencesDto.aiSuggestPriority,
        ainaturallanguage: updatePreferencesDto.aiNaturalLanguage,
      },
    });

    return {
      id: preferences.id,
      darkMode: preferences.darkmode,
      language: preferences.language,
      notificationsEnabled: preferences.notificationsenabled,
      aiSuggestPriority: preferences.aisuggestpriority,
      aiNaturalLanguage: preferences.ainaturallanguage,
    };
  }

  async upgradeToPremium(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { ispremium: true },
    });

    return { isPremium: true };
  }
}
