import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ChoicesService } from './choices.service';
import { CreateChoiceInput } from './dto/create-choice.dto';
import { UpdateChoiceInput } from './dto/update-choice.dto';
import { Choice } from './entites/choice.entity';

@Resolver()
export class ChoicesResolver {
  constructor(private readonly choicesService: ChoicesService) {}

  @Mutation(() => Choice)
  createChoice(
    @Args('createChoiceInput') createChoiceInput: CreateChoiceInput,
  ): Promise<Choice> {
    return this.choicesService.createChoice({ createChoiceInput });
  }

  @Mutation(() => Choice)
  updateChoice(
    @Args('updateChoiceInput') updateChoiceInput: UpdateChoiceInput,
  ): Promise<Choice> {
    return this.choicesService.updateChoice({ updateChoiceInput });
  }
}
