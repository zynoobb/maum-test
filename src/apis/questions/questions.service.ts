import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveysService } from '../surveys/surveys.service';
import { Question } from './entites/question.entity';
import { IQuestionServiceCreate } from './interfaces/question-service.interface';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
    private readonly surveysService: SurveysService,
  ) {}

  async createQuestion({
    createQuestionInput,
  }: IQuestionServiceCreate): Promise<Question> {
    const survey = await this.surveysService.findOneSurveyById({
      surveyId: createQuestionInput.surveyId,
    });

    if (!survey)
      throw new NotFoundException('해당 설문지가 존재하지 않습니다.');

    return this.questionsRepository.save({ ...createQuestionInput });
  }
}
