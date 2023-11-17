import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  IUserServiceFetch,
  IUsersServiceCreate,
} from './interfaces/user-service.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser({ createUserInput }: IUsersServiceCreate): Promise<User> {
    const { nickname } = createUserInput;
    await this.findOneByNickName({ nickname });

    return this.usersRepository.save({
      nickname,
    });
  }

  async fetchUser({ fetchUserInput }: IUserServiceFetch): Promise<User> {
    const { userId } = fetchUserInput;
    const user = await this.usersRepository.findOne({
      where: { userId },
    });
    if (!user) throw new NotFoundException('존재하지 않는 사용자입니다.');

    return user;
  }

  async findOneByNickName({ nickname }: { nickname: string }): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { nickname },
    });
    if (user) throw new ConflictException('이미 존재하는 닉네임입니다.');
    return user;
  }
}
