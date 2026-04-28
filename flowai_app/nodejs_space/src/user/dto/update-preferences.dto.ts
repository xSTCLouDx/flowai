import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class UpdatePreferencesDto {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  darkMode?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  notificationsEnabled?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  aiSuggestPriority?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  aiNaturalLanguage?: boolean;
}
