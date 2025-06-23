import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Customer_Gender } from '../entities/customer.entity';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại người dùng không được để trống!' })
  phone: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  birth_day?: string;

  @IsEnum(Customer_Gender, { message: 'Giới tính không hợp lệ!' })
  @IsNotEmpty({ message: 'Giới tính người dùng không được để trống!' })
  gender: Customer_Gender;
}
