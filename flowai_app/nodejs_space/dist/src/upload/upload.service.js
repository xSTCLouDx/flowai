"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const S3 = __importStar(require("../lib/s3"));
let UploadService = class UploadService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generatePresignedUploadUrl(userId, presignedUploadDto) {
        const { fileName, contentType, isPublic } = presignedUploadDto;
        const { uploadUrl, cloud_storage_path } = await S3.generatePresignedUploadUrl(fileName, contentType, isPublic);
        return { uploadUrl, cloud_storage_path };
    }
    async completeUpload(userId, completeUploadDto) {
        const { cloud_storage_path } = completeUploadDto;
        const fileName = cloud_storage_path.split('/').pop() || 'unknown';
        const file = await this.prisma.file.create({
            data: {
                userid: userId,
                filename: fileName,
                cloudstoragepath: cloud_storage_path,
                ispublic: cloud_storage_path.includes('/public/'),
                contenttype: 'application/octet-stream',
            },
        });
        return {
            id: file.id,
            cloud_storage_path: file.cloudstoragepath,
        };
    }
    async getFileUrl(userId, fileId, mode = 'view') {
        const file = await this.prisma.file.findFirst({
            where: {
                id: fileId,
                userid: userId,
            },
        });
        if (!file) {
            throw new common_1.NotFoundException('File not found');
        }
        const url = await S3.getFileUrl(file.cloudstoragepath, file.ispublic);
        return { url };
    }
    async deleteFile(userId, fileId) {
        const file = await this.prisma.file.findFirst({
            where: {
                id: fileId,
                userid: userId,
            },
        });
        if (!file) {
            throw new common_1.NotFoundException('File not found');
        }
        await S3.deleteFile(file.cloudstoragepath);
        await this.prisma.file.delete({ where: { id: fileId } });
        return { success: true };
    }
    async initiateMultipartUpload(userId, fileName, isPublic) {
        const { uploadId, cloud_storage_path } = await S3.initiateMultipartUpload(fileName, isPublic);
        return { uploadId, cloud_storage_path };
    }
    async getPresignedUrlForPart(cloud_storage_path, uploadId, partNumber) {
        const url = await S3.getPresignedUrlForPart(cloud_storage_path, uploadId, partNumber);
        return { url };
    }
    async completeMultipartUpload(userId, cloud_storage_path, uploadId, parts) {
        await S3.completeMultipartUpload(cloud_storage_path, uploadId, parts);
        const fileName = cloud_storage_path.split('/').pop() || 'unknown';
        const file = await this.prisma.file.create({
            data: {
                userid: userId,
                filename: fileName,
                cloudstoragepath: cloud_storage_path,
                ispublic: cloud_storage_path.includes('/public/'),
                contenttype: 'application/octet-stream',
            },
        });
        return {
            id: file.id,
            cloud_storage_path: file.cloudstoragepath,
        };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UploadService);
//# sourceMappingURL=upload.service.js.map