import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CreateSurveyInput } from './create-survey.dto';

@InputType()
export class UpdateSurveyInput extends PartialType(CreateSurveyInput) {
  @Field(() => Int)
  @IsNumber()
  surveyId: number;
}
