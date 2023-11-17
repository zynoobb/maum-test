import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, Length } from 'class-validator';

@InputType()
export class UpdateChoiceInput {
  @Field(() => Int)
  @IsNumber()
  choiceId: number;

  @Field(() => String, { nullable: true })
  @Length(1, 300)
  @IsOptional()
  choiceContent?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  choiceScore?: number;
}
