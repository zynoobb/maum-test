import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, Length } from 'class-validator';

@InputType()
export class CreateChoiceInput {
  @Field(() => Int)
  @IsNumber()
  surveyId: number;

  @Field(() => Int)
  @IsNumber()
  questionId: number;

  @Field(() => String)
  @Length(1, 300)
  @IsNotEmpty()
  choiceContent: string;

  @Field(() => Int)
  @IsNumber()
  choiceScore: number;
}
