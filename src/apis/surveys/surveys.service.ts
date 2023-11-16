import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from './entites/survey.entity';
import {
  ISurveyServiceUpdate,
  ISurveysServiceCreate,
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
    const survey = await this.findOneSurveyBySubject({ subject });

    if (survey) throw new ConflictException('이미 존재하는 주제입니다.');

    return this.surveysRepository.save({
      subject,
      description,
    });
  }

  async updateSurvey({
    surveyId,
    updateSurveyInput,
  }: ISurveyServiceUpdate): Promise<Survey> {
    const survey = await this.findOneSurveyById({ surveyId });
    if (!survey)
      throw new NotFoundException('해당 설문지가 존재하지 않습니다.');
    return this.surveysRepository.save({
      surveyId,
      ...survey,
      ...updateSurveyInput,
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
    return this.surveysRepository.findOne({
      where: { subject },
    });
  }

  async findOneSurveyById({ surveyId }: { surveyId: number }): Promise<Survey> {
    return this.surveysRepository.findOne({
      where: { surveyId },
    });
  }
}
