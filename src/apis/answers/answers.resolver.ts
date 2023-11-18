import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AnswersService } from './answers.service';
import { CreateAnswerInput } from './dto/create-answer.dto';
import {
  AnswersAndResult,
  FetchAnswersResultInput,
} from './dto/fetch-answers-result.dto';
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
  fetchAnswer(@Args('answerId') answerId: number): Promise<Answer> {
    return this.answersService.fetchAnswer({ answerId });
  }

  @Query(() => [Answer])
  fetchAnswers(): Promise<Answer[]> {
    return this.answersService.fetchAnswers();
  }

  @Query(() => [AnswersAndResult])
  fetchAnswersResult(
    @Args('fetchAnswersResultInput')
    fetchAnswersResultInput: FetchAnswersResultInput,
  ): Promise<[AnswersAndResult]> {
    return this.answersService.fetchAnswersResult({ fetchAnswersResultInput });
  }

  @Mutation(() => Answer)
  updateAnswer(
    @Args('updateAnswerInput') updateAnswerInput: UpdateAnswerInput,
  ): Promise<Answer> {
    return this.answersService.updateAnswer({ updateAnswerInput });
  }

  @Mutation(() => Boolean)
  deleteAnswer(@Args('answerId') answerId: number): Promise<boolean> {
    return this.answersService.deleteAnswer({ answerId });
  }
}
