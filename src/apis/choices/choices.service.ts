import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { QuestionsService } from '../questions/questions.service';
import { SurveysService } from '../surveys/surveys.service';
import { Choice } from './entites/choice.entity';
import {
  IChoiceServiceCreate,
  IChoiceServiceDelete,
  IChoiceServiceFetch,
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
      surveyId,
      questionId,
    });
    return this.choicesRepository.save({
      survey,
      question,
      choiceContent,
      choiceScore,
      answers: [],
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
      fetchChoiceInput: {
        surveyId,
        questionId,
        choiceId: updateChoiceInput.choiceId,
      },
    });

    return this.choicesRepository.save({
      survey,
      question,
      ...choice,
      ...updateInput,
    });
  }

  async deleteChoice({
    deleteChoiceInput,
  }: IChoiceServiceDelete): Promise<boolean> {
    const { surveyId, questionId, choiceId } = deleteChoiceInput;
    await this.surveysService.findOneSurveyById({
      surveyId,
    });
    await this.questionService.findOneQuestionById({
      surveyId,
      questionId,
    });
    await this.findOneChoiceById({
      fetchChoiceInput: deleteChoiceInput,
    });

    const deleteResult = await this.choicesRepository.delete({
      survey: { surveyId },
      question: { questionId },
      choiceId,
    });

    return deleteResult.affected ? true : false;
  }

  async findOneChoiceById({
    fetchChoiceInput,
  }: IChoiceServiceFetch): Promise<Choice> {
    const { surveyId, questionId, choiceId } = fetchChoiceInput;
    const choice = await this.choicesRepository.findOne({
      relations: ['survey', 'question', 'answers'],
      where: { survey: { surveyId }, question: { questionId }, choiceId },
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
