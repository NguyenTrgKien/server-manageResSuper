import { PartialType } from '@nestjs/mapped-types';
import { CreateComboDto } from './create-combo.dto';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateComboDto extends PartialType(CreateComboDto) {
  @IsInt()
  @IsNotEmpty({ message: 'Id combo không được để trống!' })
  id: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @Type(() => Number)
  @IsNumber()
  combo_price: number;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  is_featured?: boolean; // Combo nổi bật

  @Type(() => Number)
  @IsNumber()
  proccessing_time: number; // Thởi gian chế biến

  @Type(() => Number)
  @IsNumber()
  origin_price: number; // Giá gốc nếu có khuyến mãi

  @IsString()
  dish: string;

  @IsString()
  @IsOptional()
  publicId: string;
}
