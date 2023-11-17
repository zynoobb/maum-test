import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AnswersService } from './answers.service';
import { CreateAnswerInput } from './dto/create-answer.dto';
import { FetchAnswerInput } from './dto/fetch-answer.dto';
import { UpdateAnswerInput } from './dto/update-answer.dto';
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
  fetchAnswer(
    @Args('fetchAnswerInput') fetchAnswerInput: FetchAnswerInput,
  ): Promise<Answer> {
    return this.answersService.findOneAnswerById({ fetchAnswerInput });
  }

  @Mutation(() => Answer)
  updateAnswer(
    @Args('updateAnswerInput') updateAnswerInput: UpdateAnswerInput,
  ) {
    return this.answersService.updateAnswer({ updateAnswerInput });
  }
}
