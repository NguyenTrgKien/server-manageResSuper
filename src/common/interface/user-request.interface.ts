import { Request } from 'express';
import { UserType } from './user.interface';

export interface UserRequest extends Request {
  user: UserType;
}
