import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CompleteUploadDto {
  @ApiProperty()
  @IsString()
  cloud_storage_path: string;
}
