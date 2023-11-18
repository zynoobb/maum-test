import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, Length } from 'class-validator';
import { NoWhitespace } from 'src/common/filter/custom-class-validator';

@InputType()
export class UpdateChoiceInput {
  @Field(() => Int)
  @IsNumber()
  choiceId: number;

  @Field(() => String, { nullable: true })
  @Length(1, 300)
  @IsOptional()
  @NoWhitespace()
  choiceContent?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  choiceScore?: number;
}
