import { CreateAnswerInput } from '../dto/create-answer.dto';
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
