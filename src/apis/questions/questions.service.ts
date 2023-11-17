import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { SurveysService } from '../surveys/surveys.service';
import { Question } from './entites/question.entity';
import {
  IQuestionServiceCreate,
  IQuestionServiceDelete,
  IQuestionServiceFetch,
  IQuestionServiceFetchInRange,
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
    return this.questionsRepository.save({
      survey,
      ...createQuestionInput,
      choices: [],
      answers: [],
    });
  }

  async fetchQuestion({
    fetchQuestionInput,
  }: IQuestionServiceFetch): Promise<Question> {
    const { questionId, surveyId } = fetchQuestionInput;
    const question = await this.questionsRepository.findOne({
      relations: ['survey', 'choices', 'answers'],
      where: { survey: { surveyId }, questionId },
      order: { choices: { choiceId: 'ASC' } },
    });

    if (!question) {
      throw new NotFoundException('해당 문항이 존재하지 않습니다.');
    }
    return question;
  }

  async fetchQuestionsInRange({
    fetchQuestionsInRangeInput,
  }: IQuestionServiceFetchInRange): Promise<Question[]> {
    const { surveyId, startQuestionId, endQuestionId } =
      fetchQuestionsInRangeInput;
    await this.surveysService.findOneSurveyById({ surveyId });

    const questions = await this.questionsRepository.find({
      relations: ['survey', 'choices', 'answers'],
      where: {
        survey: { surveyId },
        questionId: Between(startQuestionId, endQuestionId),
      },
      order: { questionId: 'ASC' },
    });

    return questions;
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
      relations: ['survey', 'choices', 'answers'],
      where: { survey: { surveyId }, questionId },
    });
    if (!question) {
      throw new NotFoundException('해당 문항이 존재하지 않습니다.');
    }
    return question;
  }
}
