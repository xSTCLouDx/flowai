import { UploadService } from './upload.service';
import { PresignedUploadDto } from './dto/presigned-upload.dto';
import { CompleteUploadDto } from './dto/complete-upload.dto';
export declare class UploadController {
    private uploadService;
    constructor(uploadService: UploadService);
    generatePresignedUploadUrl(user: any, presignedUploadDto: PresignedUploadDto): Promise<{
        uploadUrl: string;
        cloud_storage_path: string;
    }>;
    completeUpload(user: any, completeUploadDto: CompleteUploadDto): Promise<{
        id: string;
        cloud_storage_path: string;
    }>;
    getFileUrl(user: any, fileId: string, mode?: string): Promise<{
        url: string;
    }>;
    deleteFile(user: any, fileId: string): Promise<{
        success: boolean;
    }>;
    initiateMultipartUpload(user: any, body: {
        fileName: string;
        isPublic: boolean;
    }): Promise<{
        uploadId: any;
        cloud_storage_path: string;
    }>;
    getPresignedUrlForPart(body: {
        cloud_storage_path: string;
        uploadId: string;
        partNumber: number;
    }): Promise<{
        url: string;
    }>;
    completeMultipartUpload(user: any, body: {
        cloud_storage_path: string;
        uploadId: string;
        parts: {
            ETag: string;
            PartNumber: number;
        }[];
    }): Promise<{
        id: string;
        cloud_storage_path: string;
    }>;
}
