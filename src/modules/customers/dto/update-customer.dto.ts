import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Customer_Gender } from '../entities/customer.entity';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @IsInt()
  @IsNotEmpty({ message: 'Id khách hàng không thể thiếu!' })
  id: number;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  birth_day?: string;

  @IsEnum(Customer_Gender, { message: 'Giới tính không hợp lệ!' })
  gender: Customer_Gender;
}
