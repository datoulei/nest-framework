import { Length, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  @Length(8, 32)
  password: string;
}
