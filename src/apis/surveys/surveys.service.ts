import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from './entites/survey.entity';
import {
  ISurveysServiceCreate,
  ISurveysServiceUpdate,
} from './interfaces/survey-service.interface';

@Injectable()
export class SurveysService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveysRepository: Repository<Survey>,
  ) {}

  async createSurvey({
    createSurveyInput,
  }: ISurveysServiceCreate): Promise<Survey> {
    const { subject, description } = createSurveyInput;
    await this.findOneSurveyBySubject({ subject });

    return this.surveysRepository.save({
      subject,
      description,
    });
  }

  async updateSurvey({
    updateSurveyInput,
  }: ISurveysServiceUpdate): Promise<Survey> {
    const { surveyId, ...updateInput } = updateSurveyInput;
    const survey = await this.findOneSurveyById({ surveyId });
    return this.surveysRepository.save({
      ...survey,
      ...updateInput,
    });
  }
  async deleteSurvey({ surveyId }: { surveyId: number }): Promise<boolean> {
    const deleteResult = await this.surveysRepository.delete({ surveyId });
    return deleteResult.affected ? true : false;
  }

  async findOneSurveyBySubject({
    subject,
  }: {
    subject: string;
  }): Promise<Survey> {
    const survey = await this.surveysRepository.findOne({
      where: { subject },
    });
    if (survey) throw new ConflictException('이미 존재하는 주제입니다.');
    return survey;
  }

  async fetchSurvey({ surveyId }: { surveyId: number }): Promise<Survey> {
    const survey = await this.surveysRepository.findOne({
      relations: ['questions', 'choices', 'answers'],
      where: { surveyId },
      order: {
        questions: {
          questionId: 'ASC',
        },
        choices: {
          choiceId: 'ASC',
        },
      },
    });

    if (!survey)
      throw new NotFoundException('해당 설문지가 존재하지 않습니다.');
    return survey;
  }

  async fetchAllSurveys(): Promise<Survey[]> {
    const surveys = await this.surveysRepository.find({
      relations: ['questions', 'choices', 'answers'],
      order: {
        surveyId: 'ASC',
        questions: {
          questionId: 'ASC',
        },
        choices: {
          choiceId: 'ASC',
        },
      },
    });
    return surveys;
  }

  async findOneSurveyById({ surveyId }: { surveyId: number }): Promise<Survey> {
    const survey = await this.surveysRepository.findOne({
      relations: ['questions', 'choices', 'answers'],
      where: { surveyId },
    });
    if (!survey)
      throw new NotFoundException('해당 설문지가 존재하지 않습니다.');
    return survey;
  }
}
