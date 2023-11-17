import { CreateAnswerInput } from '../dto/create-answer.dto';
import { FetchAnswerInput } from '../dto/fetch-answer.dto';
import { UpdateAnswerInput } from '../dto/update-answer.dto';

export interface IAnswerServiceCreate {
  createAnswerInput: CreateAnswerInput;
}

export interface IAnswerServiceFetch {
  fetchAnswerInput: FetchAnswerInput;
}

export interface IAnswerServiceUpdate {
  updateAnswerInput: UpdateAnswerInput;
}
