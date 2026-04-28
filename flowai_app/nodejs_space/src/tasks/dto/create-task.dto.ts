import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsEnum, IsInt } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Complete project proposal' })
  @IsString()
  title: string;

  @ApiProperty({ required: false, example: 'Prepare slides and budget' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, example: '2026-04-15T14:00:00Z' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ required: false, enum: ['high', 'medium', 'low'], example: 'high' })
  @IsEnum(['high', 'medium', 'low'])
  @IsOptional()
  priority?: string;

  @ApiProperty({ required: false, example: 'Work' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ required: false, example: 30 })
  @IsInt()
  @IsOptional()
  reminderMinutesBefore?: number;
}
