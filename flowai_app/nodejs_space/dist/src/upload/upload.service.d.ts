import { PrismaService } from '../prisma/prisma.service';
import { PresignedUploadDto } from './dto/presigned-upload.dto';
import { CompleteUploadDto } from './dto/complete-upload.dto';
export declare class UploadService {
    private prisma;
    constructor(prisma: PrismaService);
    generatePresignedUploadUrl(userId: string, presignedUploadDto: PresignedUploadDto): Promise<{
        uploadUrl: string;
        cloud_storage_path: string;
    }>;
    completeUpload(userId: string, completeUploadDto: CompleteUploadDto): Promise<{
        id: string;
        cloud_storage_path: string;
    }>;
    getFileUrl(userId: string, fileId: string, mode?: string): Promise<{
        url: string;
    }>;
    deleteFile(userId: string, fileId: string): Promise<{
        success: boolean;
    }>;
    initiateMultipartUpload(userId: string, fileName: string, isPublic: boolean): Promise<{
        uploadId: any;
        cloud_storage_path: string;
    }>;
    getPresignedUrlForPart(cloud_storage_path: string, uploadId: string, partNumber: number): Promise<{
        url: string;
    }>;
    completeMultipartUpload(userId: string, cloud_storage_path: string, uploadId: string, parts: {
        ETag: string;
        PartNumber: number;
    }[]): Promise<{
        id: string;
        cloud_storage_path: string;
    }>;
}
