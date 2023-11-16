import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveysService } from '../surveys/surveys.service';
import { Question } from './entites/question.entity';
import {
  IQuestionServiceCreate,
  IQuestionServiceDelete,
  IQuestionServiceUpdate,
} from './interfaces/question-service.interface';

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

    return this.questionsRepository.save({ survey, ...createQuestionInput });
  }

  async updateQuestion({
    updateQuestionInput,
  }: IQuestionServiceUpdate): Promise<Question> {
    const { surveyId, questionId } = updateQuestionInput;

    const survey = await this.surveysService.findOneSurveyById({ surveyId });
    if (!survey) {
      throw new NotFoundException('해당 설문지가 존재하지 않습니다.');
    }
    const question = await this.findOneQuestionById({ surveyId, questionId });
    if (!question) {
      throw new NotFoundException('해당 문항이 존재하지 않습니다.');
    }

    const updated = await this.questionsRepository.save({
      survey,
      ...question,
      ...updateQuestionInput,
    });

    return updated;
  }

  async deleteQuestion({
    deleteQuestionInput,
  }: IQuestionServiceDelete): Promise<boolean> {
    const { surveyId, questionId } = deleteQuestionInput;
    const question = await this.findOneQuestionById({ surveyId, questionId });

    if (!question) {
      throw new NotFoundException('해당 문항이 존재하지 않습니다.');
    }
    const deleteResult = await this.questionsRepository.delete({
      survey: { surveyId },
      questionId,
    });

    return deleteResult.affected ? true : false;
  }

  async findOneQuestionById({ surveyId, questionId }): Promise<Question> {
    return this.questionsRepository.findOne({
      where: { survey: { surveyId }, questionId },
    });
  }
}
