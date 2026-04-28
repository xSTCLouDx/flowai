import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as S3 from '../lib/s3';
import { PresignedUploadDto } from './dto/presigned-upload.dto';
import { CompleteUploadDto } from './dto/complete-upload.dto';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}

  async generatePresignedUploadUrl(
    userId: string,
    presignedUploadDto: PresignedUploadDto,
  ) {
    const { fileName, contentType, isPublic } = presignedUploadDto;
    const { uploadUrl, cloud_storage_path } =
      await S3.generatePresignedUploadUrl(fileName, contentType, isPublic);

    return { uploadUrl, cloud_storage_path };
  }

  async completeUpload(userId: string, completeUploadDto: CompleteUploadDto) {
    const { cloud_storage_path } = completeUploadDto;

    // Extract filename from cloud_storage_path
    const fileName = cloud_storage_path.split('/').pop() || 'unknown';

    const file = await this.prisma.file.create({
      data: {
        userid: userId,
        filename: fileName,
        cloudstoragepath: cloud_storage_path,
        ispublic: cloud_storage_path.includes('/public/'),
        contenttype: 'application/octet-stream', // Default, could be improved
      },
    });

    return {
      id: file.id,
      cloud_storage_path: file.cloudstoragepath,
    };
  }

  async getFileUrl(userId: string, fileId: string, mode: string = 'view') {
    const file = await this.prisma.file.findFirst({
      where: {
        id: fileId,
        userid: userId,
      },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const url = await S3.getFileUrl(file.cloudstoragepath, file.ispublic);
    return { url };
  }

  async deleteFile(userId: string, fileId: string) {
    const file = await this.prisma.file.findFirst({
      where: {
        id: fileId,
        userid: userId,
      },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await S3.deleteFile(file.cloudstoragepath);
    await this.prisma.file.delete({ where: { id: fileId } });

    return { success: true };
  }

  async initiateMultipartUpload(userId: string, fileName: string, isPublic: boolean) {
    const { uploadId, cloud_storage_path } = await S3.initiateMultipartUpload(
      fileName,
      isPublic,
    );
    return { uploadId, cloud_storage_path };
  }

  async getPresignedUrlForPart(
    cloud_storage_path: string,
    uploadId: string,
    partNumber: number,
  ) {
    const url = await S3.getPresignedUrlForPart(
      cloud_storage_path,
      uploadId,
      partNumber,
    );
    return { url };
  }

  async completeMultipartUpload(
    userId: string,
    cloud_storage_path: string,
    uploadId: string,
    parts: { ETag: string; PartNumber: number }[],
  ) {
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
}
