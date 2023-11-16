import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CreateQuestionInput } from './create-question.dto';

@InputType()
export class UpdateQuestionInput extends CreateQuestionInput {
  @Field(() => Int)
  @IsNumber()
  questionId: number;
}
