import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateHabitDto {
  @ApiProperty({ example: 'Morning meditation' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: '10 minutes of mindfulness' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: ['daily', 'weekly', 'custom'], example: 'daily' })
  @IsEnum(['daily', 'weekly', 'custom'])
  frequency: string;
}
