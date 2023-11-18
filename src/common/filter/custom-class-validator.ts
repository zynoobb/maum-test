import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function NoWhitespace(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'noWhitespace',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') {
            return true; // 다른 유효성 검사 데코레이터에서 처리하도록 true 반환
          }
          return !/^\s|\s$/.test(value); // 양쪽 공백 여부 검증
        },
        defaultMessage(validationArguments?: ValidationArguments) {
          return '문자열은 양쪽에 공백을 포함할 수 없습니다.'; // 에러 메시지 커스텀
        },
      },
    });
  };
}
