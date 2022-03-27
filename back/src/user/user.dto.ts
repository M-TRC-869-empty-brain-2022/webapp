import { IsString, MinLength, MaxLength, registerDecorator } from 'class-validator';

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

const CustomIsBase64 = () => (object: any, propertyName: string) => {
  registerDecorator({
    name: 'CustomIsBase64',
    target: object.constructor,
    propertyName: propertyName,
    options: { message: 'string must be base64 encoded' },
    validator: {
      validate: (incomingBase64: string) =>
        !!incomingBase64.match(
          /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i,
        ),
    },
  });
};

export class UpdateProfilePicture {
  @IsString()
  @CustomIsBase64()
  @MinLength(1)
  @MaxLength(max64Length)
  profilePictureBase64: string;
}
