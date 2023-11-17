import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChoicesService } from './choices.service';
import { CreateChoiceInput } from './dto/create-choice.dto';
import { FetchChoicesInRangeInput } from './dto/fetch-choices-inrange.dto';
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

  @Query(() => Choice)
  fetchChoice(@Args('choiceId') choiceId: number): Promise<Choice> {
    return this.choicesService.fetchChoice({ choiceId });
  }

  @Query(() => [Choice])
  fetchChoicesInRange(
    @Args('fetchChoicesInRangeInput')
    fetchChoicesInRangeInput: FetchChoicesInRangeInput,
  ): Promise<Choice[]> {
    return this.choicesService.fetchChoicesInRange({
      fetchChoicesInRangeInput,
    });
  }

  @Mutation(() => Choice)
  updateChoice(
    @Args('updateChoiceInput') updateChoiceInput: UpdateChoiceInput,
  ): Promise<Choice> {
    return this.choicesService.updateChoice({ updateChoiceInput });
  }

  @Mutation(() => Boolean)
  deleteChoice(@Args('choiceId') choiceId: number): Promise<boolean> {
    return this.choicesService.deleteChoice({ choiceId });
  }
}
