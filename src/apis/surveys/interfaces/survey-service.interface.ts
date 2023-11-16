import { CreateSurveyInput } from '../dto/create-survey.dto';
import { FetchSurveyInput } from '../dto/fetch-survey.dto';
import { UpdateSurveyInput } from '../dto/update-survey.dto';

export interface ISurveysServiceCreate {
  createSurveyInput: CreateSurveyInput;
}

export interface ISurveysServiceUpdate {
  surveyId: number;
  updateSurveyInput: UpdateSurveyInput;
}

export interface ISurveysServiceFetch {
  fetchSurveyInput: FetchSurveyInput;
}
