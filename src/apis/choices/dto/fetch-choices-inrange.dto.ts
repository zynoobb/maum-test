import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CreateChoiceInput } from './create-choice.dto';

@InputType()
export class FetchChoicesInRangeInput extends PickType(CreateChoiceInput, [
  'surveyId',
  'questionId',
]) {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  startChoiceId?: number;

  @Field(() => Int, { nullable: true, defaultValue: 100 })
  @IsOptional()
  endChoiceId?: number;
}
