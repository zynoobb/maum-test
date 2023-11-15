import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateSurveyInput } from './dto/create-survey.dto';
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
}
