import { PROGRESS } from '@prisma/client';
import { IsString, MinLength, MaxLength, IsBoolean, IsIn } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(4)
  @MaxLength(60)
  name: string;
}

export class UpdateTaskDto {
  @IsString()
  @MinLength(4)
  @MaxLength(60)
  name: string;

  @IsString()
  @IsIn(Object.keys(PROGRESS))
  @MaxLength(60)
  progress: PROGRESS;
}
