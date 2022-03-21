import { IsString, MinLength, MaxLength, IsBoolean } from 'class-validator';

export class CreateTodoListDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @IsString()
  @MaxLength(60)
  description: string;
}

export class UpdateTodoListDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @IsString()
  @MaxLength(60)
  description: string;

  @IsBoolean()
  shared: boolean;
}
