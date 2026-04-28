import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SuggestPriorityDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsString()
  taskId: string;
}
