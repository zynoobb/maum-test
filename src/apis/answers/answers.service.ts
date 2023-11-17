import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChoicesService } from '../choices/choices.service';
import { UsersService } from '../users/users.service';
import { Answer } from './entites/answer.entity';
import {
  IAnswerServiceCreate,
  IAnswerServiceFetch,
} from './interfaces/answer-service.interface';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private readonly answersRepository: Repository<Answer>,
    private readonly usersService: UsersService,
    private readonly choicesService: ChoicesService,
  ) {}

  async createAnswer({
    createAnswerInput,
  }: IAnswerServiceCreate): Promise<Answer> {
    const { surveyId, questionId, choiceId, userId } = createAnswerInput;

    const choice = await this.choicesService.findOneChoiceById({
      fetchChoiceInput: {
        surveyId,
        questionId,
        choiceId,
      },
    });
    const user = await this.usersService.fetchUser({
      fetchUserInput: { userId },
    });

    const answer = await this.findOneAnswerById({
      fetchAnswerInput: createAnswerInput,
    });

    if (answer) {
      throw new ConflictException('이미 응답한 답변입니다.');
    }

    const result = await this.answersRepository.save({
      survey: { surveyId },
      question: { questionId },
      choice,
      user,
      totalScore: choice.choiceScore,
    });

    return result;
  }

  async findOneAnswerById({
    fetchAnswerInput,
  }: IAnswerServiceFetch): Promise<Answer> {
    const { surveyId, questionId, choiceId, userId } = fetchAnswerInput;
    const answer = await this.answersRepository.findOne({
      where: {
        survey: { surveyId },
        question: { questionId },
        choice: { choiceId },
        user: { userId },
      },
    });
    return answer;
  }
}
