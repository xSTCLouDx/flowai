import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    updateProfile(user: any, updateProfileDto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        name: string;
        avatarurl: string | null;
        ispremium: boolean;
    }>;
    getPreferences(user: any): Promise<{
        id: string;
        darkMode: boolean;
        language: string;
        notificationsEnabled: boolean;
        aiSuggestPriority: boolean;
        aiNaturalLanguage: boolean;
    }>;
    updatePreferences(user: any, updatePreferencesDto: UpdatePreferencesDto): Promise<{
        id: string;
        darkMode: boolean;
        language: string;
        notificationsEnabled: boolean;
        aiSuggestPriority: boolean;
        aiNaturalLanguage: boolean;
    }>;
    upgradeToPremium(user: any): Promise<{
        isPremium: boolean;
    }>;
}
