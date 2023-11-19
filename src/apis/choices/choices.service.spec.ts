import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { validateSync } from 'class-validator';
import { DeleteResult, Repository } from 'typeorm';
import { QuestionsService } from '../questions/questions.service';
import { SurveysService } from '../surveys/surveys.service';
import { ChoicesService } from './choices.service';
import { CreateChoiceInput } from './dto/create-choice.dto';
import { FetchChoicesInRangeInput } from './dto/fetch-choices-inrange.dto';
import { UpdateChoiceInput } from './dto/update-choice.dto';
import { Choice } from './entites/choice.entity';
import {
  survey,
  question,
  choice,
  mockSurveysService,
  mockQuestionsService,
} from '../../common/test/test.config';

const mockRepository = () => ({
  save: jest.fn((x) => choice),
  findOne: jest.fn((x) => choice),
  find: jest.fn(() => [choice]),
  update: jest.fn((x) => choice),
  delete: jest.fn((x) => () => {
    return {
      raw: undefined,
      affected: 1,
    } as DeleteResult;
  }),
});

describe('ChoicesService', () => {
  let service: ChoicesService;
  let repository: Repository<Choice>;
  let surveysService: SurveysService;
  let questionsService: QuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChoicesService,
        {
          provide: getRepositoryToken(Choice),
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
      ],
    }).compile();
    service = module.get<ChoicesService>(ChoicesService);
    repository = module.get<Repository<Choice>>(getRepositoryToken(Choice));
    surveysService = module.get<SurveysService>(SurveysService);
    questionsService = module.get<QuestionsService>(QuestionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchChoice', () => {
    it('선택지ID가 존재하는 경우 Choice 데이터를 반환해야 함.', async () => {
      const choiceId = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(choice);
      const data = await service.fetchChoice({ choiceId });
      expect(repository.findOne).toBeCalled();
      expect(data).toEqual(choice);
    });

    it('선택지ID가 존재하지 않는 경우 NotFound 에러를 반환해야 함.', async () => {
      const nonExist = 999;
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      expect(service.fetchChoice({ choiceId: nonExist })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneChoiceById', () => {
    it('선택지ID가 존재하는 경우 Choice 데이터를 반환해야 함.', async () => {
      const choiceId = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(choice);
      const data = await service.findOneChoiceById({ choiceId });
      expect(repository.findOne).toBeCalled();
      expect(data).toEqual(choice);
    });

    it('선택지ID가 존재하지 않는 경우 NotFoundExcept 에러를 반환해야 함.', async () => {
      const nonExist = 999;
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(
        service.findOneChoiceById({ choiceId: nonExist }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('fetchChoicesInRange', () => {
    it('설문지ID, 문항ID와 일치해야 하며, 주어진 범위에 맞게 선택지들을 반환해야 함.', async () => {
      const mockChoices: Choice[] = [
        {
          choiceId: 1,
          choiceContent: 'choiceContent1',
          choiceScore: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          survey,
          question,
          answers: [],
        },
        {
          choiceId: 1,
          choiceContent: 'choiceContent2',
          choiceScore: 150,
          createdAt: new Date(),
          updatedAt: new Date(),
          survey,
          question,
          answers: [],
        },
      ];

      const fetchChoicesInRangeInput: FetchChoicesInRangeInput = {
        surveyId: 1,
        questionId: 1,
        startChoiceId: 1,
        endChoiceId: 2,
      };

      jest.spyOn(repository, 'find').mockResolvedValue(mockChoices);
      const data = await service.fetchChoicesInRange({
        fetchChoicesInRangeInput,
      });

      expect(repository.find).toBeCalled();
      expect(data).toEqual(mockChoices);
    });
  });

  describe('createChoice', () => {
    it('문자열인 choiceContent는 유효성 검사를 통과해야 함.', async () => {
      // choiceContent는 양측 공백을 불용하며 길이가 1~300 이어야 함.
      const createChoiceInput = new CreateChoiceInput();
      createChoiceInput.surveyId = 1;
      createChoiceInput.questionId = 1;
      createChoiceInput.choiceScore = 100;
      createChoiceInput.choiceContent = 'pass';

      let errors = validateSync(createChoiceInput);
      expect(errors.length).toBe(0);

      createChoiceInput.choiceContent = 'a'.repeat(300);
      errors = validateSync(createChoiceInput);
      expect(errors.length).toBe(0);

      createChoiceInput.choiceContent = ' ';
      errors = validateSync(createChoiceInput);
      expect(errors.length).toBeGreaterThan(0);

      createChoiceInput.choiceContent = ' aa ';
      errors = validateSync(createChoiceInput);
      expect(errors.length).toBeGreaterThan(0);

      createChoiceInput.choiceContent = 'a'.repeat(301);
      errors = validateSync(createChoiceInput);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('설문지ID와 문항ID가 존재하는 경우 선택지가 정상적으로 저장되어야 함.', async () => {
      const createChoiceInput: CreateChoiceInput = {
        surveyId: 1,
        questionId: 1,
        choiceContent: 'choiceContent',
        choiceScore: 100,
      };

      jest.spyOn(surveysService, 'findOneSurveyById').mockResolvedValue(survey);
      jest
        .spyOn(questionsService, 'findOneQuestionById')
        .mockResolvedValue(question);

      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(createChoiceInput as unknown as Choice);

      const data = await service.createChoice({ createChoiceInput });
      expect(data).toEqual(createChoiceInput);
    });
  });

  describe('updateChoice', () => {
    it('정상 데이터가 입력된 경우 정상적으로 수정되어야 함.', async () => {
      const updateChoiceInput: UpdateChoiceInput = {
        choiceId: 1,
        choiceContent: 'new choiceContent',
        choiceScore: 200,
      };

      const mockChoiceRepository: Repository<Choice> = {
        findOne: jest.spyOn(repository, 'findOne').mockResolvedValue(choice),
        save: jest
          .spyOn(repository, 'save')
          .mockResolvedValue({ ...choice, ...updateChoiceInput }),
      } as any;

      const service = new ChoicesService(
        mockChoiceRepository,
        surveysService,
        questionsService,
      );
      const data = await service.updateChoice({ updateChoiceInput });
      expect(repository.save).toHaveBeenCalledWith({
        ...choice,
        ...updateChoiceInput,
      });
      expect(data).toEqual({ ...choice, ...updateChoiceInput });
    });
  });

  describe('deleteChoice', () => {
    it('선택지 삭제 시 true 반환해야 함.', async () => {
      const choiceId = 1;
      const deleteResult = { affected: 1 } as DeleteResult;

      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);
      const data = await service.deleteChoice({ choiceId });
      expect(repository.delete).toHaveBeenCalledWith({ choiceId });
      expect(data).toBe(true);
    });

    it('선택지 미 삭제 시 false를 반환해야 함.', async () => {
      const choiceId = 1;
      const deleteResult = { affected: 0 } as DeleteResult;

      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);
      const data = await service.deleteChoice({ choiceId });
      expect(repository.delete).toHaveBeenCalledWith({ choiceId });
      expect(data).toBe(false);
    });
  });
});
