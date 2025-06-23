import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class DishComboDto {
  @IsNumber()
  dishId: number;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsOptional()
  note?: string;
}

export class CreateComboDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên combo không thể thiếu!' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Mô tả cho combo không thể thiếu!' })
  description: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'Giá cho combo không thể thiếu!' })
  combo_price: number;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  is_featured?: boolean; // Combo nổi bật

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'Thời gian chế biến combo không thể thiếu!' })
  proccessing_time: number; // Thởi gian chế biến

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'Giá gôc của combo không được để trống!' })
  origin_price: number; // Giá gốc nếu có khuyến mãi

  @IsString()
  @IsNotEmpty({ message: 'Thông tin combo không thể thiếu!' })
  dish: string;

  @IsString()
  @IsOptional()
  publicId: string;
}
