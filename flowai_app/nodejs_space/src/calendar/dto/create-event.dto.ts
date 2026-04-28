import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Team meeting' })
  @IsString()
  title: string;

  @ApiProperty({ example: '2026-04-15T14:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-04-15T15:00:00Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ required: false, example: false })
  @IsBoolean()
  @IsOptional()
  allDay?: boolean;
}
