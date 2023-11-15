import { InputType, PartialType } from '@nestjs/graphql';
import { CreateSurveyInput } from './create-survey.dto';

@InputType()
export class UpdateSurveyInput extends PartialType(CreateSurveyInput) {}
