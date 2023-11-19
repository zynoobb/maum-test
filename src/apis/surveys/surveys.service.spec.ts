import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { validateSync } from 'class-validator';
import { DeleteResult, Repository } from 'typeorm';
import { CreateSurveyInput } from './dto/create-survey.dto';
import { UpdateSurveyInput } from './dto/update-survey.dto';
import { Survey } from './entites/survey.entity';
import { SurveysService } from './surveys.service';

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
});

describe('SurveysService', () => {
  let service: SurveysService;
  let repository: Repository<Survey>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveysService,
        {
          provide: getRepositoryToken(Survey),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SurveysService>(SurveysService);
    repository = module.get<Repository<Survey>>(getRepositoryToken(Survey));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchSurvey', () => {
    it('설문지ID가 존재하는 경우 Survey 데이터를 반환해야 함.', async () => {
      const surveyId = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(survey);
      const data = await service.fetchSurvey({ surveyId });
      expect(repository.findOne).toBeCalled();
      expect(data).toEqual(survey);
    });

    it('설문지ID가 존재하지 않는 경우 NotFoundExcept 에러를 반환해야 함.', async () => {
      const nonExist = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      expect(service.fetchSurvey({ surveyId: nonExist })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('fetchAllSurveys', () => {
    it('모든 설문 데이터를 조회해야 함.', async () => {
      const mockSurveys: Survey[] = [
        {
          surveyId: 1,
          subject: 'subject1',
          description: 'description1',
          createdAt: new Date(),
          updatedAt: new Date(),
          questions: [],
          choices: [],
          answers: [],
        },
        {
          surveyId: 2,
          subject: 'subject1',
          description: 'description2',
          createdAt: new Date(),
          updatedAt: new Date(),
          questions: [],
          choices: [],
          answers: [],
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(mockSurveys);
      const data = await service.fetchAllSurveys();
      await expect(data).toEqual(mockSurveys);
    });
  });

  describe('findOneSurveyById', () => {
    it('설문지ID가 존재하는 경우 Survey 데이터를 반환해야 함.', async () => {
      const surveyId = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(survey);
      const data = await service.findOneSurveyById({ surveyId });
      expect(data).toEqual(survey);
    });

    it('설문지ID가 존재하지 않는 경우 NotFoundExcept 에러를 반환해야 함.', async () => {
      const nonExist = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      expect(service.findOneSurveyById({ surveyId: nonExist })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneSurveyBySubject', () => {
    it('설문지 주제가 존재하는 경우 Conflict 에러를 반환해야 함.', async () => {
      const subject = 'subject';
      jest.spyOn(repository, 'findOne').mockResolvedValue(survey);
      await expect(service.findOneSurveyBySubject({ subject })).rejects.toThrow(
        ConflictException,
      );
    });

    it('설문지 주제가 존재하지 않는 경우 반환값 없음.', async () => {
      const subject = 'subject';
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(
        service.findOneSurveyBySubject({ subject }),
      ).resolves.toBeUndefined();
    });
  });

  describe('createSurvey', () => {
    it('문자열인 subject는 유효성 검사를 통과해야 함.', async () => {
      // subject은 양측 공백을 불용하며 길이가 1~100 이어야 함.
      const createSurveyInput = new CreateSurveyInput();
      createSurveyInput.subject = 'pass';
      let errors = validateSync(createSurveyInput);
      expect(errors.length).toBe(0);

      createSurveyInput.subject = 'a'.repeat(100);
      errors = validateSync(createSurveyInput);
      expect(errors.length).toBe(0);

      createSurveyInput.subject = ' ';
      errors = validateSync(createSurveyInput);
      expect(errors.length).toBeGreaterThan(0);

      createSurveyInput.subject = ' aa ';
      errors = validateSync(createSurveyInput);
      expect(errors.length).toBeGreaterThan(0);

      createSurveyInput.subject = 'a'.repeat(101);
      errors = validateSync(createSurveyInput);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('문자열인 description은 유효성 검사를 통과해야 함.', async () => {
      // description 양측 공백을 불용하며 nullable하며 길이가 1~500 이어야 함.
      const createSurveyInput = new CreateSurveyInput();
      createSurveyInput.subject = 'passSubject';
      createSurveyInput.description = 'pass';
      let errors = validateSync(createSurveyInput);
      expect(errors.length).toBe(0);

      createSurveyInput.description = null;
      errors = validateSync(createSurveyInput);
      expect(errors.length).toBe(0);

      createSurveyInput.description = 'a'.repeat(500);
      errors = validateSync(createSurveyInput);
      expect(errors.length).toBe(0);

      createSurveyInput.description = ' ';
      errors = validateSync(createSurveyInput);
      expect(errors.length).toBeGreaterThan(0);

      createSurveyInput.description = ' aa ';
      errors = validateSync(createSurveyInput);
      expect(errors.length).toBeGreaterThan(0);

      createSurveyInput.description = 'a'.repeat(501);
      errors = validateSync(createSurveyInput);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('정상적인 데이터인 경우 정상적으로 저장되어야 함.', async () => {
      const createSurveyInput: CreateSurveyInput = {
        subject: 'subject',
        description: 'description',
      };

      jest.spyOn(service, 'findOneSurveyBySubject').mockResolvedValueOnce(null);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValueOnce(createSurveyInput as Survey);

      const data = await service.createSurvey({ createSurveyInput });
      expect(service.findOneSurveyBySubject).toHaveBeenCalledWith({
        subject: createSurveyInput.subject,
      });

      expect(repository.save).toHaveBeenCalledWith(createSurveyInput);
      expect(data).toEqual(createSurveyInput);
    });
  });

  describe('updateSurvey', () => {
    it('정상 데이터가 입력된 경우 정상적으로 수정되어야 함.', async () => {
      const updateSurveyInput: UpdateSurveyInput = {
        surveyId: 1,
        subject: 'subject',
        description: 'description',
      };

      const mockSurveyRepository: Repository<Survey> = {
        findOne: jest.spyOn(repository, 'findOne').mockResolvedValue(survey),
        save: jest
          .spyOn(repository, 'save')
          .mockResolvedValue({ ...survey, ...updateSurveyInput }),
      } as any;

      const service = new SurveysService(mockSurveyRepository);

      // 전역으로 선언된 mockRepository의 save 로직이
      // update이 save 메서드로 동일하게 사용되므로 아래 로직 사용 불가
      // jest.spyOn(service, 'findOneSurveyById').mockResolvedValue(exist);
      // jest.spyOn(repository, 'findOne').mockResolvedValue(exist);
      // jest
      //   .spyOn(repository, 'save')
      //   .mockResolvedValue(updateSurveyInput as Survey);

      const data = await service.updateSurvey({ updateSurveyInput });
      expect(repository.save).toHaveBeenCalledWith({
        ...survey,
        ...updateSurveyInput,
      });
      expect(data).toEqual({ ...survey, ...updateSurveyInput });
    });
  });

  describe('deleteSurvey', () => {
    it('설문지 삭제 시 true를 반환해야 함.', async () => {
      const surveyId = 1;
      const deleteResult = { affected: 1 } as DeleteResult;

      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);
      const data = await service.deleteSurvey({ surveyId });
      expect(repository.delete).toHaveBeenCalledWith({ surveyId });
      expect(data).toBe(true);
    });
    it('설문지 미 삭제 시 false를 반환해야 함.', async () => {
      const surveyId = 1;
      const deleteResult = { affected: 0 } as DeleteResult;

      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);
      const data = await service.deleteSurvey({ surveyId });
      expect(repository.delete).toHaveBeenCalledWith({ surveyId });
      expect(data).toBe(false);
    });
  });
});
