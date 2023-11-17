import { CreateChoiceInput } from '../dto/create-choice.dto';
import { DeleteChoiceInput } from '../dto/delete-choice.dto';
import { FetchChoiceInput } from '../dto/fetch-choice.dto';
import { FetchChoicesInRangeInput } from '../dto/fetch-choices-inrange.dto';
import { UpdateChoiceInput } from '../dto/update-choice.dto';

export interface IChoiceServiceCreate {
  createChoiceInput: CreateChoiceInput;
}

export interface IChoiceServiceUpdate {
  updateChoiceInput: UpdateChoiceInput;
}

export interface IChoiceServiceDelete {
  deleteChoiceInput: DeleteChoiceInput;
}

export interface IChoiceServiceFetch {
  fetchChoiceInput: FetchChoiceInput;
}

export interface IChoiceServiceFetchInRange {
  fetchChoicesInRangeInput: FetchChoicesInRangeInput;
}
