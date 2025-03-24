import { UserInputDTO, UserResultDTO } from '../dtos/user.dto';

export class UserInputVM {
  userData: UserInputDTO;

  constructor(userData: UserInputDTO) {
    this.userData = userData;
  }
}

export class UserResultVM {
  result: UserResultDTO;

  constructor(result: UserResultDTO) {
    this.result = result;
  }
}
