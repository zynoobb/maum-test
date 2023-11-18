import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { QuestionsService } from '../questions/questions.service';
import { SurveysService } from '../surveys/surveys.service';
import { Choice } from './entites/choice.entity';
import {
  IChoiceServiceCreate,
  IChoiceServiceFetchInRange,
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
      questionId,
    });
    return this.choicesRepository.save({
      survey,
      question,
      choiceContent,
      choiceScore,
    });
  }

  async fetchChoice({ choiceId }: { choiceId: number }): Promise<Choice> {
    const choice = await this.findOneChoiceById({ choiceId });

    return choice;
  }

  async updateChoice({
    updateChoiceInput,
  }: IChoiceServiceUpdate): Promise<Choice> {
    const { choiceId, ...updateInput } = updateChoiceInput;
    const choice = await this.findOneChoiceById({
      choiceId,
    });

    return this.choicesRepository.save({
      ...choice,
      ...updateInput,
    });
  }

  async deleteChoice({ choiceId }: { choiceId }): Promise<boolean> {
    const deleteResult = await this.choicesRepository.delete({
      choiceId,
    });

    return deleteResult.affected ? true : false;
  }

  async findOneChoiceById({ choiceId }: { choiceId: number }): Promise<Choice> {
    const choice = await this.choicesRepository.findOne({
      relations: ['survey', 'question', 'answers'],
      where: { choiceId },
      order: { choiceId: 'ASC' },
    });
    if (!choice) {
      throw new NotFoundException('해당 선택지가 존재하지 않습니다.');
    }
    return choice;
  }

  async fetchChoicesInRange({
    fetchChoicesInRangeInput,
  }: IChoiceServiceFetchInRange): Promise<Choice[]> {
    const { surveyId, questionId, startChoiceId, endChoiceId } =
      fetchChoicesInRangeInput;

    const choices = await this.choicesRepository.find({
      relations: ['survey', 'question', 'answers'],
      where: {
        survey: { surveyId },
        question: { questionId },
        choiceId: Between(startChoiceId, endChoiceId),
      },
      order: { choiceId: 'ASC' },
    });

    return choices;
  }
}
