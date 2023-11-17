import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

@InputType()
export class CreateSurveyInput {
  @Field(() => String)
  @Length(1, 100)
  @IsNotEmpty()
  subject: string;

  @Field(() => String, { nullable: true })
  @Length(1, 500)
  @IsOptional()
  description: string | null;
}
