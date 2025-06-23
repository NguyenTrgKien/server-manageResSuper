import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EmployesStatus } from '../entities/employees.entity';
import { Type } from 'class-transformer';

export class UpdateEmployDto {
  @IsInt()
  @IsNotEmpty({ message: 'Id người dùng không được thiếu!' })
  id: number;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  birth_day: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  salary: number;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsOptional()
  publicId: string;

  @IsEnum(EmployesStatus, { message: 'Trạng thái nhân viên không hợp lệ!' })
  @IsOptional()
  status?: EmployesStatus;
}
