import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class FetchSurveyInput {
  @Field(() => Int)
  @IsNumber()
  surveyId: number;
}
