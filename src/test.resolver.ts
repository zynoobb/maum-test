import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class TestResolver {
  @Query(() => String)
  getHello(): string {
    return 'Hello World!';
  }
}
