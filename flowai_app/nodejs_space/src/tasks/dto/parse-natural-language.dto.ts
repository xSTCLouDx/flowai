import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ParseNaturalLanguageDto {
  @ApiProperty({ example: 'Call John tomorrow at 3pm about the project proposal' })
  @IsString()
  text: string;
}
