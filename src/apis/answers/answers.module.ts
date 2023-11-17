import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChoicesService } from '../choices/choices.service';
import { Choice } from '../choices/entites/choice.entity';
import { Question } from '../questions/entites/question.entity';
import { QuestionsService } from '../questions/questions.service';
import { Survey } from '../surveys/entites/survey.entity';
import { SurveysService } from '../surveys/surveys.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AnswersResolver } from './answers.resolver';
import { AnswersService } from './answers.service';
import { Answer } from './entites/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, User, Survey, Question, Choice])],
  providers: [
    AnswersResolver,
    AnswersService,
    UsersService,
    SurveysService,
    QuestionsService,
    ChoicesService,
  ],
})
export class AnswersModule {}
