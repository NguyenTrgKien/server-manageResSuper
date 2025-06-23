import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentMethod } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsEnum(PaymentMethod)
  @IsNotEmpty({ message: 'Phương thức thanh toán không thể thiếu!' })
  payment_method: PaymentMethod;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'Tổng tiền thanh toán không thể thiếu!' })
  amount: number; // Tổng số tiền cần thanh toán

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'Số tiền thanh toán đã nhận không thể thiếu!' })
  received_amount: number; // Số tiền khách đã đưa cho nhân viên

  @IsString()
  @IsOptional()
  note?: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'Id đơn hàng không thể thiếu!' })
  orderId: number;
}
