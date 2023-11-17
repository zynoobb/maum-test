import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.dto';
import { FetchUserInput } from './dto/fetch-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.createUser({ createUserInput });
  }

  @Query(() => User)
  fetchUser(
    @Args('fetchUserInput') fetchUserInput: FetchUserInput,
  ): Promise<User> {
    return this.usersService.fetchUser({ fetchUserInput });
  }
}
