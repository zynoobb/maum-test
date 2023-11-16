import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class FetchQuestionsInRangeInput {
  @Field(() => Int)
  @IsNumber()
  surveyId: number;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  startQuestionId?: number;

  @Field(() => Int, { nullable: true, defaultValue: 100 })
  @IsOptional()
  endQuestionId?: number;
}
