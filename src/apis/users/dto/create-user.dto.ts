import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { NoWhitespace } from 'src/common/filter/custom-class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @Length(1, 50)
  @NoWhitespace()
  nickname: string;
}
