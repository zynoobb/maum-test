import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @Length(1, 50)
  nickname: string;
}
