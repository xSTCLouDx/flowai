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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const upload_service_1 = require("./upload.service");
const presigned_upload_dto_1 = require("./dto/presigned-upload.dto");
const complete_upload_dto_1 = require("./dto/complete-upload.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let UploadController = class UploadController {
    uploadService;
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async generatePresignedUploadUrl(user, presignedUploadDto) {
        return this.uploadService.generatePresignedUploadUrl(user.userId, presignedUploadDto);
    }
    async completeUpload(user, completeUploadDto) {
        return this.uploadService.completeUpload(user.userId, completeUploadDto);
    }
    async getFileUrl(user, fileId, mode) {
        return this.uploadService.getFileUrl(user.userId, fileId, mode);
    }
    async deleteFile(user, fileId) {
        return this.uploadService.deleteFile(user.userId, fileId);
    }
    async initiateMultipartUpload(user, body) {
        return this.uploadService.initiateMultipartUpload(user.userId, body.fileName, body.isPublic);
    }
    async getPresignedUrlForPart(body) {
        return this.uploadService.getPresignedUrlForPart(body.cloud_storage_path, body.uploadId, body.partNumber);
    }
    async completeMultipartUpload(user, body) {
        return this.uploadService.completeMultipartUpload(user.userId, body.cloud_storage_path, body.uploadId, body.parts);
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('presigned'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate presigned URL for file upload' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Presigned URL generated' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, presigned_upload_dto_1.PresignedUploadDto]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "generatePresignedUploadUrl", null);
__decorate([
    (0, common_1.Post)('complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete file upload' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Upload completed' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, complete_upload_dto_1.CompleteUploadDto]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "completeUpload", null);
__decorate([
    (0, common_1.Get)('files/:id/url'),
    (0, swagger_1.ApiOperation)({ summary: 'Get file URL' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'File URL retrieved' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('mode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getFileUrl", null);
__decorate([
    (0, common_1.Delete)('files/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete file' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'File deleted' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "deleteFile", null);
__decorate([
    (0, common_1.Post)('multipart/initiate'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate multipart upload' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Multipart upload initiated' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "initiateMultipartUpload", null);
__decorate([
    (0, common_1.Post)('multipart/part'),
    (0, swagger_1.ApiOperation)({ summary: 'Get presigned URL for multipart upload part' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Presigned URL for part generated' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getPresignedUrlForPart", null);
__decorate([
    (0, common_1.Post)('multipart/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete multipart upload' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Multipart upload completed' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "completeMultipartUpload", null);
exports.UploadController = UploadController = __decorate([
    (0, swagger_1.ApiTags)('Upload'),
    (0, common_1.Controller)('upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map