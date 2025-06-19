import { RoleUser } from 'src/modules/users/entities/user.entity';

export interface UserType {
  id: number;
  username: string;
  email: string;
  role: RoleUser;
}
