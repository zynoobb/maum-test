import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, Length } from 'class-validator';
import { NoWhitespace } from 'src/common/filter/custom-class-validator';

@InputType()
export class CreateSurveyInput {
  @Field(() => String)
  @Length(1, 100)
  @NoWhitespace()
  subject: string;

  @Field(() => String, { nullable: true })
  @Length(1, 500)
  @IsOptional()
  @NoWhitespace()
  description: string | null;
}
