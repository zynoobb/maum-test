import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class UpdateAnswerInput {
  @Field(() => Int)
  @IsNumber()
  answerId: number;

  @Field(() => Int)
  @IsNumber()
  choiceId: number;
}
