import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IUserServiceCreate } from './interfaces/user-service.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser({ createUserInput }: IUserServiceCreate): Promise<User> {
    const { nickname } = createUserInput;

    await this.findOneUserByNickName({ nickname });
    return this.usersRepository.save({
      nickname,
    });
  }

  async fetchUser({ userId }: { userId: string }): Promise<User> {
    const user = await this.findOneUserById({ userId });
    if (!user) throw new NotFoundException('존재하지 않는 사용자입니다.');
    return user;
  }

  async findOneUserByNickName({
    nickname,
  }: {
    nickname: string;
  }): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { nickname },
    });
    if (user) throw new ConflictException('이미 존재하는 닉네임입니다.');
    return user;
  }

  async findOneUserById({ userId }: { userId: string }): Promise<User> {
    return this.usersRepository.findOne({
      relations: ['answers'],
      where: { userId },
    });
  }
}
