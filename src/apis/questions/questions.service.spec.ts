import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { validateSync } from 'class-validator';
import { DeleteResult, Repository } from 'typeorm';
import { Survey } from '../surveys/entites/survey.entity';
import { SurveysService } from '../surveys/surveys.service';
import { CreateQuestionInput } from './dto/create-question.dto';
import { FetchQuestionsInRangeInput } from './dto/fetch-questions-inrange.dto';
import { UpdateQuestionInput } from './dto/update-question.dto';
import { Question } from './entites/question.entity';
import { QuestionsService } from './questions.service';

const survey: Survey = {
  surveyId: 1,
  subject: 'subject',
  description: 'description',
  createdAt: new Date(),
  updatedAt: new Date(),
  questions: [],
  choices: [],
  answers: [],
};

const question: Question = {
  questionId: 1,
  content: 'content',
  createdAt: new Date(),
  updatedAt: new Date(),
  survey,
  choices: [],
  answers: [],
};

const mockRepository = () => ({
  save: jest.fn((x) => survey),
  findOne: jest.fn((x) => survey),
  find: jest.fn(() => [survey]),
  update: jest.fn((x) => survey),
  delete: jest.fn((x) => () => {
    return {
      raw: undefined,
      affected: 1,
    } as DeleteResult;
  }),
  count: jest.fn((x) => Number),
});

const mockSurveysService = () => ({
  findOneSurveyById: jest.fn(() => survey),
});

describe('QuestionsService', () => {
  let service: QuestionsService;
  let repository: Repository<Question>;
  let surveysService: SurveysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: getRepositoryToken(Question),
          useFactory: mockRepository,
        },
        {
          provide: SurveysService,
          useFactory: mockSurveysService,
        },
      ],
    }).compile();
    service = module.get<QuestionsService>(QuestionsService);
    repository = module.get<Repository<Question>>(getRepositoryToken(Question));
    surveysService = module.get<SurveysService>(SurveysService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchQuestion', () => {
    it('문항ID가 존재하는 경우 Question 데이터를 반환해야 함', async () => {
      const questionId = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(question);
      const data = await service.fetchQuestion({ questionId });
      expect(repository.findOne).toBeCalled();
      expect(data).toEqual(question);
    });

    it('문항ID가 존재하지 않는 경우 NotFoundExcept 에러를 반환해야 함.', async () => {
      const nonExist = 999;
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      expect(service.fetchQuestion({ questionId: nonExist })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneQuestionById', () => {
    it('문항ID가 존재하는 경우 Question 데이터를 반환해야 함.', async () => {
      const questionId = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(question);
      const data = await service.findOneQuestionById({ questionId });
      expect(repository.findOne).toBeCalled();
      expect(data).toEqual(question);
    });

    it('문항ID가 존재하지 않는 경우 NotFound 에러 반환해야 함.', async () => {
      const nonExist = 999;
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      expect(
        service.findOneQuestionById({ questionId: nonExist }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getQuestionsCountBySurveyId', () => {
    it('설문지ID에 속한 문항들의 갯수를 반환해야 함.', async () => {
      const surveyId = 1;
      jest.spyOn(repository, 'count').mockResolvedValue(2);
      const data = await service.getQuestionsCountBySurveyId({ surveyId });
      expect(repository.count).toBeCalled();
      expect(data).toBe(2);
    });
  });

  describe('fetchQuestionInRange', () => {
    it('설문지ID와 일치해야 하며, 주어진 범위에 맞게 문항들을 반환해야 함.', async () => {
      const mockQuestions: Question[] = [
        {
          questionId: 1,
          content: 'content1',
          createdAt: new Date(),
          updatedAt: new Date(),
          survey,
          choices: [],
          answers: [],
        },
        {
          questionId: 2,
          content: 'content2',
          createdAt: new Date(),
          updatedAt: new Date(),
          survey,
          choices: [],
          answers: [],
        },
      ];
      const fetchQuestionsInRangeInput: FetchQuestionsInRangeInput = {
        surveyId: 1,
        startQuestionId: 1,
        endQuestionId: 2,
      };
      jest.spyOn(surveysService, 'findOneSurveyById').mockResolvedValue(survey);
      jest.spyOn(repository, 'find').mockResolvedValue(mockQuestions);
      const data = await service.fetchQuestionsInRange({
        fetchQuestionsInRangeInput,
      });

      expect(repository.find).toBeCalled();
      expect(data).toEqual(mockQuestions);
    });
  });

  describe('createQuestion', () => {
    it('문자열인 content는 유효성 검사를 통과해야 함.', async () => {
      // content는 양측 공백을 불용하며 길이가 1~300 이어야 함.
      const createQuestionInput = new CreateQuestionInput();
      createQuestionInput.surveyId = 1;
      createQuestionInput.content = 'pass';
      let errors = validateSync(createQuestionInput);
      expect(errors.length).toBe(0);

      createQuestionInput.content = 'a'.repeat(300);
      errors = validateSync(createQuestionInput);
      expect(errors.length).toBe(0);

      createQuestionInput.content = ' ';
      errors = validateSync(createQuestionInput);
      expect(errors.length).toBeGreaterThan(0);

      createQuestionInput.content = ' aa ';
      errors = validateSync(createQuestionInput);
      expect(errors.length).toBeGreaterThan(0);

      createQuestionInput.content = 'a'.repeat(301);
      errors = validateSync(createQuestionInput);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('존재하는 설문지ID인 경우 문항이 정상적으로 저장되어야 함.', async () => {
      const createQuestionInput: CreateQuestionInput = {
        surveyId: 1,
        content: 'content',
      };

      jest.spyOn(surveysService, 'findOneSurveyById').mockResolvedValue(survey);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(createQuestionInput as unknown as Question);

      const data = await service.createQuestion({ createQuestionInput });
      expect(data).toEqual(createQuestionInput);
    });
  });

  describe('updateQuestion', () => {
    it('정상 데이터가 입력된 경우 정상적으로 수정되어야 함.', async () => {
      const updateQuestionInput: UpdateQuestionInput = {
        questionId: 1,
        content: 'new content',
      };

      const mockQuestionRepository: Repository<Question> = {
        findOne: jest.spyOn(repository, 'findOne').mockResolvedValue(question),
        save: jest
          .spyOn(repository, 'save')
          .mockResolvedValue({ ...question, ...updateQuestionInput }),
      } as any;

      const service = new QuestionsService(
        mockQuestionRepository,
        surveysService,
      );

      const data = await service.updateQuestion({ updateQuestionInput });
      expect(repository.save).toHaveBeenCalledWith({
        ...question,
        ...updateQuestionInput,
      });
      expect(data).toEqual({ ...question, ...updateQuestionInput });
    });
  });

  describe('deleteQuestion', () => {
    it('문항 삭제 시 true를 반환해야 함.', async () => {
      const questionId = 1;
      const deleteResult = { affected: 1 } as DeleteResult;

      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);
      const data = await service.deleteQuestion({ questionId });
      expect(repository.delete).toHaveBeenCalledWith({ questionId });
      expect(data).toBe(true);
    });

    it('문항 미 삭제 시 false를 반환해야 함.', async () => {
      const questionId = 1;
      const deleteResult = { affected: 0 } as DeleteResult;

      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);
      const data = await service.deleteQuestion({ questionId });
      expect(repository.delete).toHaveBeenCalledWith({ questionId });
      expect(data).toBe(false);
    });
  });
});
