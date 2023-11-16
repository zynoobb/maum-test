import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from '../surveys/entites/survey.entity';
import { SurveysService } from '../surveys/surveys.service';
import { Question } from './entites/question.entity';
import { QuestionsResolver } from './questions.resolver';
import { QuestionsService } from './questions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Survey])],
  providers: [QuestionsResolver, QuestionsService, SurveysService],
})
export class QuestionsModule {}
