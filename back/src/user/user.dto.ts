import { IsString, MinLength, MaxLength } from 'class-validator';

export class ResetPwdDto {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  oldPassword: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  newPassword: string;
}
