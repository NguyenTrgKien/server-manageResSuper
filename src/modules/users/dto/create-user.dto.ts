import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { RoleUser } from '../entities/user.entity';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email không hợp lệ!' })
  @IsNotEmpty({ message: 'Email không được để trống!' })
  email: string;

  @MinLength(6, { message: 'Mật khẩu phải ít nhất 6 kí tự!' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống!' })
  password: string;

  @IsNotEmpty({ message: 'Tên người dùng không được để trống!' })
  username: string;

  @IsEnum(RoleUser, { message: 'Vai trò không hợp lệ!' })
  @IsOptional()
  role?: RoleUser;
}
