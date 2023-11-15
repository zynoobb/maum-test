import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from './entites/survey.entity';
import { ISurveysServiceCreate } from './interfaces/survey-service.interface';

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
    const survey = await this.fetchSurvey({ subject });

    if (survey) throw new ConflictException('이미 존재하는 주제입니다.');

    return this.surveysRepository.save({
      subject,
      description,
    });
  }

  async fetchSurvey({ subject }: { subject: string }) {
    return this.surveysRepository.findOne({
      where: { subject },
    });
  }
}
