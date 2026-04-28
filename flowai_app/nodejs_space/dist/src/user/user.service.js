"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
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
    async getPreferences(userId) {
        let preferences = await this.prisma.userpreference.findUnique({
            where: { userid: userId },
        });
        if (!preferences) {
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
    async updatePreferences(userId, updatePreferencesDto) {
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
    async upgradeToPremium(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { ispremium: true },
        });
        return { isPremium: true };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map