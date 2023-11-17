import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AnswersService } from './answers.service';
import { CreateAnswerInput } from './dto/create-answer.dto';
import { Answer } from './entites/answer.entity';

@Resolver()
export class AnswersResolver {
  constructor(private readonly answersService: AnswersService) {}

  @Mutation(() => Answer)
  createAnswer(
    @Args('createAnswerInput') createAnswerInput: CreateAnswerInput,
  ): Promise<Answer> {
    return this.answersService.createAnswer({ createAnswerInput });
  }

  @Query(() => Answer)
  fetchAnswer(@Args('answerId') answerId: number): Promise<Answer> {
    return this.answersService.fetchAnswer({ answerId });
  }
}
