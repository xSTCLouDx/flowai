import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateHabitDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, enum: ['daily', 'weekly', 'custom'] })
  @IsEnum(['daily', 'weekly', 'custom'])
  @IsOptional()
  frequency?: string;
}
