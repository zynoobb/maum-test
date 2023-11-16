import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class FetchQuestionInput {
  @Field(() => Int)
  @IsNumber()
  surveyId: number;

  @Field(() => Int)
  @IsNumber()
  questionId: number;
}
