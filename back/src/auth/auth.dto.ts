import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  username: string;

  @IsString()
  @Matches(/[0-9]+/, { message: 'Password must contain a digit' })
  @Matches(/[a-z]+/, { message: 'Password must contain a lowercase letter' })
  @Matches(/[A-Z]+/, { message: 'Password must contain an uppercase letter' })
  @Matches(/[*.!@$%^&(){}[\]:;<>,.?/~_+\-=|]+/, {
    message: 'Password must contain a symbol (*.!@$%^&(){}[]:;<>,.?/~_+-=|)',
  })
  @MinLength(8)
  @MaxLength(32)
  password: string;
}

export class LoginDto {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string;
}
