import { IsString, MinLength, MaxLength } from 'class-validator';

export class SearchTodoListDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  name: string;
}
