import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IUsersServiceCreate } from './interfaces/user-service.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser({ createUserInput }: IUsersServiceCreate): Promise<User> {
    const { nickname } = createUserInput;
    const user = await this.fetchUser({ nickname });
    if (user) throw new ConflictException('이미 존재하는 닉네임입니다.');

    return this.usersRepository.save({
      nickname,
    });
  }

  async fetchUser({ nickname }: { nickname: string }): Promise<User> {
    return this.usersRepository.findOne({
      where: { nickname },
    });
  }
}
