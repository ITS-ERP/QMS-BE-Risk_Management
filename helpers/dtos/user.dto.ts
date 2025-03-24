import { UserAttributes } from '../../infrastructure/models/user.model';
import { RoleUser } from '../enum/roleUser.enum';

export interface UserInputDTO {
  username: string;
  full_name: string;
  email: string;
  role: RoleUser;
  password: string;
}

export interface UserResultDTO extends UserAttributes {}
