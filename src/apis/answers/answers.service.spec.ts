import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ChoicesService } from '../choices/choices.service';
import { QuestionsService } from '../questions/questions.service';
import { SurveysService } from '../surveys/surveys.service';
import { UsersService } from '../users/users.service';
import { AnswersService } from './answers.service';
import { Answer } from './entites/answer.entity';
import {
  survey,
  question,
  choice,
  answer,
  user,
  mockSurveysService,
  mockQuestionsService,
  mockChoicesService,
  mockUsersService,
} from '../../common/test/test.config';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateAnswerInput } from './dto/create-answer.dto';
import { validateSync } from 'class-validator';
import { UpdateAnswerInput } from './dto/update-answer.dto';

const mockRepository = () => ({
  save: jest.fn((x) => answer),
  findOne: jest.fn((x) => answer),
  find: jest.fn(() => [answer]),
  update: jest.fn((x) => answer),
  delete: jest.fn((x) => () => {
    return {
      raw: undefined,
      affected: 1,
    } as DeleteResult;
  }),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
    find: jest.fn(),
  })),
});

describe('AnswersService', () => {
  let service: AnswersService;
  let repository: Repository<Answer>;
  let surveysService: SurveysService;
  let questionsService: QuestionsService;
  let choicesService: ChoicesService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswersService,
        {
          provide: getRepositoryToken(Answer),
          useFactory: mockRepository,
        },
        {
          provide: SurveysService,
          useFactory: mockSurveysService,
        },
        {
          provide: QuestionsService,
          useFactory: mockQuestionsService,
        },
        {
          provide: ChoicesService,
          useFactory: mockChoicesService,
        },
        {
          provide: UsersService,
          useFactory: mockUsersService,
        },
      ],
    }).compile();
    service = module.get<AnswersService>(AnswersService);
    repository = module.get<Repository<Answer>>(getRepositoryToken(Answer));
    surveysService = module.get<SurveysService>(SurveysService);
    questionsService = module.get<QuestionsService>(QuestionsService);
    choicesService = module.get<ChoicesService>(ChoicesService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAnswer', () => {
    it('답변ID가 존재하는 경우 Answer 데이터를 반환해야 함.', async () => {
      const answerId = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(answer);
      const data = await service.fetchAnswer({ answerId });
      expect(repository.findOne).toBeCalled();
      expect(data).toEqual(answer);
    });

    it('답변ID가 존재하지 않는 경우 NotFound 에러를 반환해야 함.', async () => {
      const nonExist = 999;
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      expect(service.fetchAnswer({ answerId: nonExist })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneAnswerById', () => {
    it('답변ID가 존재하는 경우 Answer 데이터를 반환해야 함.', async () => {
      const answerId = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(answer);
      const data = await service.findOneAnswerById({ answerId });
      expect(repository.findOne).toBeCalled();
      expect(data).toEqual(answer);
    });

    it('답변ID가 존재하지 않는 경우 리턴 값 없음.', async () => {
      const answerId = 999;
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      await expect(
        service.findOneAnswerById({ answerId }),
      ).resolves.toBeUndefined();
    });
  });

  describe('findOnePreAnswerById', () => {
    it('설문지ID, 문항ID, 유저ID와 일치하는 답변 데이터 반환해야 함.', async () => {
      const findPreAnswerInput: {
        surveyId: number;
        questionId: number;
        userId: string;
      } = {
        surveyId: 1,
        questionId: 1,
        userId: 'userId',
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(findPreAnswerInput as unknown as Answer);

      const data = await service.findOnePreAnswerById({
        findPreAnswerInput,
      });
      expect(data).toEqual(findPreAnswerInput);
    });
  });

  describe('fetchAnswers', () => {
    it('모든 답변 데이터를 조회해야 함.', async () => {
      const mockAnswers: Answer[] = [
        {
          answerId: 1,
          survey,
          question,
          choice,
          user,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          answerId: 2,
          survey,
          question,
          choice,
          user,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(mockAnswers);
      const data = await service.fetchAnswers();

      expect(repository.find).toBeCalled();
      expect(data).toEqual(mockAnswers);
    });
  });

  describe('createAnswer', () => {
    it('문자열인 userId는 유효성 검사를 통과해야 함.', async () => {
      // userId는 양측 공백을 불용함.
      const createAnswerInput = new CreateAnswerInput();
      createAnswerInput.surveyId = 1;
      createAnswerInput.questionId = 1;
      createAnswerInput.choiceId = 1;
      createAnswerInput.userId = 'userId';

      let errors = validateSync(createAnswerInput);
      expect(errors.length).toBe(0);

      createAnswerInput.userId = ' ';
      errors = validateSync(createAnswerInput);
      expect(errors.length).toBeGreaterThan(0);

      createAnswerInput.userId = ' aa ';
      errors = validateSync(createAnswerInput);
      expect(errors.length).toBeGreaterThan(0);
    });

    const createAnswerInput: CreateAnswerInput = {
      userId: 'userId',
      surveyId: 1,
      questionId: 1,
      choiceId: 1,
    };
    it('설문지ID, 문항ID, 선택지ID, 사용자ID가 유효한 경우 답변이 정상적으로 저장되어야 함.', async () => {
      jest.spyOn(choicesService, 'findOneChoiceById').mockResolvedValue(choice);
      jest.spyOn(usersService, 'fetchUser').mockResolvedValue(user);
      jest.spyOn(service, 'findOneAnswerById').mockResolvedValue(undefined);
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(createAnswerInput as unknown as Answer);

      const createAnswerSpy = jest.spyOn(service, 'createAnswer');
      const data = await service.createAnswer({ createAnswerInput });
      expect(createAnswerSpy).toBeCalled();
      expect(data).toEqual(createAnswerInput);
    });

    it('이미 중복된 답변이 있는 경우 Conflict 에러를 반환해야 함.', async () => {
      jest.spyOn(choicesService, 'findOneChoiceById').mockResolvedValue(choice);
      jest.spyOn(usersService, 'fetchUser').mockResolvedValue(user);
      jest.spyOn(service, 'findOneAnswerById').mockResolvedValue(answer);
      jest.spyOn(repository, 'findOne').mockResolvedValue(answer);

      await expect(service.createAnswer({ createAnswerInput })).rejects.toThrow(
        ConflictException,
      );
    });

    describe('updateAnswer', () => {
      it('정상 데이터가 입력된 경우 정상적으로 수정되어야 함.', async () => {
        const updateAnswerInput: UpdateAnswerInput = {
          answerId: 1,
          choiceId: 3,
        };

        const mockAnswerRepository: Repository<Answer> = {
          findOne: jest.spyOn(repository, 'findOne').mockResolvedValue(answer),
          save: jest
            .spyOn(repository, 'save')
            .mockResolvedValue({ ...answer, ...updateAnswerInput }),
        } as any;

        const service = new AnswersService(
          mockAnswerRepository,
          usersService,
          questionsService,
          choicesService,
        );
        jest.spyOn(service, 'findOneAnswerById').mockResolvedValue(answer);
        jest
          .spyOn(choicesService, 'findOneChoiceById')
          .mockResolvedValue(choice);

        const data = await service.updateAnswer({ updateAnswerInput });
        expect(repository.save).toHaveBeenCalledWith({
          ...answer,
          choice,
        });
        expect(data).toEqual({ ...answer, ...updateAnswerInput });
      });

      it('답변ID가 유효하지 않은 경우 NotFoundException을 반환해야 함.', async () => {
        const updateAnswerInput: UpdateAnswerInput = {
          answerId: 1,
          choiceId: 3,
        };

        const mockAnswerRepository: Repository<Answer> = {
          findOne: jest.spyOn(repository, 'findOne').mockResolvedValue(answer),
          save: jest
            .spyOn(repository, 'save')
            .mockResolvedValue({ ...answer, ...updateAnswerInput }),
        } as any;

        const service = new AnswersService(
          mockAnswerRepository,
          usersService,
          questionsService,
          choicesService,
        );

        jest.spyOn(service, 'findOneAnswerById').mockImplementation(() => {
          throw new NotFoundException(
            '수정할 수 있는 답변이 존재하지 않습니다.',
          );
        });

        await expect(
          service.updateAnswer({ updateAnswerInput }),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('deleteAnswer', () => {
      it('답변 삭제 시 true 반환해야 함.', async () => {
        const answerId = 1;
        const deleteResult = { affected: 1 } as DeleteResult;

        jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);
        const data = await service.deleteAnswer({ answerId });
        expect(repository.delete).toHaveBeenCalledWith({ answerId });
        expect(data).toBe(true);
      });

      it('답변 미 삭제 시 false를 반환해야 함.', async () => {
        const answerId = 1;
        const deleteResult = { affected: 0 } as DeleteResult;

        jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);
        const data = await service.deleteAnswer({ answerId });
        expect(repository.delete).toHaveBeenCalledWith({ answerId });
        expect(data).toBe(false);
      });
    });
  });

  // fetchAnswersResult
  // describe('fetchAnswersResult', () => {
  //   it('사용자ID와 설문지ID가 일치하는 설문의 결과를 반환해야 함.', async () => {
  //     const fetchAnswersResultInput: FetchAnswersResultInput = {
  //       surveyId: 1,
  //       userId: 'userId',
  //     };

  //     jest
  //       .spyOn(questionsService, 'getQuestionsCountBySurveyId')
  //       .mockResolvedValue(2);

  //     const mockAnswers: Answer[] = [
  //       {
  //         answerId: 1,
  //         survey,
  //         question,
  //         choice,
  //         user,
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //       },
  //       {
  //         answerId: 2,
  //         survey,
  //         question,
  //         choice,
  //         user,
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //       },
  //     ];

  //     const queryBuilderResult = {
  //       totalScore: 100,
  //       answers: 2,
  //     };

  //     const queryBuilder: any = {
  //       leftJoinAndSelect: jest.fn().mockReturnThis(),
  //       select: jest.fn().mockReturnThis(),
  //       addSelect: jest.fn().mockReturnThis(),
  //       where: jest.fn().mockReturnThis(),
  //       andWhere: jest.fn().mockReturnThis(),
  //       getRawOne: jest.fn().mockResolvedValue(queryBuilderResult),
  //     };

  //     jest
  //       .spyOn(repository, 'createQueryBuilder')
  //       .mockReturnValue(queryBuilder);

  //     const data = await service.fetchAnswersResult({
  //       fetchAnswersResultInput,
  //     });
  //     console.log(data);
  //     expect(data).toEqual(queryBuilderResult);
  //   });

  //   // 설문지가 없어 에러를 반환하는 경우 questionsCountBySurveyId
  // });
});
