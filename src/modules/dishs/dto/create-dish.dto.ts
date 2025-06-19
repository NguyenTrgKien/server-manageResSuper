import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDishDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên món ăn không thể thiếu!' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Mô tả cho món ăn không thể thiếu!' })
  description: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'Giá món ăn không thể thiếu!' })
  price: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'Giá gốc món ăn không thể thiếu!' })
  cost_price: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'Thời gian chế biến món ăn không thể thiếu!' })
  proccessing_time: number;

  @Type(() => Number)
  @IsInt({ message: 'Mã danh mục phải là một số nguyên!' })
  @IsNotEmpty({ message: 'Mã danh mục không được để trống!' })
  categoryId: number;
}
