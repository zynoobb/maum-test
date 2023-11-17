import { InputType } from '@nestjs/graphql';
import { CreateAnswerInput } from './create-answer.dto';

@InputType()
export class FetchAnswerInput extends CreateAnswerInput {}
