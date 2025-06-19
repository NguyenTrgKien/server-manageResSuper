import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsInt({ message: 'Id phải là một số nguyên!' })
  @IsNotEmpty({ message: 'Id danh mục không được thiếu!' })
  id: number;

  @IsString()
  name: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  isActive: boolean;
}
