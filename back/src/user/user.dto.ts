import { IsString, MinLength, MaxLength, IsBase64 } from 'class-validator';

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

// https://stackoverflow.com/questions/13378815/base64-length-calculation
// 1 MB = 1048576 B
const max64Length = ((4 * 1048576) / 3 + 3) & ~3;

export class UpdateProfilePicture {
  @IsString()
  @IsBase64()
  @MinLength(1)
  @MaxLength(max64Length)
  profilePictureBase64: string;
}
