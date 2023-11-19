import { Answer } from 'src/apis/answers/entites/answer.entity';
import { Choice } from 'src/apis/choices/entites/choice.entity';
import { Question } from 'src/apis/questions/entites/question.entity';
import { Survey } from 'src/apis/surveys/entites/survey.entity';
import { User } from 'src/apis/users/entities/user.entity';

export const survey: Survey = {
  surveyId: 1,
  subject: 'subject',
  description: 'description',
  createdAt: new Date(),
  updatedAt: new Date(),
  questions: [],
  choices: [],
  answers: [],
};

export const question: Question = {
  questionId: 1,
  content: 'content',
  createdAt: new Date(),
  updatedAt: new Date(),
  survey,
  choices: [],
  answers: [],
};

export const choice: Choice = {
  choiceId: 1,
  choiceContent: 'choiceContent',
  choiceScore: 100,
  createdAt: new Date(),
  updatedAt: new Date(),
  survey,
  question,
  answers: [],
};

export const user: User = {
  userId: 'userId',
  nickname: 'nickname',
  createdAt: new Date(),
  answers: [],
};

export const answer: Answer = {
  answerId: 1,
  survey,
  question,
  choice,
  user,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockSurveysService = () => ({
  findOneSurveyById: jest.fn(() => survey),
});

export const mockQuestionsService = () => ({
  findOneQuestionById: jest.fn(() => question),
});

export const mockChoicesService = () => ({
  findOneChoiceById: jest.fn(() => choice),
});

export const mockUsersService = () => ({
  findOneUserById: jest.fn(() => user),
});
