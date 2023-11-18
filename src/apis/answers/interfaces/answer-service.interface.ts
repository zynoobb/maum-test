import { CreateAnswerInput } from '../dto/create-answer.dto';
import { FetchAnswersResultInput } from '../dto/fetch-answers-result.dto';
import { UpdateAnswerInput } from '../dto/update-answer.dto';

export interface IAnswerServiceCreate {
  createAnswerInput: CreateAnswerInput;
}
export interface IAnswerServiceUpdate {
  updateAnswerInput: UpdateAnswerInput;
}

export interface IAnswerServiceFindOnePreAnswer {
  findPreAnswerInput: {
    surveyId: number;
    questionId: number;
    userId: string;
  };
}

export interface IAnswerServiceFetchAnswerResult {
  fetchAnswersResultInput: FetchAnswersResultInput;
}
