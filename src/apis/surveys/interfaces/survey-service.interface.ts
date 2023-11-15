import { CreateSurveyInput } from '../dto/create-survey.dto';
import { UpdateSurveyInput } from '../dto/update-survey.dto';

export interface ISurveysServiceCreate {
  createSurveyInput: CreateSurveyInput;
}

export interface ISurveyServiceUpdate {
  surveyId: number;
  updateSurveyInput: UpdateSurveyInput;
}
