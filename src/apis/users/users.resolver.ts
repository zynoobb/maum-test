import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User)
  fetchUserByNickname(
    @Args('nickname')
    nickname: string,
  ): Promise<User> {
    return this.usersService.fetchUser({ nickname });
  }

  @Mutation(() => User)
  createUser(
    @Args('nickname')
    nickname: string,
  ): Promise<User> {
    return this.usersService.createUser({ nickname });
  }
}
