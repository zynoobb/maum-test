import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, Length } from 'class-validator';

@InputType()
export class UpdateQuestionInput {
  @Field(() => Int)
  @IsNumber()
  questionId: number;

  @Field(() => String)
  @Length(1, 300)
  @IsNotEmpty()
  content: string;
}
