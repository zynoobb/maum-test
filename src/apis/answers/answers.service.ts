import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChoicesService } from '../choices/choices.service';
import { QuestionsService } from '../questions/questions.service';
import { UsersService } from '../users/users.service';
import { AnswersAndResult } from './dto/fetch-answers-result.dto';
import { Answer } from './entites/answer.entity';
import {
  IAnswerServiceCreate,
  IAnswerServiceFetchAnswerResult,
  IAnswerServiceFindOnePreAnswer,
  IAnswerServiceUpdate,
} from './interfaces/answer-service.interface';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private readonly answersRepository: Repository<Answer>,
    private readonly usersService: UsersService,
    private readonly questionsService: QuestionsService,
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
    } else if (
      choice.survey.surveyId !== surveyId ||
      choice.question.questionId !== questionId
    ) {
      throw new BadRequestException('올바르지 않은 데이터입니다.');
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

  async fetchAnswers(): Promise<Answer[]> {
    return this.answersRepository.find({
      relations: ['survey', 'question', 'choice', 'user'],
      order: {
        user: {
          userId: 'ASC',
        },
        survey: {
          surveyId: 'ASC',
        },
        question: {
          questionId: 'ASC',
        },
        choice: {
          choiceId: 'ASC',
        },
      },
    });
  }

  async fetchAnswersResult({
    fetchAnswersResultInput,
  }: IAnswerServiceFetchAnswerResult): Promise<[AnswersAndResult]> {
    const { surveyId, userId } = fetchAnswersResultInput;
    // 해당 surveyId에 맞는 문항 갯수 구하기
    const questionsCountBySurveyId =
      await this.questionsService.getQuestionsCountBySurveyId({ surveyId });

    if (!questionsCountBySurveyId) {
      throw new NotFoundException(
        '존재하는 설문지가 없거나, 문항이 존재하지 않는 설문지입니다.',
      );
    }

    // userId, surveyId에 맞는 문항 갯수와 선택지에 따른 점수의 합 구하기
    const { totalScore, questionsCountByUserId } = await this.answersRepository
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.choice', 'choice')
      .select('SUM(choice.choiceScore)', 'totalScore')
      .addSelect('COUNT(choice.questionId)', 'questionsCountByUserId')
      .where('answer.survey.surveyId = :surveyId', { surveyId })
      .andWhere('answer.user.userId = :userId', { userId })
      .getRawOne();

    // 응답하지 않은 문항이 존재하는 경우 오류 반환
    if (questionsCountBySurveyId !== Number(questionsCountByUserId)) {
      throw new BadRequestException('응답하지 않은 문항이 존재합니다.');
    }

    const answersBySurveyIdAndUserId = await this.answersRepository.find({
      relations: ['survey', 'question', 'choice', 'user'],
      where: { survey: { surveyId }, user: { userId } },
      order: { question: { questionId: 'ASC' } },
    });

    return [
      { answers: answersBySurveyIdAndUserId, totalScore: Number(totalScore) },
    ];
  }

  async updateAnswer({
    updateAnswerInput,
  }: IAnswerServiceUpdate): Promise<Answer> {
    const { answerId, choiceId } = updateAnswerInput;

    const answer = await this.findOneAnswerById({ answerId });
    if (!answerId) {
      throw new NotFoundException('수정할 수 있는 답변이 존재하지 않습니다.');
    }
    const choice = await this.choicesService.findOneChoiceById({ choiceId });

    if (
      choice.question.questionId !== answer.question.questionId ||
      choice.survey.surveyId !== answer.survey.surveyId
    ) {
      throw new BadRequestException('올바르지 않은 데이터입니다.');
    }
    return this.answersRepository.save({
      ...answer,
      choice,
    });
  }

  async deleteAnswer({ answerId }: { answerId: number }): Promise<boolean> {
    const deleteResult = await this.answersRepository.delete({
      answerId,
    });
    return deleteResult.affected ? true : false;
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
