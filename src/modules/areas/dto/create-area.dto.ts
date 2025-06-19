import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Floor_Number } from '../entities/area.entity';

export class CreateAreaDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên khu vực không được để trống!' })
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(Floor_Number, { message: 'Tầng nhà hàng không hợp lệ' })
  @IsNotEmpty({ message: 'Số tầng nhà hàng không được để trống!' })
  floor_number: Floor_Number;
}
