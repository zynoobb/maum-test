import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChoicesService } from '../choices/choices.service';
import { UsersService } from '../users/users.service';
import { Answer } from './entites/answer.entity';
import {
  IAnswerServiceCreate,
  IAnswerServiceFindOnePreAnswer,
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
      choiceId,
    });
    const user = await this.usersService.fetchUser({
      userId,
    });
    const answer = await this.findOnePreAnswerById({
      findPreAnswerInput: { surveyId, questionId, userId },
    });

    if (answer) {
      throw new ConflictException('이미 응답한 답변입니다.');
    }

    return this.answersRepository.save({
      survey: { surveyId },
      question: { questionId },
      choice,
      user,
    });
  }

  async fetchAnswer({ answerId }: { answerId: number }): Promise<Answer> {
    const answer = await this.findOneAnswerById({ answerId });
    if (!answer) {
      throw new NotFoundException('존재하는 답변이 없습니다.');
    }
    return answer;
  }

  async findOneAnswerById({ answerId }: { answerId: number }): Promise<Answer> {
    const answer = await this.answersRepository.findOne({
      relations: ['survey', 'question', 'choice', 'user'],
      where: { answerId },
    });

    return answer;
  }

  async findOnePreAnswerById({
    findPreAnswerInput,
  }: IAnswerServiceFindOnePreAnswer): Promise<Answer> {
    const { surveyId, questionId, userId } = findPreAnswerInput;
    const preAnswer = await this.answersRepository.findOne({
      where: {
        survey: { surveyId },
        question: { questionId },
        user: { userId },
      },
    });
    return preAnswer;
  }
}
