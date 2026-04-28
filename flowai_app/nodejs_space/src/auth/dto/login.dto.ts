import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john@doe.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'johndoe123' })
  @IsString()
  password: string;
}
