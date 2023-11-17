import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class FetchUserInput {
  @Field(() => String)
  @IsString()
  userId: string;
}
