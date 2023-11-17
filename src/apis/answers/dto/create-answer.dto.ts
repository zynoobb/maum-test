import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateAnswerInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
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
