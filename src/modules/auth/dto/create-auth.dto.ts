import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsEmail({}, { message: 'Email không hợp lệ!' })
  @IsNotEmpty({ message: 'Email không được để trống!' })
  email: string;

  @MinLength(6, { message: 'Mật khẩu phải ít nhất 6 kí tự!' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống!' })
  password: string;

  @IsNotEmpty({ message: 'Tên người dùng không được để trống!' })
  username: string;
}
