import { CreateQuestionInput } from '../dto/create-question.dto';
import { DeleteQuestionInput } from '../dto/delete-question.dto';
import { FetchQuestionInput } from '../dto/fetch-question.dto';
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

export interface IQuestionServiceFetch {
  fetchQuestionInput: FetchQuestionInput;
}
