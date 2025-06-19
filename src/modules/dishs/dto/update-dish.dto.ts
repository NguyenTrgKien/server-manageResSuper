import { PartialType } from '@nestjs/mapped-types';
import { CreateDishDto } from './create-dish.dto';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDishDto extends PartialType(CreateDishDto) {
  @IsNotEmpty({ message: 'Id món ăn không được thiếu!' })
  id: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  price?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  cost_price?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  proccessing_time?: number;

  @IsArray()
  @IsOptional()
  oldPublicIdImages?: string[];

  @Type(() => Number)
  @IsInt({ message: 'Mã danh mục phải là một số nguyên!' })
  @IsOptional()
  categoryId?: number;
}
