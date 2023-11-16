import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CreateQuestionInput } from './create-question.dto';

@InputType()
export class UpdateQuestionInput extends PartialType(CreateQuestionInput) {
  @Field(() => Int)
  @IsNumber()
  questionId: number;
}
