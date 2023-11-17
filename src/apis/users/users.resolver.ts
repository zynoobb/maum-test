import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('nickname') nickname: string): Promise<User> {
    return this.usersService.createUser({ nickname });
  }

  @Query(() => User)
  fetchUser(@Args('userId') userId: string): Promise<User> {
    return this.usersService.fetchUser({ userId });
  }
}
