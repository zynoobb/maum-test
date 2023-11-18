import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { NoWhitespace } from 'src/common/filter/custom-class-validator';

@InputType()
export class CreateAnswerInput {
  @Field(() => String)
  @IsString()
  @NoWhitespace()
  userId: string;

  @Field(() => Int)
  @IsNumber()
  surveyId: number;

  @Field(() => Int)
  @IsNumber()
  questionId: number;

  @Field(() => Int)
  @IsNumber()
  choiceId: number;
}
