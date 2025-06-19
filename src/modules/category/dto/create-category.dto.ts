import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên danh mục không được để trống!' })
  name: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  isActive: boolean;

  @IsNotEmpty({ message: 'Mã danh mục không được để trống!' })
  code: string;
}
