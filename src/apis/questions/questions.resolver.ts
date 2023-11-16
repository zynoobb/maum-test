import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateQuestionInput } from './dto/create-question.dto';
import { DeleteQuestionInput } from './dto/delete-question.dto';
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

  @Mutation(() => Question)
  updateQuestion(
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput,
  ): Promise<Question> {
    return this.questionsService.updateQuestion({ updateQuestionInput });
  }

  @Mutation(() => Boolean)
  deleteQuestion(
    @Args('deleteQuestionInput') deleteQuestionInput: DeleteQuestionInput,
  ): Promise<boolean> {
    return this.questionsService.deleteQuestion({ deleteQuestionInput });
  }
}
