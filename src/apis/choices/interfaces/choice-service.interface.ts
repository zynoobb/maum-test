import { CreateChoiceInput } from '../dto/create-choice.dto';
import { DeleteChoiceInput } from '../dto/delete-choice.dto';
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
