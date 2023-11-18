import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { Answer } from '../entites/answer.entity';
import { CreateAnswerInput } from './create-answer.dto';

@InputType()
export class FetchAnswersResultInput extends PickType(CreateAnswerInput, [
  'surveyId',
  'userId',
]) {}

@ObjectType()
export class AnswersAndResult {
  @Field(() => [Answer])
  answers: Answer[];

  @Field(() => Int)
  @IsNumber()
  totalScore: number;
}
