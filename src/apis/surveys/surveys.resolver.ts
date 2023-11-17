import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateSurveyInput } from './dto/create-survey.dto';
import { UpdateSurveyInput } from './dto/update-survey.dto';
import { Survey } from './entites/survey.entity';
import { SurveysService } from './surveys.service';

@Resolver()
export class SurveysResolver {
  constructor(private readonly surveysService: SurveysService) {}

  @Mutation(() => Survey)
  createSurvey(
    @Args('createSurveyInput')
    createSurveyInput: CreateSurveyInput,
  ): Promise<Survey> {
    return this.surveysService.createSurvey({ createSurveyInput });
  }

  @Query(() => Survey)
  fetchSurvey(@Args('surveyId') surveyId: number): Promise<Survey> {
    return this.surveysService.fetchSurvey({ surveyId });
  }

  @Query(() => [Survey])
  fetchAllSurveys(): Promise<Survey[]> {
    return this.surveysService.fetchAllSurveys();
  }

  @Mutation(() => Survey)
  updateSurvey(
    @Args('updateSurveyInput')
    updateSurveyInput: UpdateSurveyInput,
  ): Promise<Survey> {
    return this.surveysService.updateSurvey({ updateSurveyInput });
  }

  @Mutation(() => Boolean)
  deleteSurvey(@Args('surveyId') surveyId: number): Promise<boolean> {
    return this.surveysService.deleteSurvey({ surveyId });
  }
}
