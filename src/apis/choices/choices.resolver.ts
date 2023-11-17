import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChoicesService } from './choices.service';
import { CreateChoiceInput } from './dto/create-choice.dto';
import { DeleteChoiceInput } from './dto/delete-choice.dto';
import { FetchChoiceInput } from './dto/fetch-choice.dto';
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
  fetchChoice(
    @Args('fetchChoiceInput') fetchChoiceInput: FetchChoiceInput,
  ): Promise<Choice> {
    return this.choicesService.findOneChoiceById({ fetchChoiceInput });
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
  deleteChoice(
    @Args('deleteChoiceInput') deleteChoiceInput: DeleteChoiceInput,
  ): Promise<boolean> {
    return this.choicesService.deleteChoice({ deleteChoiceInput });
  }
}
