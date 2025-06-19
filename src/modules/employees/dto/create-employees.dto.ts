import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EmployesStatus } from '../entities/employees.entity';

export class CreateEmployessDto {
  @IsString()
  @IsNotEmpty({ message: 'Họ tên nhân viên không được thiếu!' })
  fullName: string;

  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại nhân viên không được thiếu!' })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ nhân viên không được thiếu!' })
  address: string;

  @IsNotEmpty({ message: 'Ngày sinh nhân viên không được thiếu!' })
  birth_day: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'Tiền lương nhân viên không được thiếu!' })
  salary: number;

  @IsEnum(EmployesStatus, { message: 'Trạng thái nhân viên không hợp lệ!' })
  @IsOptional()
  status?: EmployesStatus;
}
