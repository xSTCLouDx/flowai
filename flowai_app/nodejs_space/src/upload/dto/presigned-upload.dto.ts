import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

export class PresignedUploadDto {
  @ApiProperty({ example: 'avatar.jpg' })
  @IsString()
  fileName: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString()
  contentType: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isPublic: boolean;
}
