import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @MinLength(6)
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginDto {
  @IsEmail()
  @MinLength(6)
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
