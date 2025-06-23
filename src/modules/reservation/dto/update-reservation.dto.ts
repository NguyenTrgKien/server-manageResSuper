import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReservationStatus } from '../entities/reservation.entity';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @IsNotEmpty({ message: 'Id đơn đặt bàn không thể thiếu!' })
  id: number;

  @IsEnum(ReservationStatus, { message: 'Trạng thái đơn không hợp lệ!' })
  @IsNotEmpty({ message: 'Trạng thái cập nhật không thể thiếu!' })
  reservation_status: ReservationStatus;
}
