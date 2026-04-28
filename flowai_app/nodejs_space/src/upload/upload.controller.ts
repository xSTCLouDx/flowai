import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { PresignedUploadDto } from './dto/presigned-upload.dto';
import { CompleteUploadDto } from './dto/complete-upload.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('presigned')
  @ApiOperation({ summary: 'Generate presigned URL for file upload' })
  @ApiResponse({ status: 200, description: 'Presigned URL generated' })
  async generatePresignedUploadUrl(
    @CurrentUser() user: any,
    @Body() presignedUploadDto: PresignedUploadDto,
  ) {
    return this.uploadService.generatePresignedUploadUrl(
      user.userId,
      presignedUploadDto,
    );
  }

  @Post('complete')
  @ApiOperation({ summary: 'Complete file upload' })
  @ApiResponse({ status: 200, description: 'Upload completed' })
  async completeUpload(
    @CurrentUser() user: any,
    @Body() completeUploadDto: CompleteUploadDto,
  ) {
    return this.uploadService.completeUpload(user.userId, completeUploadDto);
  }

  @Get('files/:id/url')
  @ApiOperation({ summary: 'Get file URL' })
  @ApiResponse({ status: 200, description: 'File URL retrieved' })
  async getFileUrl(
    @CurrentUser() user: any,
    @Param('id') fileId: string,
    @Query('mode') mode?: string,
  ) {
    return this.uploadService.getFileUrl(user.userId, fileId, mode);
  }

  @Delete('files/:id')
  @ApiOperation({ summary: 'Delete file' })
  @ApiResponse({ status: 200, description: 'File deleted' })
  async deleteFile(@CurrentUser() user: any, @Param('id') fileId: string) {
    return this.uploadService.deleteFile(user.userId, fileId);
  }

  @Post('multipart/initiate')
  @ApiOperation({ summary: 'Initiate multipart upload' })
  @ApiResponse({ status: 200, description: 'Multipart upload initiated' })
  async initiateMultipartUpload(
    @CurrentUser() user: any,
    @Body() body: { fileName: string; isPublic: boolean },
  ) {
    return this.uploadService.initiateMultipartUpload(
      user.userId,
      body.fileName,
      body.isPublic,
    );
  }

  @Post('multipart/part')
  @ApiOperation({ summary: 'Get presigned URL for multipart upload part' })
  @ApiResponse({ status: 200, description: 'Presigned URL for part generated' })
  async getPresignedUrlForPart(
    @Body()
    body: {
      cloud_storage_path: string;
      uploadId: string;
      partNumber: number;
    },
  ) {
    return this.uploadService.getPresignedUrlForPart(
      body.cloud_storage_path,
      body.uploadId,
      body.partNumber,
    );
  }

  @Post('multipart/complete')
  @ApiOperation({ summary: 'Complete multipart upload' })
  @ApiResponse({ status: 200, description: 'Multipart upload completed' })
  async completeMultipartUpload(
    @CurrentUser() user: any,
    @Body()
    body: {
      cloud_storage_path: string;
      uploadId: string;
      parts: { ETag: string; PartNumber: number }[];
    },
  ) {
    return this.uploadService.completeMultipartUpload(
      user.userId,
      body.cloud_storage_path,
      body.uploadId,
      body.parts,
    );
  }
}
