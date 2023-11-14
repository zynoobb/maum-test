import {
  BadRequestException,
  ConflictException,
  Injectable,
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

  async createUser({ nickname }: { nickname: string }): Promise<User> {
    const user = await this.fetchUser({ nickname });
    if (nickname.length > 50)
      throw new BadRequestException('입력값 길이 초과입니다.');
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
