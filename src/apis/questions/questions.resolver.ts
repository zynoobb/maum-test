import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateQuestionInput } from './dto/create-question.dto';
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
}
