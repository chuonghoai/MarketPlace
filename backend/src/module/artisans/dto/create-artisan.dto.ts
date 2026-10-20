import {
  IsDateString,
  IsOptional,
  IsString,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsNotFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (!value) return true;
          const date = new Date(value);
          if (isNaN(date.getTime())) return false;
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          return date <= today;
        },
        defaultMessage(_args: ValidationArguments) {
          return 'Ngày sinh không thể nằm trong tương lai';
        },
      },
    });
  };
}

export class CreateArtisanDto {
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày sinh không đúng định dạng ngày (YYYY-MM-DD)' })
  @IsNotFutureDate({ message: 'Ngày sinh không thể nằm trong tương lai' })
  birthDate?: string;
}
