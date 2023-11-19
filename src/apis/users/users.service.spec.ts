import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { validate } from 'class-validator';
import { CreateUserInput } from './dto/create-user.dto';

const user: User = {
  userId: 'userId',
  createdAt: new Date(),
  nickname: 'nickname',
  answers: [],
};

const mockRepository = () => ({
  save: jest.fn((id) => user),
  findOne: jest.fn((x) => user),
});

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOneUserByNickName', () => {
    it('닉네임이 존재하지 않는 경우 User 데이터 반환해야 함', async () => {
      const mockRepository: Repository<User> = {
        findOne: jest.fn().mockResolvedValue(null),
      } as any;

      const service = new UsersService(mockRepository);

      const nonExist = 'nonExist';
      const user = await service.findOneUserByNickName({
        nickname: nonExist,
      });

      expect(user).toBeNull();
    });

    it('닉네임이 이미 존재하는 경우 Conflict 에러를 반환해야 함', async () => {
      const exist = 'exist';
      const mockUserRepository: Repository<User> = {
        findOne: jest.fn().mockResolvedValue(exist),
      } as any;

      const service = new UsersService(mockUserRepository);

      await expect(
        service.findOneUserByNickName({ nickname: exist }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('fetchUser', () => {
    it('유저ID가 존재하는 경우 User 데이터 반환해야 함', async () => {
      const exist: User = {
        userId: 'existUser',
        nickname: 'exist',
        answers: [],
        createdAt: new Date(),
      };
      const userId = 'existUser';
      const mockUserRepository: Repository<User> = {
        findOne: jest.fn().mockResolvedValue(exist),
      } as any;

      const service = new UsersService(mockUserRepository);
      const user = await service.fetchUser({ userId });
      expect(user).toEqual(exist);
    });

    it('유저ID가 존재하지 않는 경우 NotFound 에러를 반환해야 함', async () => {
      const mockRepository: Repository<User> = {
        findOne: jest.fn().mockResolvedValue(undefined),
      } as any;

      const service = new UsersService(mockRepository);

      const nonExist = 'nonExist';
      await expect(service.fetchUser({ userId: nonExist })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createUser', () => {
    it('문자열인 닉네임은 유효성 검사를 통과해야 함', async () => {
      const createUserInput = new CreateUserInput();
      createUserInput.nickname = 'pass';
      let errors = await validate(createUserInput);
      expect(errors.length).toBe(0);

      createUserInput.nickname = 'a'.repeat(50);
      errors = await validate(createUserInput);
      expect(errors.length).toBe(0);

      // 공백 불가
      createUserInput.nickname = ' ';
      errors = await validate(createUserInput);
      expect(errors.length).toBeGreaterThan(0);

      // 양쪽 공백 불가
      createUserInput.nickname = ' aa ';
      errors = await validate(createUserInput);
      expect(errors.length).toBeGreaterThan(0);

      // 길이 51이상 불가
      createUserInput.nickname = 'a'.repeat(51);
      errors = await validate(createUserInput);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('정상 닉네임인 경우 정상적으로 저장되어야 함', async () => {
      const createUserInput = { nickname: 'nickname' };
      jest.spyOn(service, 'findOneUserByNickName').mockResolvedValueOnce(null);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValueOnce(createUserInput as User);

      const result = await service.createUser({ createUserInput });
      expect(service.findOneUserByNickName).toHaveBeenCalledWith({
        nickname: createUserInput.nickname,
      });
      expect(repository.save).toHaveBeenCalledWith(createUserInput);
      expect(result).toEqual(createUserInput);
    });

    it('이미 저장된 닉네임인 경우 Conflict 에러를 반환해야 함', async () => {
      const createUserInput = { nickname: 'nickname' };
      await expect(service.createUser({ createUserInput })).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
