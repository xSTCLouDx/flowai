import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        name: string;
        avatarurl: string | null;
        ispremium: boolean;
    }>;
    getPreferences(userId: string): Promise<{
        id: string;
        darkMode: boolean;
        language: string;
        notificationsEnabled: boolean;
        aiSuggestPriority: boolean;
        aiNaturalLanguage: boolean;
    }>;
    updatePreferences(userId: string, updatePreferencesDto: UpdatePreferencesDto): Promise<{
        id: string;
        darkMode: boolean;
        language: string;
        notificationsEnabled: boolean;
        aiSuggestPriority: boolean;
        aiNaturalLanguage: boolean;
    }>;
    upgradeToPremium(userId: string): Promise<{
        isPremium: boolean;
    }>;
}
