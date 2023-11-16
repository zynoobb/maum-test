import { CreateQuestionInput } from '../dto/create-question.dto';
import { DeleteQuestionInput } from '../dto/delete-question.dto';
import { UpdateQuestionInput } from '../dto/update-question.dto';

export interface IQuestionServiceCreate {
  createQuestionInput: CreateQuestionInput;
}

export interface IQuestionServiceUpdate {
  updateQuestionInput: UpdateQuestionInput;
}

export interface IQuestionServiceDelete {
  deleteQuestionInput: DeleteQuestionInput;
}
