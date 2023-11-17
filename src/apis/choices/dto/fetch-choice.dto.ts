import { InputType, PickType } from '@nestjs/graphql';

import { UpdateChoiceInput } from './update-choice.dto';

@InputType()
export class FetchChoiceInput extends PickType(UpdateChoiceInput, [
  'surveyId',
  'questionId',
  'choiceId',
]) {}
