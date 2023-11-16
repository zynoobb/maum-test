import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionsService } from '../questions/questions.service';
import { SurveysService } from '../surveys/surveys.service';
import { Choice } from './entites/choice.entity';
import {
  IChoiceServiceCreate,
  IChoiceServiceUpdate,
} from './interfaces/choice-service.interface';

@Injectable()
export class ChoicesService {
  constructor(
    @InjectRepository(Choice)
    private readonly choicesRepository: Repository<Choice>,
    private readonly surveysService: SurveysService,
    private readonly questionService: QuestionsService,
  ) {}

  async createChoice({
    createChoiceInput,
  }: IChoiceServiceCreate): Promise<Choice> {
    const { surveyId, questionId, choiceContent, choiceScore } =
      createChoiceInput;
    const survey = await this.surveysService.findOneSurveyById({ surveyId });
    const question = await this.questionService.findOneQuestionById({
      surveyId,
      questionId,
    });
    return this.choicesRepository.save({
      survey,
      question,
      choiceContent,
      choiceScore,
    });
  }

  async updateChoice({
    updateChoiceInput,
  }: IChoiceServiceUpdate): Promise<Choice> {
    const { surveyId, questionId, ...updateInput } = updateChoiceInput;
    const survey = await this.surveysService.findOneSurveyById({ surveyId });
    const question = await this.questionService.findOneQuestionById({
      surveyId,
      questionId,
    });
    const choice = await this.findOneChoiceById({
      surveyId,
      questionId,
      choiceId: updateChoiceInput.choiceId,
    });

    return this.choicesRepository.save({
      survey,
      question,
      ...choice,
      ...updateInput,
    });
  }

  async findOneChoiceById({ surveyId, questionId, choiceId }) {
    const choice = await this.choicesRepository.findOne({
      where: { survey: { surveyId }, question: { questionId }, choiceId },
    });
    if (!choice) {
      throw new NotFoundException('해당 선택지가 존재하지 않습니다.');
    }

    return choice;
  }
}
