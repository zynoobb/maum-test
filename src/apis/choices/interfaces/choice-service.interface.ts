import { CreateChoiceInput } from '../dto/create-choice.dto';
import { UpdateChoiceInput } from '../dto/update-choice.dto';

export interface IChoiceServiceCreate {
  createChoiceInput: CreateChoiceInput;
}

export interface IChoiceServiceUpdate {
  updateChoiceInput: UpdateChoiceInput;
}
