import { Injectable } from '@nestjs/common';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Floor_Number } from '../entities/area.entity';

@Injectable()
export class UpdateAreaDto {
  @IsNotEmpty({ message: 'Id khu vực không thể thiếu!' })
  id: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(Floor_Number, { message: 'Tầng nhà hàng không hợp lệ' })
  @IsOptional()
  floor_number: Floor_Number;
}
