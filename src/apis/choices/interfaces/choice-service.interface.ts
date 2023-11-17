import { CreateChoiceInput } from '../dto/create-choice.dto';
import { FetchChoicesInRangeInput } from '../dto/fetch-choices-inrange.dto';
import { UpdateChoiceInput } from '../dto/update-choice.dto';

export interface IChoiceServiceCreate {
  createChoiceInput: CreateChoiceInput;
}

export interface IChoiceServiceUpdate {
  updateChoiceInput: UpdateChoiceInput;
}

export interface IChoiceServiceFetchInRange {
  fetchChoicesInRangeInput: FetchChoicesInRangeInput;
}
