import { Args, Mutation, Resolver } from '@nestjs/graphql';
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

  @Mutation(() => Survey)
  updateSurvey(
    @Args('surveyId') surveyId: number,
    @Args('updateSurveyInput')
    updateSurveyInput: UpdateSurveyInput,
  ): Promise<Survey> {
    return this.surveysService.updateSurvey({ surveyId, updateSurveyInput });
  }

  @Mutation(() => Boolean)
  deleteSurvey(@Args('surveyId') surveyId: number): Promise<boolean> {
    return this.surveysService.deleteSurvey({ surveyId });
  }
}
