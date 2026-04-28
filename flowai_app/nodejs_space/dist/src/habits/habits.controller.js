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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HabitsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const habits_service_1 = require("./habits.service");
const create_habit_dto_1 = require("./dto/create-habit.dto");
const update_habit_dto_1 = require("./dto/update-habit.dto");
const complete_habit_dto_1 = require("./dto/complete-habit.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let HabitsController = class HabitsController {
    habitsService;
    constructor(habitsService) {
        this.habitsService = habitsService;
    }
    async create(user, createHabitDto) {
        return this.habitsService.create(user.userId, createHabitDto);
    }
    async findAll(user) {
        return this.habitsService.findAll(user.userId);
    }
    async getCompletions(user, from, to) {
        return this.habitsService.getCompletions(user.userId, from, to);
    }
    async findOne(user, id) {
        return this.habitsService.findOne(user.userId, id);
    }
    async update(user, id, updateHabitDto) {
        return this.habitsService.update(user.userId, id, updateHabitDto);
    }
    async delete(user, id) {
        return this.habitsService.delete(user.userId, id);
    }
    async complete(user, id, completeHabitDto) {
        return this.habitsService.complete(user.userId, id, completeHabitDto);
    }
    async uncomplete(user, id, date) {
        return this.habitsService.uncomplete(user.userId, id, date);
    }
};
exports.HabitsController = HabitsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new habit' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Habit created successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Free users can only create 3 habits',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_habit_dto_1.CreateHabitDto]),
    __metadata("design:returntype", Promise)
], HabitsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all habits' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Habits retrieved successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HabitsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('completions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get habit completions' }),
    (0, swagger_1.ApiQuery)({ name: 'from', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Completions retrieved successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], HabitsController.prototype, "getCompletions", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get habit by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Habit retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Habit not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], HabitsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update habit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Habit updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Habit not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_habit_dto_1.UpdateHabitDto]),
    __metadata("design:returntype", Promise)
], HabitsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete habit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Habit deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Habit not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], HabitsController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark habit as completed' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Habit marked as completed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Habit not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, complete_habit_dto_1.CompleteHabitDto]),
    __metadata("design:returntype", Promise)
], HabitsController.prototype, "complete", null);
__decorate([
    (0, common_1.Delete)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Uncomplete habit' }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Habit uncompleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Habit not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], HabitsController.prototype, "uncomplete", null);
exports.HabitsController = HabitsController = __decorate([
    (0, swagger_1.ApiTags)('Habits'),
    (0, common_1.Controller)('api/habits'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [habits_service_1.HabitsService])
], HabitsController);
//# sourceMappingURL=habits.controller.js.map