import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, Length } from 'class-validator';

@InputType()
export class CreateSurveyInput {
  @Field(() => String)
  @Length(1, 100)
  subject: string;

  @Field(() => String, { nullable: true })
  @Length(1, 500)
  @IsOptional()
  description: string | null;
}
