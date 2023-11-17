import { CreateQuestionInput } from '../dto/create-question.dto';
import { FetchQuestionsInRangeInput } from '../dto/fetch-questions-inrange.dto';
import { UpdateQuestionInput } from '../dto/update-question.dto';

export interface IQuestionServiceCreate {
  createQuestionInput: CreateQuestionInput;
}

export interface IQuestionServiceUpdate {
  updateQuestionInput: UpdateQuestionInput;
}
export interface IQuestionServiceFetchInRange {
  fetchQuestionsInRangeInput: FetchQuestionsInRangeInput;
}
