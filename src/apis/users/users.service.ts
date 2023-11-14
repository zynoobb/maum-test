import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser({ nickname }): Promise<User> {
    const user = this.fetchUser({ nickname });
    if (user) throw new ConflictException('이미 존재하는 닉네임입니다.');

    return this.usersRepository.save({
      nickname,
    });
  }

  async fetchUser({ nickname }: { nickname: string }): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { nickname },
    });

    if (!user) throw new NotFoundException('해당 유저가 존재하지 않습니다.');
    return user;
  }
}
