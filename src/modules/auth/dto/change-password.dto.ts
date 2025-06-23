import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePassworDto {
  @IsString()
  @IsNotEmpty({ message: 'Token không được thiếu!' })
  token: string;

  @IsString()
  @IsNotEmpty({ message: 'Email ngươi dùng không được thiếu!' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu mới không được thiếu!' })
  password: string;
}
