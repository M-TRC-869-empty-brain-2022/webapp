import { Role } from '@prisma/client';
import { IsString, IsIn } from 'class-validator';

export class AdminUpdateUserDto {
  @IsString()
  @IsIn(Object.keys(Role))
  role: Role;
}
