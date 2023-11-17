import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../questions/entites/question.entity';
import { QuestionsService } from '../questions/questions.service';
import { Survey } from '../surveys/entites/survey.entity';
import { SurveysService } from '../surveys/surveys.service';
import { ChoicesResolver } from './choices.resolver';
import { ChoicesService } from './choices.service';
import { Choice } from './entites/choice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Choice, Survey, Question])],
  providers: [
    ChoicesResolver,
    ChoicesService,
    SurveysService,
    QuestionsService,
  ],
  exports: [ChoicesService],
})
export class ChoicesModule {}
