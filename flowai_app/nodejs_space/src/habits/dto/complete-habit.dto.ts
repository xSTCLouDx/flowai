import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class CompleteHabitDto {
  @ApiProperty({ required: false, example: '2026-04-07' })
  @IsDateString()
  @IsOptional()
  date?: string;
}
