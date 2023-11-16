import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveysService } from '../surveys/surveys.service';
import { Question } from './entites/question.entity';
import {
  IQuestionServiceCreate,
  IQuestionServiceDelete,
  IQuestionServiceFetch,
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
    return this.questionsRepository.save({ survey, ...createQuestionInput });
  }

  async fetchQuestion({
    fetchQuestionInput,
  }: IQuestionServiceFetch): Promise<Question> {
    const { questionId, surveyId } = fetchQuestionInput;
    const question = await this.questionsRepository.findOne({
      relations: ['survey', 'choices'],
      where: { survey: { surveyId }, questionId },
      order: { choices: { choiceId: 'ASC' } },
    });

    if (!question) {
      throw new NotFoundException('해당 문항이 존재하지 않습니다.');
    }
    return question;
  }

  async updateQuestion({
    updateQuestionInput,
  }: IQuestionServiceUpdate): Promise<Question> {
    const { surveyId, questionId } = updateQuestionInput;
    const survey = await this.surveysService.findOneSurveyById({ surveyId });
    const question = await this.findOneQuestionById({ surveyId, questionId });
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
    await this.findOneQuestionById({ surveyId, questionId });
    const deleteResult = await this.questionsRepository.delete({
      survey: { surveyId },
      questionId,
    });
    return deleteResult.affected ? true : false;
  }

  async findOneQuestionById({ surveyId, questionId }): Promise<Question> {
    const question = await this.questionsRepository.findOne({
      where: { survey: { surveyId }, questionId },
    });
    if (!question) {
      throw new NotFoundException('해당 문항이 존재하지 않습니다.');
    }
    return question;
  }
}
