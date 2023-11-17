import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateQuestionInput } from './dto/create-question.dto';
import { FetchQuestionsInRangeInput } from './dto/fetch-questions-inrange.dto';
import { UpdateQuestionInput } from './dto/update-question.dto';
import { Question } from './entites/question.entity';
import { QuestionsService } from './questions.service';

@Resolver()
export class QuestionsResolver {
  constructor(private readonly questionsService: QuestionsService) {}

  @Mutation(() => Question)
  createQuestion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput,
  ): Promise<Question> {
    return this.questionsService.createQuestion({
      createQuestionInput,
    });
  }

  @Query(() => Question)
  fetchQuestion(@Args('questionId') questionId: number): Promise<Question> {
    return this.questionsService.fetchQuestion({ questionId });
  }

  @Query(() => [Question])
  fetchQuestionsInRange(
    @Args('fetchQuestionInRangeInput')
    fetchQuestionsInRangeInput: FetchQuestionsInRangeInput,
  ): Promise<Question[]> {
    return this.questionsService.fetchQuestionsInRange({
      fetchQuestionsInRangeInput,
    });
  }

  @Mutation(() => Question)
  updateQuestion(
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput,
  ): Promise<Question> {
    return this.questionsService.updateQuestion({ updateQuestionInput });
  }

  @Mutation(() => Boolean)
  deleteQuestion(@Args('questionId') questionId: number): Promise<boolean> {
    return this.questionsService.deleteQuestion({ questionId });
  }
}
