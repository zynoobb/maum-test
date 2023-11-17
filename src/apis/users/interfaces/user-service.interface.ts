import { CreateUserInput } from '../dto/create-user.dto';
import { FetchUserInput } from '../dto/fetch-user.dto';

export interface IUsersServiceCreate {
  createUserInput: CreateUserInput;
}

export interface IUserServiceFetch {
  fetchUserInput: FetchUserInput;
}
