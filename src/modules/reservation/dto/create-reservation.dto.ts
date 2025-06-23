import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Column } from 'typeorm';

export class CreateReservationDto {
  @IsDateString()
  @IsNotEmpty({ message: 'Ngày đặt bàn không được thiếu!' })
  reservation_date: string;

  @IsString()
  @IsOptional()
  note?: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'Id bàn không thể thiếu!' })
  tableId: number;

  @IsString()
  @IsOptional()
  customer_name: string;

  @Column()
  @IsOptional()
  customer_phone: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'Só lượng khách hàng đến không được thiếu!' })
  number_of_people: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'Khung giờ không được để trống!' })
  timeframeId: number;

  @Type(() => Number)
  @IsArray({ message: 'Danh sách id đơn hàng phải là một mảng!' })
  @IsNumber({}, { each: true, message: 'Mỗi id đơn hàng phải là một số!' })
  @IsOptional()
  orderIds?: number[];
}
