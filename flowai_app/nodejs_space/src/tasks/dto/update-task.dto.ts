import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsEnum, IsInt } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ required: false, enum: ['high', 'medium', 'low'] })
  @IsEnum(['high', 'medium', 'low'])
  @IsOptional()
  priority?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ required: false, enum: ['pending', 'completed'] })
  @IsEnum(['pending', 'completed'])
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  reminderMinutesBefore?: number;
}
